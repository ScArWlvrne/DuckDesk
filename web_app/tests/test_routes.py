import pytest
from web_app.app import create_app, db
from web_app.models import User, Ticket, Department, PendingUser, ArchivedTicket
import resend
import bcrypt
from datetime import datetime, timedelta

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'

    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()

def test_submit_ticket_unauthorized(client):
    response = client.post('/api/submit_ticket', json={})
    assert response.status_code == 401

def test_submit_ticket_success(client):
    hashed = bcrypt.hashpw(b"testpassword", bcrypt.gensalt())
    user = User(email='student@example.com', display_name='Student', password_hash=hashed)
    dept = Department(department_id=1, name='Test Dept')
    db.session.add(user)
    db.session.add(dept)
    db.session.commit()
    with client.session_transaction() as sess:
        sess['user_id'] = user.user_id
    response = client.post('/api/submit_ticket', json={
        'department': 1,
        'subject': 'Help with assignment',
        'message': 'I need clarification on question 3.'
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data['ticket']['subject'] == 'Help with assignment'

def test_submit_ticket_missing_fields(client):
    hashed = bcrypt.hashpw(b"testpassword", bcrypt.gensalt())
    user = User(email='student2@example.com', display_name='Student2', password_hash=hashed)
    db.session.add(user)
    db.session.commit()
    with client.session_transaction() as sess:
        sess['user_id'] = user.user_id
    response = client.post('/api/submit_ticket', json={
        'department': 1,
        'subject': ''
    })
    assert response.status_code == 400

def test_get_tickets_unauthorized(client):
    response = client.get('/api/get_tickets')
    assert response.status_code == 401

def test_get_tickets_success(client):
    hashed = bcrypt.hashpw(b"testpassword", bcrypt.gensalt())
    user = User(email='student3@example.com', display_name='Student3', password_hash=hashed)
    dept = Department(department_id=1, name='Test Dept')
    db.session.add(dept)
    db.session.add(user)
    db.session.commit()
    ticket = Ticket(author=user.user_id, department=1, subject='Test subject', message='Test message')  # type: ignore
    db.session.add(ticket)
    db.session.commit()
    with client.session_transaction() as sess:
        sess['user_id'] = user.user_id
    response = client.get('/api/get_tickets')
    assert response.status_code == 200
    data = response.get_json()
    assert data['tickets'][0]['subject'] == 'Test subject'

def test_get_tickets_filters(client):
    hashed = bcrypt.hashpw(b"testpassword", bcrypt.gensalt())
    user = User(email='student4@example.com', display_name='Student4', password_hash=hashed)
    dept1 = Department(department_id=1, name='Test Dept 1')
    dept2 = Department(department_id=2, name='Test Dept 2')
    db.session.add(dept1)
    db.session.add(dept2)
    db.session.add(user)
    db.session.commit()
    ticket1 = Ticket(author=user.user_id, department=1, subject='Filter test', message='Match this')  # type: ignore
    ticket2 = Ticket(author=user.user_id, department=2, subject='Unrelated', message='No match')  # type: ignore
    db.session.add_all([ticket1, ticket2])
    db.session.commit()
    with client.session_transaction() as sess:
        sess['user_id'] = user.user_id
    response = client.get('/api/get_tickets?department=1')
    assert response.status_code == 200
    data = response.get_json()
    assert all(ticket['department'] == 1 for ticket in data['tickets'])


def test_update_ticket_unauthorized_no_login(client):
    response = client.post('/api/update_ticket', json={"ticket_id": 1})
    assert response.status_code == 401


def test_update_ticket_not_found(client):
    hashed = bcrypt.hashpw(b"testpassword", bcrypt.gensalt())
    user = User(email='u@test.com', display_name='U', role='advisor', password_hash=hashed)
    db.session.add(user)
    db.session.commit()
    with client.session_transaction() as sess:
        sess['user_id'] = user.user_id
    
    response = client.post('/api/update_ticket', json={"ticket_id": 999})
    assert response.status_code == 404


def test_update_ticket_success(client):
    hashed = bcrypt.hashpw(b"testpassword", bcrypt.gensalt())
    user = User(email='advisor@test.com', display_name='Advisor', role='advisor', password_hash=hashed)
    dept = Department(department_id=1, name="Dept")
    ticket = Ticket(author=user.user_id, department=1, subject="Old", message="Old msg")  # type: ignore
    db.session.add_all([user, dept, ticket])
    db.session.commit()

    with client.session_transaction() as sess:
        sess['user_id'] = user.user_id

    response = client.post('/api/update_ticket', json={
        "ticket_id": ticket.ticket_id,
        "subject": "New Subject",
        "message": "Updated Message"
    })
    assert response.status_code == 200
    updated = Ticket.query.get(ticket.ticket_id)
    assert updated.subject == "New Subject"
    assert updated.message == "Updated Message"




# --- user_details tests ---

def test_user_details_unauthorized(client):
    response = client.get('/api/user_details', json={"user_id": 1})
    assert response.status_code == 401

def test_user_details_forbidden_for_student(client):
    hashed = bcrypt.hashpw(b"a", bcrypt.gensalt())
    user1 = User(email="u1@test.com", display_name="User1", role="student", password_hash=hashed)
    user2 = User(email="u2@test.com", display_name="User2", role="student", password_hash=hashed)
    db.session.add_all([user1, user2])
    db.session.commit()
    with client.session_transaction() as sess:
        sess['user_id'] = user1.user_id
    response = client.get('/api/user_details', json={"user_id": user2.user_id})
    assert response.status_code == 401

def test_user_details_self_success(client):
    hashed = bcrypt.hashpw(b"a", bcrypt.gensalt())
    user = User(email="self@test.com", display_name="Self", role="student", password_hash=hashed)
    db.session.add(user)
    db.session.commit()
    with client.session_transaction() as sess:
        sess['user_id'] = user.user_id
    response = client.get('/api/user_details', json={"user_id": user.user_id})
    assert response.status_code == 200
    assert response.get_json()['email'] == "self@test.com"

def test_user_details_admin_success(client):
    hashed = bcrypt.hashpw(b"a", bcrypt.gensalt())
    admin = User(email="admin@test.com", display_name="Admin", role="admin", password_hash=hashed)
    stud = User(email="stud@test.com", display_name="Student", role="student", password_hash=hashed)
    db.session.add_all([admin, stud])
    db.session.commit()
    with client.session_transaction() as sess:
        sess['user_id'] = admin.user_id
    response = client.get('/api/user_details', json={"user_id": stud.user_id})
    assert response.status_code == 200
    assert response.get_json()['email'] == "stud@test.com"

# --- get_users tests ---

def test_get_users_unauthorized(client):
    response = client.get('/api/get_users')
    assert response.status_code == 401

def test_get_users_forbidden_for_student(client):
    hashed = bcrypt.hashpw(b"a", bcrypt.gensalt())
    user = User(email="s@test.com", display_name="Stud", role="student", password_hash=hashed)
    db.session.add(user)
    db.session.commit()
    with client.session_transaction() as sess:
        sess['user_id'] = user.user_id
    response = client.get('/api/get_users')
    assert response.status_code == 403

def test_get_users_success_for_admin(client):
    hashed = bcrypt.hashpw(b"a", bcrypt.gensalt())
    admin = User(email="a@test.com", display_name="Admin", role="admin", password_hash=hashed)
    u1 = User(email="u1@test.com", display_name="User1", role="student", password_hash=hashed)
    u2 = User(email="u2@test.com", display_name="User2", role="advisor", password_hash=hashed)
    db.session.add_all([admin, u1, u2])
    db.session.commit()
    with client.session_transaction() as sess:
        sess['user_id'] = admin.user_id
    response = client.get('/api/get_users')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data['users']) == 3


def test_ticket_details_missing_ticket_id(client):
    response = client.get('/api/ticket_details')
    assert response.status_code == 400


def test_ticket_details_success(client):
    hashed = bcrypt.hashpw(b"testpassword", bcrypt.gensalt())
    user = User(email="det@test.com", display_name="DetUser", password_hash=hashed)
    dept = Department(department_id=1, name="Dept")
    ticket = Ticket(author=1, department=1, subject="Sub", message="Msg")  # type: ignore

    db.session.add_all([user, dept, ticket])
    db.session.commit()

    with client.session_transaction() as sess:
        sess['user_id'] = user.user_id

    response = client.get(f'/api/ticket_details?ticket_id={ticket.ticket_id}')
    assert response.status_code == 200
    data = response.get_json()
    assert data['subject'] == "Sub"
    assert data['body'] == "Msg"


def test_create_response_unauthorized(client):
    response = client.post('/api/create_response', json={})
    assert response.status_code == 401


def test_create_response_success(client):
    hashed = bcrypt.hashpw(b"testpassword", bcrypt.gensalt())
    user = User(email='resp@test.com', display_name='Responder', password_hash=hashed)
    dept = Department(department_id=1, name='Dept')
    ticket = Ticket(author=1, department=1, subject='Hi', message='Test')  # type: ignore
    db.session.add_all([user, dept, ticket])
    db.session.commit()

    with client.session_transaction() as sess:
        sess['user_id'] = user.user_id

    response = client.post('/api/create_response', json={
        "ticket_id": ticket.ticket_id,
        "message": "Here is a response."
    })
    assert response.status_code == 201


def test_archive_ticket_unauthorized(client):
    response = client.post('/api/archive_ticket', json={})
    assert response.status_code == 401


def test_archive_ticket_permission_denied(client):
    hashed = bcrypt.hashpw(b"testpassword", bcrypt.gensalt())
    user = User(email="stud@test.com", display_name="Student", role="student", password_hash=hashed)
    db.session.add(user)
    db.session.commit()
    with client.session_transaction() as sess:
        sess['user_id'] = user.user_id

    response = client.post('/api/archive_ticket', json={"ticket_id": 1})
    assert response.status_code == 401


def test_archive_ticket_success(client):
    hashed = bcrypt.hashpw(b"testpassword", bcrypt.gensalt())
    user = User(email="admin@test.com", display_name="Admin", role="admin", password_hash=hashed)
    dept = Department(department_id=1, name="Dept")
    ticket = Ticket(author=1, department=1, subject="Arch", message="Archive me")  # type: ignore
    db.session.add_all([user, dept, ticket])
    db.session.commit()

    with client.session_transaction() as sess:
        sess['user_id'] = user.user_id

    response = client.post('/api/archive_ticket', json={"ticket_id": ticket.ticket_id})
    assert response.status_code == 200

    from web_app.models import ArchivedTicket
    archived = ArchivedTicket.query.filter_by(ticket_id=ticket.ticket_id).first()
    assert archived is not None

def test_login_missing_fields(client):
    response = client.post('/api/login', json={})
    assert response.status_code == 400


def test_login_user_not_found(client):
    response = client.post('/api/login', json={
        "email": "nosuchuser@test.com",
        "password": "wrong"
    })
    # Should not reveal whether email exists
    assert response.status_code == 400 or response.status_code == 401


def test_login_success(client):
    hashed = bcrypt.hashpw("mypassword".encode('utf-8'), bcrypt.gensalt())
    user = User(email="login@test.com", display_name="LoginUser", password_hash=hashed)
    db.session.add(user)
    db.session.commit()

    response = client.post('/api/login', json={
        "email": "login@test.com",
        "password": "mypassword"
    })

    assert response.status_code == 200
    assert response.get_json()['message'] == "User logged in"

def test_signup_missing_fields(client):
    response = client.post('/api/signup', json={})
    assert response.status_code == 400


def test_signup_success(client, monkeypatch):
    # Mock email sending
    monkeypatch.setattr(resend.Emails, "send", lambda *a, **k: None)

    response = client.post('/api/signup', json={
        "email": "signup@test.com",
        "name": "Test User",
        "password": "abcd1234"
    })

    assert response.status_code == 200
    assert response.get_json()['message'] == "Verification email sent"

    pending = PendingUser.query.filter_by(email="signup@test.com").first()
    assert pending is not None
    assert len(pending.verification_code) == 5

def test_verify_no_pending_user(client):
    response = client.post('/api/verify/nouser@test.com', json={"code": "ABCDE"})
    assert response.status_code == 404


def test_verify_incorrect_code(client):
    pending = PendingUser(
        email="veri@test.com",
        display_name="Temp User",
        role="student",
        password_hash=b"fakehash",
        verification_code="RIGHT",
        expires_at=datetime.utcnow() + timedelta(minutes=5)
    )
    db.session.add(pending)
    db.session.commit()

    response = client.post("/api/verify/veri@test.com", json={"code": "WRONG"})
    assert response.status_code == 400


def test_verify_success(client):
    pending = PendingUser(
        email="ok@test.com",
        display_name="OkUser",
        role="student",
        password_hash=b"hash",
        verification_code="ABCDE",
        expires_at=datetime.utcnow() + timedelta(minutes=5)
    )
    db.session.add(pending)
    db.session.commit()

    response = client.post("/api/verify/ok@test.com", json={"code": "ABCDE"})
    assert response.status_code == 201

    user = User.query.filter_by(email="ok@test.com").first()
    assert user is not None

    leftover = PendingUser.query.filter_by(email="ok@test.com").first()
    assert leftover is None

def test_get_archived_tickets_unauthorized(client):
    response = client.get('/api/get_archived_tickets')
    assert response.status_code == 401


def test_get_archived_tickets_success(client):
    hashed = bcrypt.hashpw(b"testpassword", bcrypt.gensalt())
    user = User(email="arch@test.com", display_name="Arch", role="admin", password_hash=hashed)
    dept = Department(department_id=1, name="Dept")
    tick = ArchivedTicket(
        author=1, department=1, subject="Sub", message="Msg"
    )
    db.session.add_all([user, dept, tick])
    db.session.commit()

    with client.session_transaction() as sess:
        sess['user_id'] = user.user_id

    response = client.get('/api/get_archived_tickets')
    assert response.status_code == 200
    assert response.get_json()['tickets'][0]['subject'] == "Sub"

def test_archived_ticket_details_missing_ticket_id(client):
    response = client.get('/api/archived_ticket_details')
    assert response.status_code == 400


def test_archived_ticket_details_unauthorized(client):
    response = client.get('/api/archived_ticket_details?ticket_id=1')
    assert response.status_code == 401


def test_archived_ticket_details_success(client):
    hashed = bcrypt.hashpw(b"testpassword", bcrypt.gensalt())
    user = User(email="arch2@test.com", display_name="Arch", role="admin", password_hash=hashed)
    dept = Department(department_id=1, name="Dept")
    tick = ArchivedTicket(author=1, department=1, subject="ASub", message="AMsg")
    db.session.add_all([user, dept, tick])
    db.session.commit()

    with client.session_transaction() as sess:
        sess['user_id'] = user.user_id

    response = client.get(f'/api/archived_ticket_details?ticket_id={tick.ticket_id}')
    assert response.status_code == 200

    data = response.get_json()
    assert data['subject'] == "ASub"
    assert data['body'] == "AMsg"