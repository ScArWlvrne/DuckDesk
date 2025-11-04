from flask import Blueprint, Flask, request, render_template, redirect, url_for, session
from sqlalchemy import case
from sqlalchemy.orm import joinedload
from web_app.app import db

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
        db.session.add(new_user)
        db.session.commit()

        return redirect(url_for('main.home'))  # go back to homepage after signing up

    # If it's a GET request, show the signup form
    return render_template('signup.html')

@bp.route('/submit_ticket', methods=['GET', 'POST'])
def submit_ticket():
    user_id = session.get('user_id')
    if not user_id:
        return redirect(url_for('main.home'))
    
    current_user = User.query.get(user_id)

    if request.method == 'POST':
        author = session.get('user_id')
        department = request.form.get('department')
        subject = request.form.get('subject')
        message = request.form.get('message')

        new_ticket = Ticket(author=author, department=department, subject=subject, message=message) # type:ignore
        db.session.add(new_ticket)
        db.session.commit()

        return "Ticket created successfully"
    
    return render_template('submit_ticket.html', current_user=current_user)

@bp.route('/tickets')
def tickets():
    user_id = session.get('user_id')
    if not user_id:
        return redirect(url_for('main.home'))
    
    current_user = User.query.get(user_id)

    status_order = case(
        (Ticket.status == 'open', 1),
        (Ticket.status == 'in progress', 2),
        (Ticket.status == 'closed', 3),
    )

    if current_user.role in ['advisor', 'admin']: # type:ignore
        # Fetch all tickets from the database
        tickets = Ticket.query.order_by(status_order, Ticket.last_updated.desc()).options(joinedload(Ticket.author_user)).all()  # type:ignore
    else:
        # Fetch only tickets authored by the student
        tickets = Ticket.query.order_by(status_order, Ticket.last_updated.desc()).filter_by(author=user_id).options(joinedload(Ticket.author_user)).all() # type:ignore
    
    return render_template('tickets.html', tickets=tickets)