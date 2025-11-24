'''Defines models for database tables

Created 10/30/25 - Kyran McCown & ChatGPT'''

from web_app.app import db
from datetime import datetime, UTC
import enum
from datetime import datetime, timezone

class TicketStatus(enum.IntEnum):
    CLOSED = 0
    OPEN = 1
    AWAITING_AUTHOR = 2
    AWAITING_ASSIGNEE = 3

class Department(db.Model):
    __tablename__ = 'departments'

    department_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    display_name = db.Column(db.String(100), nullable=False)

    def dbwrite(self, commit: bool = True):
        db.session.add(self)
        if commit:
            db.session.commit()
        return self

    def to_dict(self):
        return {
            'department_id': self.department_id,
            'name': self.name,
            'display_name': self.display_name,
        }

class Major(db.Model):
    __tablename__ = 'majors'

    major_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    display_name = db.Column(db.String(100), nullable=False)
    department_id = db.Column(db.ForeignKey('departments.department_id'))

    department = db.relationship('Department', backref='majors')

    def dbwrite(self, commit: bool = True):
        db.session.add(self)
        if commit:
            db.session.commit()
        return self

    def to_dict(self):
        return {
            'major_id': self.major_id,
            'name': self.name,
            'display_name': self.display_name,
            'department_id': self.department_id,
        }

class Minor(db.Model):
    __tablename__ = 'minors'

    minor_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    display_name = db.Column(db.String(100), nullable=False)
    department_id = db.Column(db.ForeignKey('departments.department_id'))

    department = db.relationship('Department', backref='minors')

    def dbwrite(self, commit: bool = True):
        db.session.add(self)
        if commit:
            db.session.commit()
        return self

    def to_dict(self):
        return {
            'minor_id': self.minor_id,
            'name': self.name,
            'display_name': self.display_name,
            'department_id': self.department_id,
        }

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

    def dbwrite(self, commit: bool = True):
        db.session.add(self)
        if commit:
            db.session.commit()
        return self

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'email': self.email,
            'display_name': self.display_name,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'major_id': self.major_id,
            'minor_id': self.minor_id,
            'department_id': self.department_id,
        }

# Define ticket model that matches database table
class Ticket(db.Model):
    __tablename__ = 'tickets'

    # Database table fields
    ticket_id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.ForeignKey('users.user_id'))
    assignee = db.Column(db.ForeignKey('users.user_id'))
    department = db.Column(db.ForeignKey('departments.department_id'))
    priority = db.Column(db.Integer)
    subject = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.Integer, default=TicketStatus.OPEN)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    last_updated = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    # Relationships
    author_user = db.relationship('User', foreign_keys=[author], backref='authored_tickets')
    assignee_user = db.relationship('User', foreign_keys=[assignee], backref='assigned_tickets')
    dept_name = db.relationship("Department", foreign_keys=[department])

    
    def dbwrite(self, commit: bool = True):
        now = datetime.now(timezone.utc)
        if not self.created_at:
            self.created_at = now
        self.last_updated = now
        db.session.add(self)
        if commit:
            db.session.commit()
        return self


    def to_dict(self):
        return {
            'ticket_id': self.ticket_id,
            'author_id': self.author,
            'assignee_id': self.assignee,
            'department': self.department,
            'priority': self.priority,
            'subject': self.subject,
            'message': self.message,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None
        }
    
class ArchivedTicket(db.Model):
    __tablename__ = 'archived_tickets'

    # Database table fields
    ticket_id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.ForeignKey('users.user_id'))
    assignee = db.Column(db.ForeignKey('users.user_id'))
    department = db.Column(db.ForeignKey('departments.department_id'))
    priority = db.Column(db.Integer)
    subject = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.Integer, default=TicketStatus.OPEN)
    created_at = db.Column(db.DateTime)
    last_updated = db.Column(db.DateTime)

    # Relationships
    author_user = db.relationship('User', foreign_keys=[author], backref='authored_tickets')
    assignee_user = db.relationship('User', foreign_keys=[assignee], backref='assigned_tickets')
    dept_name = db.relationship("Department", foreign_keys=[department])

    
    def dbwrite(self, commit: bool = True):
        now = datetime.now(timezone.utc)
        if not self.created_at:
            self.created_at = now
        self.last_updated = now
        db.session.add(self)
        if commit:
            db.session.commit()
        return self


    def to_dict(self):
        return {
            'ticket_id': self.ticket_id,
            'author_id': self.author,
            'assignee_id': self.assignee,
            'department': self.department,
            'priority': self.priority,
            'subject': self.subject,
            'message': self.message,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None
        }
    
class Response(db.Model):
    __tablename__ = "responses"

    response_id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    ticket = db.Column(db.ForeignKey('tickets.ticket_id'))

    def dbwrite(self, commit: bool = True):
        now = datetime.now(timezone.utc)
        if not self.created_at:
            self.created_at = now
        db.session.add(self)
        if commit:
            db.session.commit()
        return self
    
    def to_dict(self):
        return {
            "message": self.message,
            "created_at": self.created_at,
            "ticket": self.ticket
        }