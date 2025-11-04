'''Defines models for database tables

Created 10/30/25 - Kyran McCown & ChatGPT'''

from web_app.app import db

class Department(db.Model):
    __tablename__ = 'departments'

    department_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    display_name = db.Column(db.String(100), nullable=False)

class Major(db.Model):
    __tablename__ = 'majors'

    major_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    display_name = db.Column(db.String(100), nullable=False)
    department_id = db.Column(db.ForeignKey('departments.department_id'))

    department = db.relationship('Department', backref='majors')

class Minor(db.Model):
    __tablename__ = 'minors'

    minor_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    display_name = db.Column(db.String(100), nullable=False)
    department_id = db.Column(db.ForeignKey('departments.department_id'))

    department = db.relationship('Department', backref='minors')

# Define user model that matches database table
class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    display_name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), default='student')
    created_at = db.Column(db.DateTime)

    major_id = db.Column(db.Integer, db.ForeignKey('majors.major_id'))
    minor_id = db.Column(db.Integer, db.ForeignKey('minors.minor_id'))
    department_id = db.Column(db.Integer, db.ForeignKey('departments.department_id'))
    major = db.relationship('Major', backref='students')
    minor = db.relationship('Minor', backref='students')
    department = db.relationship('Department', backref='advisors')

# Define ticket model that matches database table
class Ticket(db.Model):
    __tablename__ = 'tickets'

    # Database table fields
    ticket_id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.ForeignKey('users.user_id'))
    assignee = db.Column(db.ForeignKey('users.user_id'))
    department = db.Column(db.String(50), default="Tykeson")
    priority = db.Column(db.Integer)
    subject = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.Text, default='open')
    created_at = db.Column(db.DateTime)
    last_updated = db.Column(db.DateTime)

    # Relationships
    author_user = db.relationship('User', foreign_keys=[author], backref='authored_tickets')
    assignee_user = db.relationship('User', foreign_keys=[assignee], backref='assigned_tickets')