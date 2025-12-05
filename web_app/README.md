

# 🦆 DuckDesk — Backend (Flask API)

This directory contains the **Flask backend** for DuckDesk, the academic ticketing system designed for students, advisors, and professors at the University of Oregon.  
It exposes all API endpoints used by the Next.js frontend and manages authentication, ticket logic, user roles, database migrations, and email verification via Resend.

This README is intended for:
- **CS422 faculty evaluating backend architecture**
- **UO Systems Administrators** determining hosting compatibility
- **Project contributors** working directly with the Flask API

For the full system overview, see the root `README.md`.

---

## 📁 Backend Directory Structure

```
web_app/
├── app.py                # Flask application factory + configuration
├── models.py             # SQLAlchemy ORM models
├── routes.py             # API endpoints
├── seed.py               # Initial development seed data
├── migrations/           # Alembic migration history
├── __init__.py
├── README.md             # (this file)
└── .env                  # Backend environment variables (not tracked)
```

---

## 🛠️ Local Development Setup

### 1. Install Dependencies
From the project root or inside `web_app/`:

```bash
pip install -r ../requirements.txt
```

### 2. Create `web_app/.env`

An example `.env` (modify USER as needed):

```
FLASK_APP=app:create_app
FLASK_ENV=development
SECRET_KEY=dev
DATABASE_URL=postgresql://<your-local-username>@localhost:5432/atgs
RESEND_API_KEY=<your-resend-api-key>
```

**Important:**  
Resend requires a verified domain to send email.  
Developers without access to **duckdesk.org** should modify `routes.py` to use a sender address permitted by their Resend account (e.g., a personal domain).

### 3. Initialize Database

```bash
createdb atgs
flask db upgrade
python seed.py
```

### 4. Run the Backend Server

```bash
flask run
```

Backend will be available at:

**http://127.0.0.1:5000**

Avoid using `localhost` as on many machines this will resolve to IPv6, which can cause issues with the current Flask configuration.

---

## 🧱 Models Overview

DuckDesk uses SQLAlchemy ORM with Alembic-managed migrations.

### Core Models:

- **User**
  - Roles: `student`, `advisor`, `admin`
  - Optional relations to department/major/minor
  - Password hashed via bcrypt
- **Ticket**
  - Author, optional assignee
  - Subject, message, department, priority, status
  - Threaded ticket responses
- **TicketResponse**
  - Message history attached to a ticket
- **ArchivedTicket / ArchivedResponse**
  - Permanent archive versions used when closing tickets

Migration state is tracked in `/migrations`.

---

## 🔌 API Overview

The full API is documented in the OpenAPI spec:

📄 `docs/openapi.yaml`  
https://github.com/Bardiaah2/ATGS/blob/main/docs/openapi.yaml

### Major Route Groups:

| Area | Description |
|------|-------------|
| **Authentication** | Signup, email verification, login |
| **User Management** | `user_details`, filtered `get_users` |
| **Active Tickets** | Submit, update, list, filter, respond |
| **Archived Tickets** | Archive, list, filter, retrieve |

All routes enforce session‑based authentication.

---

## 📬 Email Verification (Resend)

During signup, DuckDesk sends a verification code using the **Resend Email API**.

Local developers must:
- Use **their own Resend API key**
- Update the sender address in `routes.py` to match allowed domains

Production uses a verified sender tied to **duckdesk.org**.

---

## 🔒 Security Notes

This backend uses:
- bcrypt password hashing  
- Flask session cookies  
- HTTPS enforced by Cloudflare in production  

**However, DuckDesk’s authentication is *not* production‑grade** and is intended only for prototyping.

For institutional deployment, authentication would be replaced with:

### ➜ UO Shibboleth / SSO Integration  
This provides:
- Verified university identities  
- Centralized credential control  
- Higher compliance with university security policies  

This is important for UO Systems Administrators reviewing the project.

---

## ⚠️ FERPA‑Compliant Anonymization (Planned)

The backend does **not yet** implement FERPA pseudonymization/anonymization.

A future update may introduce:
- Removal of student identifiers before archiving/exporting tickets  
- Normalization of course/instructor information  
- Support for safe analytics/LLM training use cases  

Work on this will begin only after verifying exact UO policy requirements.

---

## 🔧 Development Notes

### Running Migrations
Create new migrations:

```bash
flask db migrate -m "Describe the change"
```

Apply migrations:

```bash
flask db upgrade
```

### Common Issues

| Problem | Likely Cause |
|--------|--------------|
| “No user logged in” | Missing session cookie; login route not called |
| DB errors | Missing migration; schema out of sync |
| Cannot send email | Resend domain restrictions |
| Render DB mismatch | Env variable `DATABASE_URL` not set correctly |

---

## 🤝 Contributing Guidelines

- Follow CS422 comment/documentation standards  
- Keep backend logic in `routes.py` focused and minimal  
- Update OpenAPI spec when adding/changing endpoints  
- When altering models, always create an Alembic migration  
- Communicate schema‑affecting changes to frontend developers  

---

## 📚 Related Documentation

- **Full System README:** `../README.md`
- **Frontend Documentation:** `../source_files/frontend/README.md`
- **API Specification:** `../docs/openapi.yaml`

---

If you have questions about backend functionality, institutional compatibility, or development workflow, please contact the DuckDesk team.