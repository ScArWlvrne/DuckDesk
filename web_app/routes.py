from distutils import dep_util
from email import message
from email.policy import HTTP
from http import HTTPStatus
from flask import Blueprint, Flask, jsonify, request, render_template, redirect, url_for, session
from sqlalchemy import case, or_, Integer, cast, asc
from sqlalchemy.orm import joinedload, aliased
from web_app.app import db
from datetime import datetime, timedelta
from time import sleep
from web_app.models import ArchivedResponse, Department, Major, Minor, User, PendingUser, Ticket, ArchivedTicket, TicketStatus, Response
import os
import resend
import secrets
import string
import bcrypt

bp = Blueprint('main', __name__)
resend.api_key = os.getenv("RESEND_API_KEY")

@bp.route('/api/login', methods=['POST']) 
def login():
    data = request.get_json()
    email = data.get('email')
    input_pw = data.get('password')

    if not email or not input_pw: return jsonify({"error": "Email and password required"}), HTTPStatus.BAD_REQUEST
    
    user: User | None = User.query.filter_by(email=email).first()
    if not user or not bcrypt.checkpw(input_pw.encode('utf-8'), user.password_hash): return jsonify({"error": "Incorrect email or password"}), HTTPStatus.BAD_REQUEST
    
    session['user_id'] = user.user_id

    return jsonify({"message": "User logged in"}), HTTPStatus.OK

@bp.route('/api/signup', methods=['POST']) 
def signup():
    data = request.get_json()

    email = data.get('email')
    name = data.get('name')
    role = data.get('role', 'student')
    password = data.get('password')

    if not email or not name or not password:
        return "Error: Email, name, and password are required.", HTTPStatus.BAD_REQUEST

    existing = User.query.filter_by(email=email).first()
    if existing:
        return f"User with email {email} already exists.", HTTPStatus.BAD_REQUEST
    
    try:
        alphabet = string.ascii_uppercase + string.digits
        code = ''.join(secrets.choice(alphabet) for _ in range(5))
        params = {
            "from": "DuckDesk <no-reply@duckdesk.org>",
            "to": f"{email}",
            "subject": "DuckDesk Email Verification",
            "html": f"<p>Thank you for signing up for DuckDesk! Your verification code is: <strong>{code}</strong>.</p>",
        }

        resend.Emails.send(params)
    
    except Exception as e:
        return jsonify({"message": "Unable to send email", "error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    pending = PendingUser(email=email,
                            display_name=name,
                            role=role,
                            password_hash=hashed_pw,
                            verification_code=code,
                            expires_at=datetime.utcnow() + timedelta(minutes=10)
                        )

    db.session.add(pending)
    db.session.commit()

    return jsonify({"message": "Verification email sent"}), HTTPStatus.OK 

@bp.route('/api/verify/<string:email>', methods=['POST'])
def verify(email):
    data = request.get_json()
    
    code = data.get('code')

    pending = PendingUser.query.filter_by(email=email).first()
    if not pending:
        return "No pending signup found", 404

    if datetime.utcnow() > pending.expires_at:
        db.session.delete(pending)
        db.session.commit()
        return "Verification code expired", 400

    if pending.verification_code != code:
        return "Incorrect verification code", 400

    # Create real user
    user = User(
        email=pending.email,
        display_name=pending.display_name,
        role=pending.role,
        password_hash=pending.password_hash
    )
    db.session.add(user)

    # Remove pending entry
    db.session.delete(pending)
    db.session.commit()

    # Log them in
    session['user_id'] = user.user_id

    return jsonify({"message": "New user successfuly created"}), HTTPStatus.CREATED

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
    assignee = data.get('assignee')

    if not all([department, subject, message]):
        return jsonify({"message": "Incomplete ticket structure"}), HTTPStatus.BAD_REQUEST
   
   
    new_ticket = Ticket(author=author, department=department, subject=subject, message=message, status=TicketStatus.AWAITING_ASSIGNEE, assignee=assignee) # type:ignore
    
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
    assignee: str | None = data.get('assignee')
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

    if current_user.role not in ['admin', 'advisor'] and current_user != ticket.author_user:
        return jsonify({"error": "Not authorized to update this ticket"}), HTTPStatus.UNAUTHORIZED

    if current_user.role in ['admin', 'advisor']:
        if priority: ticket.priority = priority
        if status: ticket.status = TicketStatus[status.upper()]
        

    if department: ticket.department = department
    if message: ticket.message = message
    if subject: ticket.subject = subject
    if assignee: ticket.assignee = assignee

    try:
        ticket.dbwrite(True)
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error committing ticket to database", "error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

    return jsonify({"message": "Ticket modified successfully", "ticket": ticket.to_dict()}), HTTPStatus.OK

@bp.route('/api/get_users', methods=['GET'])
def get_users():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "No user logged in"}), HTTPStatus.UNAUTHORIZED

    current_user = User.query.get(user_id)
    if not current_user or current_user.role not in ['advisor', 'admin']:
        return jsonify({"error": "Not authorized to view users"}), HTTPStatus.FORBIDDEN

    # Pagination params
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)

    query = User.query

    # Optional filters
    if 'role' in request.args:
        query = query.filter(User.role == request.args['role'])

    if 'email' in request.args:
        query = query.filter(User.email.ilike(f"%{request.args['email']}%"))

    if 'name' in request.args:
        query = query.filter(User.display_name.ilike(f"%{request.args['name']}%"))

    if 'major_id' in request.args:
        query = query.filter(User.major_id == int(request.args['major_id']))

    if 'minor_id' in request.args:
        query = query.filter(User.minor_id == int(request.args['minor_id']))

    if 'department_id' in request.args:
        query = query.filter(User.department_id == int(request.args['department_id']))

    # Sorting by created_at newest first
    pagination = query.order_by(User.created_at.desc()).paginate(page=page, per_page=per_page)  # type:ignore
    users = pagination.items

    users_data = [u.to_dict() for u in users]

    response = {
        "users": users_data,
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
 
@bp.route('/api/user_details', methods = ['GET'])
def user_details():
    data = request.get_json()

    user_id = data.get('user_id')
    if not user_id:
        return jsonify({"message": "No user specified"}), HTTPStatus.BAD_REQUEST
    
    current_user: User | None = User.query.get(session.get('user_id'))

    if not current_user: return jsonify({"message": "No user logged in"}), HTTPStatus.UNAUTHORIZED

    if current_user.role not in ['admin', 'advisor'] and user_id != session.get('user_id'):
        return jsonify({"error": "Not authorized to view user details"}), HTTPStatus.UNAUTHORIZED
    
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

@bp.route('/api/get_archived_tickets', methods=['GET'])
def get_archived_tickets():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"message": "No user logged in"}), HTTPStatus.UNAUTHORIZED

    current_user = User.query.get(user_id)

    # Status ordering identical to active version
    status_order = case(
        (cast(ArchivedTicket.status, Integer) == 1, 1),
        (cast(ArchivedTicket.status, Integer) == 3, 2),
        (cast(ArchivedTicket.status, Integer) == 2, 3),
        (cast(ArchivedTicket.status, Integer) == 0, 4),
        else_=5
    )

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)

    query = ArchivedTicket.query

    # Filter matches active version
    if 'status' in request.args:
        query = query.filter(cast(ArchivedTicket.status, Integer) == int(request.args['status']))

    if 'department' in request.args:
        query = query.filter(ArchivedTicket.department == int(request.args['department']))

    if 'priority' in request.args:
        query = query.filter(ArchivedTicket.priority == int(request.args['priority']))

    if 'created' in request.args:
        created = datetime.strptime(request.args['created'], "%Y-%m-%d")
        query = query.filter(ArchivedTicket.created_at == created)

    if 'updated' in request.args:
        updated = datetime.strptime(request.args['updated'], "%Y-%m-%d")
        query = query.filter(ArchivedTicket.last_updated == updated)

    if 'text' in request.args:
        search_term = request.args['text']
        terms = search_term.split()

        author_alias = aliased(User)
        assignee_alias = aliased(User)

        query = query.join(author_alias, ArchivedTicket.author_user)
        query = query.join(assignee_alias, ArchivedTicket.assignee_user)

        query = query.filter(
            or_(
                *[ArchivedTicket.subject.ilike(f"%{term}%") for term in terms],
                *[ArchivedTicket.message.ilike(f"%{term}%") for term in terms],
                author_alias.display_name.ilike(f"%{search_term}%"),
                assignee_alias.display_name.ilike(f"%{search_term}%"),
            )
        )

    # Advisors and admins can see all, students only their own
    if current_user.role in ['advisor', 'admin']:
        pagination = query.order_by(status_order, ArchivedTicket.last_updated.desc()).options(
            joinedload(ArchivedTicket.author_user),
            joinedload(ArchivedTicket.assignee_user)
        ).paginate(page=page, per_page=per_page)
        tickets = pagination.items
    else:
        pagination = query.order_by(status_order, ArchivedTicket.last_updated.desc()).filter_by(author=user_id).options(
            joinedload(ArchivedTicket.author_user),
            joinedload(ArchivedTicket.assignee_user)
        ).paginate(page=page, per_page=per_page)
        tickets = pagination.items

    # Format output identical to non-archived version
    tickets_data = []
    for t in tickets:
        ticket_dict = t.to_dict()
        ticket_dict["author_name"] = t.author_user.display_name if t.author_user else None
        ticket_dict["assignee_name"] = t.assignee_user.display_name if t.assignee_user else None
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
        "prev_page": pagination.prev_num,
    }

    return jsonify(response), HTTPStatus.OK


@bp.route('/api/ticket_details', methods=['GET'])
def ticket_details():
    
    
    ticket_id = request.args.get('ticket_id')
    if not ticket_id:
        return jsonify({"error": "ticket_id is required"}), HTTPStatus.BAD_REQUEST
    
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"message": "No user logged in"}), HTTPStatus.UNAUTHORIZED
    
    current_user = User.query.get(user_id)

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

@bp.route('/api/archived_ticket_details', methods=['GET'])
def archived_ticket_details():
    ticket_id = request.args.get('ticket_id')
    if not ticket_id:
        return jsonify({"error": "ticket_id is required"}), HTTPStatus.BAD_REQUEST

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"message": "No user logged in"}), HTTPStatus.UNAUTHORIZED

    current_user = User.query.get(user_id)

    ticket = ArchivedTicket.query.filter_by(ticket_id=ticket_id).first()
    if not ticket:
        return jsonify({"error": "Ticket not found"}), HTTPStatus.NOT_FOUND

    # Students can only see their own archived tickets
    if current_user.role not in ['advisor', 'admin']:
        if ticket.author_user.user_id != user_id:
            return jsonify({"error": "User permissions do not allow viewing this ticket"}), HTTPStatus.UNAUTHORIZED

    responses = ArchivedResponse.query.filter_by(ticket=ticket_id).order_by(asc(ArchivedResponse.created_at)).all()
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
        return jsonify({"error": "No user logged in"}), HTTPStatus.UNAUTHORIZED
    
    current_user: User | None = User.query.get(user_id)
    if not current_user:
        return jsonify({"error": "user not found"}), HTTPStatus.UNAUTHORIZED
    
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
        
    new_response = Response(message = data.get("message"), ticket = ticket_id, author=current_user.user_id) #type:ignore

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
    data = request.get_json()
    if not user_id:
        return jsonify({"message": "No user logged in"}), HTTPStatus.UNAUTHORIZED
    
    current_user = User.query.get(user_id)
    if not current_user or current_user.role not in ['advisor', 'admin']:
        return jsonify({"error": "Not authorized to archive tickets"}), HTTPStatus.UNAUTHORIZED
    
    ticket_id = data.get("ticket_id")
    if not ticket_id:
        return jsonify({"error": "ticket_id is required"}), HTTPStatus.BAD_REQUEST

    old_ticket = Ticket.query.get(ticket_id)
    if not old_ticket:
        return jsonify({"error": "Ticket not found"}), HTTPStatus.NOT_FOUND

    responses = Response.query.filter_by(ticket=ticket_id).all()

    try:
        # Create archived ticket
        new_ticket = ArchivedTicket(
            author=old_ticket.author,
            assignee=old_ticket.assignee,
            department=old_ticket.department,
            priority=old_ticket.priority,
            subject=old_ticket.subject,
            message=old_ticket.message,
            status=int(old_ticket.status),   # ⭐ ensure integer
            created_at=old_ticket.created_at,
            last_updated=old_ticket.last_updated
        )
        db.session.add(new_ticket)
        db.session.flush()  # get new_ticket.ticket_id

        # Archive responses
        for r in responses:
            ar = ArchivedResponse(
                message=r.message,
                created_at=r.created_at,
                ticket=new_ticket.ticket_id,
                author=r.author
            )
            db.session.add(ar)

        # Delete active responses and ticket
        for r in responses:
            db.session.delete(r)
        db.session.delete(old_ticket)

        # Final commit
        db.session.commit()

        return jsonify({"message": "Ticket archived"}), HTTPStatus.OK

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Unable to archive ticket", "details": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR
