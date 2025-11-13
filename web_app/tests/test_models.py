import pytest
from datetime import datetime
from web_app.models import Department, Major, Minor, User, Ticket, TicketStatus

def test_department_to_dict():
    dept = Department(department_id=1, name='CS')
    expected = {'department_id': 1, 'name': 'CS'}
    assert dept.to_dict() == expected

def test_major_to_dict():
    major = Major(major_id=1, name='cs', display_name='Computer Science', department_id=2)
    expected = {
        'major_id': 1,
        'name': 'cs',
        'display_name': 'Computer Science',
        'department_id': 2
    }
    assert major.to_dict() == expected

def test_minor_to_dict():
    minor = Minor(minor_id=1, name='math', display_name='Mathematics', department_id=3)
    expected = {
        'minor_id': 1,
        'name': 'math',
        'display_name': 'Mathematics',
        'department_id': 3
    }
    assert minor.to_dict() == expected

def test_user_to_dict():
    user = User(
        user_id=1,
        email='test@example.com',
        display_name='Test User',
        role='student',
        created_at=datetime(2025, 11, 1, 12, 0, 0),
        major_id=1,
        minor_id=2,
        department_id=3
    )
    result = user.to_dict()
    assert result['user_id'] == 1
    assert result['email'] == 'test@example.com'
    assert result['display_name'] == 'Test User'
    assert result['role'] == 'student'
    assert result['created_at'] == '2025-11-01T12:00:00'
    assert result['major_id'] == 1
    assert result['minor_id'] == 2
    assert result['department_id'] == 3

def test_ticket_to_dict():
    now = datetime.utcnow()
    ticket = Ticket(
        ticket_id=10,
        author=1,
        assignee=2,
        department=3,
        priority=1,
        subject='Help!',
        message='I need help with my major.',
        status=TicketStatus.OPEN,
        created_at=now,
        last_updated=now
    )
    result = ticket.to_dict()
    assert result['ticket_id'] == 10
    assert result['author_id'] == 1
    assert result['assignee_id'] == 2
    assert result['department'] == 3
    assert result['priority'] == 1
    assert result['subject'] == 'Help!'
    assert result['message'] == 'I need help with my major.'
    assert result['status'] == TicketStatus.OPEN
    assert result['created_at'] == now.isoformat()
    assert result['last_updated'] == now.isoformat()
