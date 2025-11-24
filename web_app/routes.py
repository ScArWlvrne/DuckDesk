from distutils import dep_util
from email import message
from email.policy import HTTP
from http import HTTPStatus
from flask import Blueprint, Flask, jsonify, request, render_template, redirect, url_for, session
from sqlalchemy import case, or_, Integer, cast, asc
from sqlalchemy.orm import joinedload, aliased
from web_app.app import db
from datetime import datetime
from time import sleep
from web_app.models import Department, Major, Minor, User, Ticket, ArchivedTicket, TicketStatus, Response

bp = Blueprint('main', __name__)

@bp.route('/')
def home():
    # For now, just show users to confirm connection
    users = User.query.all()
    return render_template('home.html', users=users)

@bp.route('/login/<int:user_id>')
def login(user_id):
    session['user_id'] = user_id
    return redirect(url_for('main.get_tickets'))

@bp.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form.get('email')
        name = request.form.get('name')
        role = request.form.get('role', 'student')

        if not email or not name:
            return "Error: Email and name are required.", 400

        existing = User.query.filter_by(email=email).first()
        if existing:
            return f"User with email {email} already exists.", 400

        new_user = User(email=email, display_name=name, role=role) # type:ignore
        new_user.dbwrite(True) # now using new dbwrite method

        return redirect(url_for('main.home'))  # go back to homepage after signing up

    # If it's a GET request, show the signup form
    return render_template('signup.html')

@bp.route('/api/submit_ticket', methods=['POST'])
def submit_ticket():
    user_id = session.get('user_id')
    data = request.get_json()

    if not user_id:
        return jsonify({"error": "No user logged in"}), HTTPStatus.UNAUTHORIZED
    
    author = session.get('user_id')
    department = data.get('department')
    subject = data.get('subject')
    message = data.get('message')

    if not all([department, subject, message]):
        return jsonify({"message": "Incomplete ticket structure"}), HTTPStatus.BAD_REQUEST
   
   
    new_ticket = Ticket(author=author, department=department, subject=subject, message=message, status=TicketStatus.AWAITING_ASSIGNEE) # type:ignore
    
    try:
        new_ticket.dbwrite(True)
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error committing ticket to database", "error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

    
    return jsonify({"message": "Ticket submitted successfully", "ticket": new_ticket.to_dict()}), HTTPStatus.CREATED

@bp.route('/api/update_ticket', methods = ['POST'])
def update_ticket():
    user_id = session.get('user_id')
    data = request.get_json()

    if not user_id:
        return jsonify({"error": "No user logged in"}), HTTPStatus.UNAUTHORIZED
    
    current_user: User | None = User.query.get(user_id)
    if not current_user:
        return jsonify({"error": "Could not find user"}), HTTPStatus.UNAUTHORIZED
    
    ticket_id: int = data.get('ticket_id')
    department: int | None = data.get('department')
    subject: str | None = data.get('subject')
    message: str | None = data.get('message')
    priority: int | None = data.get('priority')
    status: str | None = data.get('status')

    if not ticket_id:
        return jsonify({"error": "ticket_id is required"}), HTTPStatus.BAD_REQUEST

    ticket: Ticket | None = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify({"error": "Could not find ticket"}), HTTPStatus.NOT_FOUND

    if ticket.status == TicketStatus.CLOSED and current_user.role not in ['advisor', 'admin']:
        return jsonify({"error": "Ticket closed; no updates allowed"}), HTTPStatus.UNAUTHORIZED

    if current_user.role not in ['admin', 'advisor'] or current_user != ticket.author_user:
        return jsonify({"error": "Not authorized to update this ticket"}), HTTPStatus.UNAUTHORIZED

    if current_user.role in ['admin', 'advisor']:
        if priority: ticket.priority = priority
        if status: ticket.status = TicketStatus[status.upper()]
        

    if department: ticket.department = department
    if message: ticket.message = message
    if subject: ticket.subject = subject

    try:
        ticket.dbwrite(True)
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error committing ticket to database", "error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

    return jsonify({"message": "Ticket modified successfully", "ticket": ticket.to_dict()}), HTTPStatus.OK
    
@bp.route('/api/current_user', methods = ['GET'])
def current_user():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"message": "No user logged in"}), HTTPStatus.UNAUTHORIZED
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), HTTPStatus.NOT_FOUND

    return jsonify(user.to_dict()), HTTPStatus.OK

@bp.route('/api/get_tickets', methods = ['GET'])
def get_tickets():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"message": "No user logged in"}), HTTPStatus.UNAUTHORIZED
    
    current_user = User.query.get(user_id)

    # Order by status priority: OPEN (1) first, then AWAITING_ASSIGNEE (3), then AWAITING_AUTHOR (2), then CLOSED (0)
    # Cast status to integer since the database column is text type (migration issue)
    status_order = case(
        (cast(Ticket.status, Integer) == 1, 1), # OPEN
        (cast(Ticket.status, Integer) == 3, 2), # AWAITING_ASSIGNEE
        (cast(Ticket.status, Integer) == 2, 3), # AWAITING_AUTHOR
        (cast(Ticket.status, Integer) == 0, 4), # CLOSED
        else_=5
    )

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)

    query = Ticket.query

    if 'status' in request.args:
        query = query.filter(cast(Ticket.status, Integer) == int(request.args['status']))
        
    if 'department' in request.args:
        query = query.filter(Ticket.department == int(request.args['department']))

    if 'priority' in request.args:
        query = query.filter(Ticket.priority == int(request.args['priority']))
    
    if 'created' in request.args:
        created = datetime.strptime(request.args['created'], "%Y-%m-%d")
        query = query.filter(Ticket.created_at == created)

    if 'updated' in request.args:
        updated = datetime.strptime(request.args['updated'], "%Y-%m-%d")
        query = query.filter(Ticket.last_updated == updated)

    if 'text' in request.args:
        search_term = request.args['text']
        terms = search_term.split()

        author_alias = aliased(User)
        assignee_alias = aliased(User)

        query = query.join(author_alias, Ticket.author_user) # type:ignore
        query = query.join(assignee_alias, Ticket.assignee_user) # type:ignore
        query = query.filter(
            or_(
                *[Ticket.subject.ilike(f"%{term}%") for term in terms],
                *[Ticket.message.ilike(f"%{term}%") for term in terms],
                author_alias.display_name.ilike(f"%{search_term}%"),
                assignee_alias.display_name.ilike(f"%{search_term}%"),
            )
        )
    
    if current_user.role in ['advisor', 'admin']: # type:ignore
        # Fetch all tickets from the database
        pagination = query.order_by(status_order, Ticket.last_updated.desc()).options(
            joinedload(Ticket.author_user),
            joinedload(Ticket.assignee_user)
        ).paginate(page=page, per_page=per_page)  # type:ignore
        tickets = pagination.items
    else:
        # Fetch only tickets authored by the student
        pagination = query.order_by(status_order, Ticket.last_updated.desc()).filter_by(author=user_id).options(
            joinedload(Ticket.author_user),
            joinedload(Ticket.assignee_user)
        ).paginate(page=page, per_page=per_page)  # type:ignore
        tickets = pagination.items

    # Enhance ticket data with related display names
    department_ids = {t.department for t in tickets if t.department}
    department_map = {}
    if department_ids:
        depts = Department.query.filter(Department.department_id.in_(department_ids)).all()
        department_map = {
            d.department_id: d.display_name or d.name or f"Department {d.department_id}"
            for d in depts
        }

    tickets_data = []
    for t in tickets:
        ticket_dict = t.to_dict()
        ticket_dict['author_name'] = t.author_user.display_name if t.author_user else None  # type:ignore
        ticket_dict['assignee_name'] = t.assignee_user.display_name if t.assignee_user else None  # type:ignore
        ticket_dict['department_name'] = (
            (t.dept_name.display_name if t.dept_name and t.dept_name.display_name else None)
            or (t.dept_name.name if t.dept_name and t.dept_name.name else None)
            or department_map.get(t.department)
            or (f"Department {t.department}" if t.department else None)
        )
        tickets_data.append(ticket_dict)

    response = {
        "tickets": tickets_data,
        "page": pagination.page,
        "per_page": pagination.per_page,
        "total_pages": pagination.pages,
        "total_items": pagination.total,
        "has_next": pagination.has_next,
        "has_prev": pagination.has_prev,
        "next_page": pagination.next_num,
        "prev_page": pagination.prev_num
    }
   
    return jsonify(response), HTTPStatus.OK


@bp.route('/api/ticket_details', methods=['GET'])
def ticket_details():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"message": "No user logged in"}), HTTPStatus.UNAUTHORIZED
    
    current_user = User.query.get(user_id)
    
    ticket_id = request.args.get('ticket_id')
    if not ticket_id:
        return jsonify({"error": "ticket_id is required"}), HTTPStatus.BAD_REQUEST

    ticket = Ticket.query.filter_by(ticket_id=ticket_id).first()
    if not ticket:
        return jsonify({"error": "Ticket not found"}), HTTPStatus.NOT_FOUND

    if current_user.role in ['advisor', 'admin']: # type:ignore
        pass
    else:
        if ticket.author_user.user_id != user_id:
            return jsonify({"error": "User permissions do not allow viewing this ticket"}), HTTPStatus.UNAUTHORIZED

    responses = Response.query.filter_by(ticket=ticket_id).order_by(asc(Response.created_at)).all()
    response_list = [r.to_dict() for r in responses]

    response = {
        "author": ticket.author_user.display_name if ticket.author_user else None,
        "assignee": ticket.assignee_user.display_name if ticket.assignee_user else None,
        "department": ticket.dept_name.name if ticket.dept_name else None,
        "priority": ticket.priority,
        "subject": ticket.subject,
        "body": ticket.message,
        "status": TicketStatus(ticket.status).name if ticket.status is not None else None,
        "created_at": ticket.created_at.isoformat() if ticket.created_at else None,
        "last_updated": ticket.last_updated.isoformat() if ticket.last_updated else None,
        "responses": response_list
    }

    return jsonify(response), HTTPStatus.OK

@bp.route('/api/create_response', methods=['POST'])
def create_response():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"message": "No user logged in"}), HTTPStatus.UNAUTHORIZED
    
    current_user = User.query.get(user_id)
    data = request.get_json()
    # {
    #     ticket_id: [ticket_id],
    #     message: [message],
    # }

    ticket_id = data.get("ticket_id")

    if not ticket_id:
        return jsonify({"error": "ticket does not exist"}), HTTPStatus.BAD_REQUEST

    ticket: Ticket | None = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify({"error": "Ticket not found"}), HTTPStatus.NOT_FOUND

    if ticket.status == TicketStatus.CLOSED and current_user.role not in ['advisor', 'admin']:
        return jsonify({"error": "Ticket closed; no updates allowed"}), HTTPStatus.UNAUTHORIZED

    if current_user.role in ['advisor', 'admin']: # type:ignore
        ticket.status = TicketStatus.AWAITING_AUTHOR
    elif ticket.author_user.user_id != user_id:
            return jsonify({"error": "User permissions do not allow responding to this ticket"}), HTTPStatus.UNAUTHORIZED
    else:
        ticket.status = TicketStatus.AWAITING_ASSIGNEE
        
    new_response = Response(message = data.get("message"), ticket = ticket_id) #type:ignore

    try:
        new_response.dbwrite(True)
        ticket.dbwrite(True)
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error committing ticket response to database", "error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR
    
    return jsonify({"message": "response successfully submitted"}), HTTPStatus.CREATED

@bp.route('/api/archive_ticket', methods=['POST'])
def archive_ticket():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"message": "No user logged in"}), HTTPStatus.UNAUTHORIZED
    
    current_user = User.query.get(user_id)

    if not current_user or current_user.role not in ['advisor', 'admin']:
        return jsonify({"error": "Not authorized to archive tickets"}), HTTPStatus.UNAUTHORIZED
    
    ticket_id = request.args.get("ticket_id")
    if not ticket_id:
        return jsonify({"error": "ticket does not exist"}), HTTPStatus.BAD_REQUEST

    old_ticket: Ticket | None = Ticket.query.get(ticket_id)
    if not old_ticket:
        return jsonify({"error": "Ticket not found"}), HTTPStatus.NOT_FOUND
    

    author = old_ticket.author
    assignee = old_ticket.assignee
    department = old_ticket.department
    priority = old_ticket.priority
    subject = old_ticket.subject
    message = old_ticket.message
    status = old_ticket.status
    created_at = old_ticket.created_at
    last_updated = old_ticket.last_updated

    new_ticket = ArchivedTicket(ticket_id=ticket_id, author=author, assignee=assignee, department=department, priority=priority, subject=subject, message=message, status=status, created_at=created_at, last_updated=last_updated)

    try:
        new_ticket.dbwrite(True)
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error archiving ticket", "error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

    for i in range(10):
        try:
            db.session.delete(old_ticket)
            db.session.commit()
            return jsonify({"message": "Ticket archived"}), HTTPStatus.OK
        except:
            db.session.rollback()
            sleep(0.5)

    return jsonify({"error": "Unable to archive ticket"}), HTTPStatus.INTERNAL_SERVER_ERROR
