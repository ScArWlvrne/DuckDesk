# =============================================================================
# File: models.py
# Project: DuckDesk (ATGS University of Oregon Ticketing System)
# Description:
#     Contains SQLAlchemy ORM models for all major database tables used by the
#     DuckDesk backend, including Users, Departments, Majors/Minors, Tickets,
#     Responses, and archived equivalents. These models define the structure of
#     the database, relationships between entities, and helper serialization /
#     write utilities.
#
# Creation Date: October 30, 2025
# Authors: Kyran McCown, ChatGPT
#
# Notes:
#     - All models inherit from SQLAlchemy's db.Model.
#     - dbwrite() standardizes creation/update timestamps and ensures commits
#       occur only when desired.
#     - to_dict() methods produce JSON‑safe backend payloads for API responses.
# =============================================================================

"""
SQLAlchemy ORM model definitions for the DuckDesk advising/ticketing platform.

This module contains:
    - Department, Major, Minor models for academic structuring.
    - User and PendingUser models for authentication and identity.
    - Ticket, Response, and Archived variants for FERPA‑compliant history storage.
    - Enum definitions for ticket status.
"""

# ----------------------------- Imports ---------------------------------------
# db: SQLAlchemy instance used across the backend.
# datetime: timestamp generation and timezone-aware storage.
# enum: for defining TicketStatus states.

from app import db
from datetime import datetime, UTC
import enum
from datetime import datetime, timezone

# --------------------------- Enum Definitions --------------------------------
# TicketStatus represents states used throughout ticket workflow logic.

class TicketStatus(enum.IntEnum):
    CLOSED = 0
    OPEN = 1
    AWAITING_AUTHOR = 2
    AWAITING_ASSIGNEE = 3

class Department(db.Model):
    """
    Represents an academic department within the university.
    Used to group majors/minors and route advisor responsibilities.
    """
    __tablename__ = 'departments'

    department_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

    def dbwrite(self, commit: bool = True):
        # Write the model instance to the database, optionally committing.
        # Ensures timestamps remain consistent for creation/update operations
        db.session.add(self)
        if commit:
            db.session.commit()
        return self

    def to_dict(self):
        # Convert the model instance into a JSON‑serializable dictionary
        # for API responses.
        return {
            'department_id': self.department_id,
            'name': self.name
        }

class Major(db.Model):
    """
    Represents a major belonging to a department. Majors link students to
    advisors and display-friendly labels for UI rendering.
    """
    __tablename__ = 'majors'

    major_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    display_name = db.Column(db.String(100), nullable=False)
    department_id = db.Column(db.ForeignKey('departments.department_id'))

    department = db.relationship('Department', backref='majors')

    def dbwrite(self, commit: bool = True):
        # Write the model instance to the database, optionally committing.
        # Ensures timestamps remain consistent for creation/update operations
        db.session.add(self)
        if commit:
            db.session.commit()
        return self

    def to_dict(self):
        # Convert the model instance into a JSON‑serializable dictionary
        # for API responses.
        return {
            'major_id': self.major_id,
            'name': self.name,
            'display_name': self.display_name,
            'department_id': self.department_id,
        }

class Minor(db.Model):
    """
    Represents a minor belonging to a department.
    Structured identically to Major for consistency.
    """
    __tablename__ = 'minors'

    minor_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    display_name = db.Column(db.String(100), nullable=False)
    department_id = db.Column(db.ForeignKey('departments.department_id'))

    department = db.relationship('Department', backref='minors')

    def dbwrite(self, commit: bool = True):
        # Write the model instance to the database, optionally committing.
        # Ensures timestamps remain consistent for creation/update operations
        db.session.add(self)
        if commit:
            db.session.commit()
        return self

    def to_dict(self):
        # Convert the model instance into a JSON‑serializable dictionary
        # for API responses.
        return {
            'minor_id': self.minor_id,
            'name': self.name,
            'display_name': self.display_name,
            'department_id': self.department_id,
        }

# Define user model that matches database table
class User(db.Model):
    """
    Core user model for the platform:
        - Students, advisors, and admins all derive from this table.
        - Relationships link users to majors/minors/departments.
        - Passwords are stored as secure hashes.
    """
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    display_name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), default='student')
    password_hash = db.Column(db.LargeBinary, nullable=False)
    created_at = db.Column(db.DateTime)

    major_id = db.Column(db.Integer, db.ForeignKey('majors.major_id'))
    minor_id = db.Column(db.Integer, db.ForeignKey('minors.minor_id'))
    department_id = db.Column(db.Integer, db.ForeignKey('departments.department_id'))
    major = db.relationship('Major', backref='students')
    minor = db.relationship('Minor', backref='students')
    department = db.relationship('Department', backref='advisors')

    def dbwrite(self, commit: bool = True):
        # Write the model instance to the database, optionally committing.
        # Ensures timestamps remain consistent for creation/update operations
        db.session.add(self)
        if commit:
            db.session.commit()
        return self

    def to_dict(self):
        # Convert the model instance into a JSON‑serializable dictionary
        # for API responses.
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
    
class PendingUser(db.Model):
    """
    Temporary user record used during signup/verification flow.
    Automatically expires after the stored expiration timestamp.
    """
    __tablename__ = "pending_users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    display_name = db.Column(db.String, nullable=False)
    role = db.Column(db.String, default="student")
    password_hash = db.Column(db.LargeBinary, nullable=False)
    verification_code = db.Column(db.String(5), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)

# Define ticket model that matches database table
class Ticket(db.Model):
    """
    Represents an active support/advising ticket created by a student.
    Tracks author, assignee, message content, status, timestamps, and priority.
    Relationships connect tickets to users and their departments.
    """
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
        # Write the model instance to the database, optionally committing.
        # Ensures timestamps remain consistent for creation/update operations
        now = datetime.now(timezone.utc)
        if not self.created_at:
            self.created_at = now
        self.last_updated = now
        db.session.add(self)
        if commit:
            db.session.commit()
        return self


    def to_dict(self):
        # Convert the model instance into a JSON‑serializable dictionary
        # for API responses.
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
    """
    Historical storage for tickets after closure and FERPA‑compliant anonymization.
    Mirrors the Ticket model structure but is immutable post-archive.
    """
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
    author_user = db.relationship('User', foreign_keys=[author], backref='archived_authored_tickets')
    assignee_user = db.relationship('User', foreign_keys=[assignee], backref='archived_assigned_tickets')
    dept_name = db.relationship("Department", foreign_keys=[department])

    
    def dbwrite(self, commit: bool = True):
        # Write the model instance to the database, optionally committing.
        # Ensures timestamps remain consistent for creation/update operations
        now = datetime.now(timezone.utc)
        if not self.created_at:
            self.created_at = now
        self.last_updated = now
        db.session.add(self)
        if commit:
            db.session.commit()
        return self


    def to_dict(self):
        # Convert the model instance into a JSON‑serializable dictionary
        # for API responses.
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
    """
    Represents a message response inside a live ticket thread.
    Includes timestamping and references to ticket + author.
    """
    __tablename__ = "responses"

    response_id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    ticket = db.Column(db.ForeignKey('tickets.ticket_id'))
    author = db.Column(db.ForeignKey('users.user_id'))

    def dbwrite(self, commit: bool = True):
        # Write the model instance to the database, optionally committing.
        # Ensures timestamps remain consistent for creation/update operations
        now = datetime.now(timezone.utc)
        if not self.created_at:
            self.created_at = now
        db.session.add(self)
        if commit:
            db.session.commit()
        return self
    
    def to_dict(self):
        # Convert the model instance into a JSON‑serializable dictionary
        # for API responses.
        return {
            "message": self.message,
            "created_at": self.created_at,
            "ticket": self.ticket,
            "author": self.author
        }
    
class ArchivedResponse(db.Model):
    """
    Archived version of Response, moved when the parent ticket is archived.
    Stored separately to maintain FERPA boundaries and preserve history safely.
    """
    __tablename__ = "archived_responses"

    response_id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime)
    ticket = db.Column(db.ForeignKey('archived_tickets.ticket_id'))
    author = db.Column(db.ForeignKey('users.user_id'))

    def dbwrite(self, commit: bool = True):
        # Write the model instance to the database, optionally committing.
        # Ensures timestamps remain consistent for creation/update operations
        now = datetime.now(timezone.utc)
        if not self.created_at:
            self.created_at = now
        db.session.add(self)
        if commit:
            db.session.commit()
        return self
    
    def to_dict(self):
        # Convert the model instance into a JSON‑serializable dictionary
        # for API responses.
        return {
            "message": self.message,
            "created_at": self.created_at,
            "ticket": self.ticket,
            "author": self.author
        }
