import pytest
from web_app.app import create_app, db
from web_app.models import User, Ticket, Department

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

def test_home(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b'Select a User to Log In' in response.data

def test_signup_get(client):
    response = client.get('/signup')
    assert response.status_code == 200

def test_signup_post_success(client):
    response = client.post('/signup', data={
        'email': 'test@example.com',
        'name': 'Test User',
        'role': 'student'
    }, follow_redirects=True)
    assert response.status_code == 200
    assert User.query.filter_by(email='test@example.com').first() is not None

def test_signup_post_missing_fields(client):
    response = client.post('/signup', data={
        'email': ''
    })
    assert response.status_code == 400

def test_login_redirect(client):
    user = User(email='user@example.com', display_name='User')
    db.session.add(user)
    db.session.commit()
    response = client.get(f'/login/{user.user_id}')
    assert response.status_code == 302
    assert response.location.endswith('/api/submit_ticket')  # Just ensure it redirects somewhere

def test_submit_ticket_unauthorized(client):
    response = client.post('/api/submit_ticket', json={})
    assert response.status_code == 401

def test_submit_ticket_success(client):
    user = User(email='student@example.com', display_name='Student')
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
    user = User(email='student2@example.com', display_name='Student2')
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
    assert response.status_code == 302

def test_get_tickets_success(client):
    user = User(email='student3@example.com', display_name='Student3')
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
    user = User(email='student4@example.com', display_name='Student4')
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