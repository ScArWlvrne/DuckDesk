from http import HTTPStatus
from flask import Blueprint, Flask, jsonify, request, render_template, redirect, url_for, session
from sqlalchemy import case, or_
from sqlalchemy.orm import joinedload, aliased
from web_app.app import db
from datetime import datetime
from web_app.models import Department, Major, Minor, User, Ticket

bp = Blueprint('main', __name__)

@bp.route('/')
def home():
    # For now, just show users to confirm connection
    users = User.query.all()
    return render_template('home.html', users=users)

@bp.route('/login/<int:user_id>')
def login(user_id):
    session['user_id'] = user_id
    return redirect(url_for('main.submit_ticket'))

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
        new_user.dbwrite() # now using new dbwrite method

        return redirect(url_for('main.home'))  # go back to homepage after signing up

    # If it's a GET request, show the signup form
    return render_template('signup.html')

@bp.route('/api/submit_ticket', methods=['POST'])
def submit_ticket():
    user_id = session.get('user_id')
    data = request.get_json()

    if not user_id:
        return jsonify({"message": "No user logged in"}), HTTPStatus.UNAUTHORIZED
    
    author = session.get('user_id')
    department = data.get('department')
    subject = data.get('subject')
    message = data.get('message')

    if not all([department, subject, message]):
        return jsonify({"message": "Incomplete ticket structure"}), HTTPStatus.BAD_REQUEST
   
   
    new_ticket = Ticket(author=author, department=department, subject=subject, message=message) # type:ignore
    
    try:
        new_ticket.dbwrite()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error committing ticket to database", "error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

    
    return jsonify({"message": "Ticket submitted successfully", "ticket": new_ticket.to_dict()}), HTTPStatus.CREATED
    

@bp.route('/api/get_tickets', methods = ['GET'])
def tickets():
    user_id = session.get('user_id')
    if not user_id:
        return redirect(url_for('main.home'))
    
    current_user = User.query.get(user_id)

    status_order = case(
        (Ticket.status == 1, 1), # OPEN
        (Ticket.status == 3, 2), # AWAITING_ASSIGNEE
        (Ticket.status == 2, 3), # AWAITING_AUTHOR
        (Ticket.status == 0, 4), # CLOSED
    )

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)

    query = Ticket.query

    if 'status' in request.args:
        query = query.filter(Ticket.status == int(request.args['status']))

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
        pagination = query.order_by(status_order, Ticket.last_updated.desc()).options(joinedload(Ticket.author_user)).paginate(page=page, per_page=per_page)  # type:ignore
        tickets = pagination.items
    else:
        # Fetch only tickets authored by the student
        pagination = query.order_by(status_order, Ticket.last_updated.desc()).filter_by(author=user_id).options(joinedload(Ticket.author_user)).paginate(page=page, per_page=per_page)  # type:ignore
        tickets = pagination.items

    response = {
        "tickets": [t.to_dict() for t in tickets],
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