# =============================================================================
# File: routes.py
# Project: DuckDesk (ATGS University of Oregon Ticketing System)
# Description:
#     Defines all REST API endpoints for authentication, ticket management,
#     user management, messaging, and archival flows. This is the primary
#     controller layer connecting frontend requests to backend model logic.
#
# Creation Date: November 4th
# Authors: Kyran McCown, ChatGPT
#
# Notes:
#     - All routes are mounted under the "/api" prefix via Flask Blueprint.
#     - Session-based authentication is used across all endpoints.
#     - Responses consistently use JSON + HTTPStatus codes.
# =============================================================================

"""
DuckDesk API routing module.

This file contains:
    - Authentication routes (login, logout, signup, verification)
    - User lookup, filtering, and permission-gated details access
    - Ticket creation, update, search, filtering, and listing
    - Response creation for ticket conversations
    - Ticket archival workflow for secure FERPA-compliant storage
"""

# ----------------------------- Imports ---------------------------------------
# HTTPStatus: standardized status codes for API responses.
# Flask utilities: request handling, JSON responses, session management.
# SQLAlchemy: filtering, logical OR operations, casting, ordering, and aliasing.
# joinedload/aliased: eager loading for related user fields to avoid N+1 queries.
# db: shared SQLAlchemy instance from the application factory.
# resend: email provider used for signup verification.
# bcrypt: secure password hashing and comparison.
from http import HTTPStatus
from flask import Blueprint, Flask, jsonify, request, render_template, redirect, url_for, session
from sqlalchemy import case, or_, Integer, cast, asc
from sqlalchemy.orm import joinedload, aliased
from app import db
from datetime import datetime, timedelta
from time import sleep
from models import ArchivedResponse, Department, Major, Minor, User, PendingUser, Ticket, ArchivedTicket, TicketStatus, Response
import os
import resend
import secrets
import string
import bcrypt

 # Blueprint grouping all API routes under the /api prefix for modular routing.
bp = Blueprint('main', __name__, url_prefix="/api")
resend.api_key = os.getenv("RESEND_API_KEY")

# ============================================================================
#                           Authentication Routes
# ============================================================================
@bp.route('/login', methods=['POST', 'OPTIONS']) 
def login():
    """
    Authenticate a user using email and password.

    - Validates request payload
    - Verifies stored bcrypt password hash
    - Stores user_id in session on success
    - Supports OPTIONS requests for CORS preflight

    Returns:
        200 OK on success,
        400 BAD REQUEST for invalid credentials or missing fields.
    """
    if request.method == "OPTIONS":
        return "", 204
    data = request.get_json()
    email = data.get('email')
    input_pw = data.get('password')

    if not email or not input_pw: return jsonify({"error": "Email and password required"}), HTTPStatus.BAD_REQUEST
    
    user: User | None = User.query.filter_by(email=email).first()
    if not user or not bcrypt.checkpw(input_pw.encode('utf-8'), user.password_hash): return jsonify({"error": "Incorrect email or password"}), HTTPStatus.BAD_REQUEST
    
    session['user_id'] = user.user_id

    return jsonify({"message": "User logged in"}), HTTPStatus.OK

@bp.route('/logout', methods=['POST', 'OPTIONS'])
def logout():
    """
    Logs out the current user by clearing the session user_id.

    Returns:
        200 OK on successful logout.
    """
    if request.method == "OPTIONS":
        return "", 204
    session['user_id'] = None

    return jsonify({"message": "User logged out"}), HTTPStatus.OK

@bp.route('/signup', methods=['POST', 'OPTIONS']) 
def signup():
    """
    Begins the signup process.

    - Ensures email, name, and password are provided
    - Generates a 5‑character verification code
    - Sends verification email through Resend API
    - Creates PendingUser record expiring in 10 minutes

    Returns:
        200 OK if email sent,
        400 BAD REQUEST for missing fields or existing user,
        500 INTERNAL SERVER ERROR if email sending fails.
    """
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

@bp.route('/verify/<string:email>', methods=['POST', 'OPTIONS'])
def verify(email):
    """
    Completes account creation by validating a verification code.

    - Looks up PendingUser
    - Checks expiration timestamp
    - Validates provided verification code
    - Creates real User record and removes PendingUser
    - Logs the new user in

    Returns:
        201 CREATED on success,
        400 BAD REQUEST for incorrect code or expired code,
        404 NOT FOUND if no pending signup exists.
    """
    data = request.get_json()
    
    code = data.get('code')

    pending = PendingUser.query.filter_by(email=email).first()
    if not pending:
        return "No pending signup found", HTTPStatus.NOT_FOUND

    if datetime.utcnow() > pending.expires_at:
        db.session.delete(pending)
        db.session.commit()
        return "Verification code expired", HTTPStatus.BAD_REQUEST

    if pending.verification_code != code:
        return "Incorrect verification code", HTTPStatus.BAD_REQUEST

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

# ============================================================================
#                               Ticket Creation
# ============================================================================
@bp.route('/submit_ticket', methods=['POST', 'OPTIONS'])
def submit_ticket():
    """
    Creates a new ticket authored by the currently logged‑in user.

    - Requires department, subject, and message
    - Optionally accepts an assignee
    - Sets initial ticket status to AWAITING_ASSIGNEE
    - Commits the ticket to the database using model dbwrite()

    Returns:
        201 CREATED on success,
        400 BAD REQUEST for missing fields,
        401 UNAUTHORIZED if no user session exists,
        500 INTERNAL SERVER ERROR if commit fails.
    """
    if request.method == "OPTIONS":
        return "", 204
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
    
    status = TicketStatus.AWAITING_ASSIGNEE if assignee else TicketStatus.OPEN
    new_ticket = Ticket(author=author, department=department, subject=subject, message=message, status=status, assignee=assignee) # type:ignore
    
    try:
        new_ticket.dbwrite(True)
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error committing ticket to database", "error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

    
    return jsonify({"message": "Ticket submitted successfully", "ticket": new_ticket.to_dict()}), HTTPStatus.CREATED

# ============================================================================
#                               Ticket Updating
# ============================================================================
@bp.route('/update_ticket', methods = ['POST', 'OPTIONS'])
def update_ticket():
    """
    Updates an existing ticket.

    Permissions:
        - Students may only edit their own tickets and cannot modify priority or status.
        - Advisors and admins may update any ticket and may modify priority and status.

    Editable fields:
        - department
        - subject
        - message
        - assignee
        - priority (advisor/admin only)
        - status   (advisor/admin only)

    Returns:
        200 OK on success,
        400 BAD REQUEST for missing ticket_id,
        401 UNAUTHORIZED for lack of permissions,
        404 NOT FOUND if ticket does not exist.
    """
    if request.method == "OPTIONS":
        return "", 204
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

# ============================================================================
#                              User Management
# ============================================================================
@bp.route('/get_users', methods=['GET'])
def get_users():
    """
    Returns a paginated list of users.

    Permissions:
        - Only advisors and admins may access this route.

    Supports filtering by:
        - role
        - email (partial match)
        - name (partial match)
        - major_id
        - minor_id
        - department_id

    Pagination:
        - page (default 1)
        - per_page (default 20)

    Returns:
        200 OK with user list and pagination metadata,
        401 UNAUTHORIZED if not logged in,
        403 FORBIDDEN if user lacks required role.
    """
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
 
@bp.route('/user_details', methods = ['GET'])
def user_details():
    """
    Returns detailed information about a specific user.

    Permissions:
        - Admins and advisors may view any user.
        - Students may only view their own details.

    Expects:
        JSON body containing:
            user_id: ID of the user to look up

    Returns:
        200 OK with user data,
        400 BAD REQUEST if user_id missing,
        401 UNAUTHORIZED if not logged in or insufficient permissions,
        404 NOT FOUND if user does not exist.
    """
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

@bp.route('/current_user', methods=['GET'])
def current_user():
    """
    Returns the details of the currently logged-in user.

    Returns:
        200 OK with user details,
        401 UNAUTHORIZED if no active session,
        404 NOT FOUND if user record no longer exists.
    """
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "No user logged in"}), HTTPStatus.UNAUTHORIZED
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), HTTPStatus.NOT_FOUND
    
    return jsonify(user.to_dict()), HTTPStatus.OK

# ============================================================================
#                              Department Lookup
# ============================================================================
@bp.route('/departments', methods=['GET'])
def get_departments():
    """
    Returns a list of all academic departments.

    - No authentication required
    - Used to populate dropdowns during ticket creation and filtering

    Returns:
        200 OK with list of {department_id, name}
    """
    departments = Department.query.all()
    return jsonify([{"department_id": d.department_id, "name": d.name} for d in departments]), HTTPStatus.OK

# ============================================================================
#                           Ticket Listing & Search
# ============================================================================
@bp.route('/get_tickets', methods = ['GET'])
def get_tickets():
    """
    Retrieves a paginated list of active (non‑archived) tickets.

    Permissions:
        - Advisors/admins see all tickets.
        - Students only see tickets they authored.

    Supports filtering by:
        - status
        - department
        - priority
        - created_at date
        - updated_at date
        - free‑text search across:
            • subject
            • message body
            • author name
            • assignee name

    Sorting:
        - Orders by custom status priority (OPEN → AWAITING_ASSIGNEE → AWAITING_AUTHOR → CLOSED)
        - Then by last_updated descending

    Returns:
        Paginated ticket list with enriched metadata (names, department labels).
    """
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

    priority_order = case(
        (Ticket.priority == 3, 1), # High
        (Ticket.priority == 2, 2),   # Medium
        (Ticket.priority == 1, 3),   # Low
        else_=4                      # Unset / None
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

    if "text" in request.args:
        search = request.args["text"].strip()
        terms = search.split()

        author_alias = aliased(User)
        assignee_alias = aliased(User)

        # OUTER JOIN so tickets with no assignee/author don't disappear
        query = query.outerjoin(author_alias, Ticket.author_user)
        query = query.outerjoin(assignee_alias, Ticket.assignee_user)

        subject_filters = [Ticket.subject.ilike(f"%{t}%") for t in terms]
        message_filters = [Ticket.message.ilike(f"%{t}%") for t in terms]
        author_filters  = [author_alias.display_name.ilike(f"%{t}%") for t in terms]
        assignee_filters = [assignee_alias.display_name.ilike(f"%{t}%") for t in terms]

        query = query.filter(
            or_(
                or_(*subject_filters),
                or_(*message_filters),
                or_(*author_filters),
                or_(*assignee_filters),
            )
        )
    
    if current_user.role in ['advisor', 'admin']: # type:ignore
        # Fetch all tickets from the database
        pagination = query.order_by(status_order, priority_order, Ticket.last_updated.desc()).options(
            joinedload(Ticket.author_user),
            joinedload(Ticket.assignee_user)
        ).paginate(page=page, per_page=per_page)  # type:ignore
        tickets = pagination.items
    else:
        # Fetch only tickets authored by the student
        pagination = query.order_by(status_order, priority_order, Ticket.last_updated.desc()).filter_by(author=user_id).options(
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
            d.department_id: (
                getattr(d, "display_name", None)
                or getattr(d, "name", None)
                or f"Department {d.department_id}"
            )
            for d in depts
        }

    tickets_data = []
    for t in tickets:
        ticket_dict = t.to_dict()
        ticket_dict['author_name'] = t.author_user.display_name if t.author_user else None  # type:ignore
        ticket_dict['assignee_name'] = t.assignee_user.display_name if t.assignee_user else None  # type:ignore
        ticket_dict['department_name'] = (
            (getattr(t.dept_name, "display_name", None) if t.dept_name else None)
            or (getattr(t.dept_name, "name", None) if t.dept_name else None)
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

# ============================================================================
#                           Archived Ticket Listing
# ============================================================================
@bp.route('/get_archived_tickets', methods=['GET'])
def get_archived_tickets():
    """
    Retrieves archived tickets with filtering identical to active tickets.

    Permissions:
        - Advisors/admins may view all archived tickets.
        - Students may only view archived tickets they authored.

    Supports:
        - Same filters as active tickets
        - Free‑text search on subject, message, author, assignee

    Returns:
        Paginated archived ticket data.
    """
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

    priority_order = case(
        (ArchivedTicket.priority == 3, 1), # High
        (ArchivedTicket.priority == 2, 2),   # Medium
        (ArchivedTicket.priority == 1, 3),   # Low
        else_=4                      # Unset / None
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

        # OUTER JOIN so tickets with missing author/assignee are still searchable
        query = query.outerjoin(author_alias, ArchivedTicket.author_user)
        query = query.outerjoin(assignee_alias, ArchivedTicket.assignee_user)

        subject_filters = [ArchivedTicket.subject.ilike(f"%{t}%") for t in terms]
        message_filters = [ArchivedTicket.message.ilike(f"%{t}%") for t in terms]
        author_filters  = [author_alias.display_name.ilike(f"%{t}%") for t in terms]
        assignee_filters = [assignee_alias.display_name.ilike(f"%{t}%") for t in terms]

        query = query.filter(
            or_(
                or_(*subject_filters),
                or_(*message_filters),
                or_(*author_filters),
                or_(*assignee_filters),
            )
        )

    # Advisors and admins can see all, students only their own
    if current_user.role in ['advisor', 'admin']:
        pagination = query.order_by(status_order, priority_order, ArchivedTicket.last_updated.desc()).options(
            joinedload(ArchivedTicket.author_user),
            joinedload(ArchivedTicket.assignee_user)
        ).paginate(page=page, per_page=per_page)
        tickets = pagination.items
    else:
        pagination = query.order_by(status_order, priority_order, ArchivedTicket.last_updated.desc()).filter_by(author=user_id).options(
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

# ============================================================================
#                               Ticket Details
# ============================================================================
@bp.route('/ticket_details', methods=['GET'])
def ticket_details():
    """
    Returns full details for an active ticket, including threaded responses.

    Permissions:
        - Advisors and admins may view any ticket.
        - Students may only view tickets they authored.

    Expects:
        ticket_id provided via query string (?ticket_id=)

    Returns:
        200 OK with full ticket structure,
        400 BAD REQUEST if ticket_id is missing,
        401 UNAUTHORIZED if user lacks permission,
        404 NOT FOUND if ticket does not exist.
    """
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
        "ticket_id": ticket.ticket_id,
        "author": ticket.author_user.display_name if ticket.author_user else None,
        "author_id": ticket.author,
        "assignee": ticket.assignee_user.display_name if ticket.assignee_user else None,
        "assignee_id": ticket.assignee,
        "department": ticket.dept_name.name if ticket.dept_name else None,
        "department_id": ticket.department,
        "priority": ticket.priority,
        "subject": ticket.subject,
        "body": ticket.message,
        "status": TicketStatus(ticket.status).name if ticket.status is not None else None,
        "status_code": int(ticket.status) if ticket.status is not None else None,
        "created_at": ticket.created_at.isoformat() if ticket.created_at else None,
        "last_updated": ticket.last_updated.isoformat() if ticket.last_updated else None,
        "responses": response_list
    }

    return jsonify(response), HTTPStatus.OK

# ============================================================================
#                           Archived Ticket Details
# ============================================================================
@bp.route('/archived_ticket_details', methods=['GET'])
def archived_ticket_details():
    """
    Returns full details for an archived ticket, including archived responses.

    Permissions:
        - Advisors and admins may view any archived ticket.
        - Students may only view archived tickets they authored.

    Expects:
        ticket_id provided via query string (?ticket_id=)

    Returns:
        200 OK with archived ticket details,
        400 BAD REQUEST if ticket_id is missing,
        401 UNAUTHORIZED if user lacks permission,
        404 NOT FOUND if ticket does not exist.
    """
    ticket_id = request.args.get('ticket_id')
    if not ticket_id:
        return jsonify({"error": "ticket_id is required"}), HTTPStatus.BAD_REQUEST

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"message": "No user logged in"}), HTTPStatus.UNAUTHORIZED

    current_user: User | None = User.query.get(user_id)
    if not current_user:
        return jsonify({"message": "No user logged in"}), HTTPStatus.UNAUTHORIZED

    ticket: Ticket | None = ArchivedTicket.query.filter_by(ticket_id=ticket_id).first()
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

# ============================================================================
#                            Ticket Responses
# ============================================================================
@bp.route('/create_response', methods=['POST', 'OPTIONS'])
def create_response():
    """
    Creates a response (message) on an active ticket.

    Behavior:
        - Students responding → ticket status becomes AWAITING_ASSIGNEE.
        - Advisors/Admins responding → ticket status becomes AWAITING_AUTHOR.
        - Closed tickets may only be responded to by advisors/admins.

    Expects JSON:
        ticket_id: ID of the ticket
        message:   response body text

    Returns:
        201 CREATED on success,
        400 BAD REQUEST for missing ticket_id,
        401 UNAUTHORIZED for insufficient permissions,
        404 NOT FOUND if ticket does not exist.
    """
    if request.method == "OPTIONS":
        return "", 204
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

# ============================================================================
#                              Ticket Archival
# ============================================================================
@bp.route('/archive_ticket', methods=['POST', 'OPTIONS'])
def archive_ticket():
    """
    Archives a ticket and all associated responses.

    Process:
        - Copies Ticket → ArchivedTicket
        - Copies all Responses → ArchivedResponses
        - Deletes the active ticket and its responses
        - Enforces advisor/admin‑only access

    Expects JSON:
        ticket_id: ticket to archive

    Returns:
        200 OK on success,
        400 BAD REQUEST for missing ticket_id,
        401 UNAUTHORIZED if user lacks permission,
        404 NOT FOUND if ticket does not exist,
        500 INTERNAL SERVER ERROR on commit failure.
    """
    if request.method == "OPTIONS":
        return "", 204
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

# ============================================================================
#                                 Diagnostics
# ============================================================================
@bp.route("/test", methods=['GET'])
def test():
    """Simple health‑check endpoint used to verify API is reachable."""
    return "This works", 200