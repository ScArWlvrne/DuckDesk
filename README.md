# 🦆 DuckDesk
Academic Ticketing System for Students, Advisors, and Professors at the University of Oregon

DuckDesk is a full‑stack academic ticketing platform designed to streamline communication between **students**, **academic advisors**, and **professors**. The system centralizes academic questions, reduces email inbox load—especially for faculty—and supports a structured workflow for managing academic inquiries.

This README provides a high‑level overview intended for:
- **CS422 faculty evaluating the project**, and  
- **UO Systems Administrators** assessing technological compatibility with university infrastructure.

Detailed backend and frontend READMEs are linked below.

---

## 📘 Table of Contents
1. [Project Mission](#project-mission)  
2. [Current Features](#current-features)  
3. [Technologies Used](#technologies-used)  
4. [Repository Structure](#repository-structure)  
5. [Development Setup](#development-setup)  
   - [Backend Setup](#backend-setup)  
   - [Frontend Setup](#frontend-setup)  
   - [Local Email (Resend) Notes](#local-email-resend-notes)  
6. [Deployment Overview](#deployment-overview)  
7. [API Documentation](#api-documentation)  
8. [Security Considerations](#security-considerations)  
9. [Planned FERPA Anonymization](#planned-ferpa-anonymization)  
10. [Contributing](#contributing)  
11. [Additional Documentation](#additional-documentation)

---

## 🎯 Project Mission

DuckDesk’s purpose is to provide an organized, centralized communication workflow for:
- Students seeking academic advising or course‑related assistance  
- Professor and advisors managing high volumes of student inquiries  
- Professors who wish to keep their personal inboxes free of class‑related questions

DuckDesk improves message traceability, reduces confusion, and establishes a standard location for academic support. In a production environment, DuckDesk could connect with UO authentication systems and advising tools.

---

## ✨ Current Features

### ✔ Authentication Workflow
- Email & password login via Flask session cookies  
- Secure password hashing via bcrypt  
- Email verification for signup (using Resend API)

### ✔ Ticketing System
- Students can create tickets for departments or professors  
- Advisors and professors can respond directly within the system  
- Tickets support:
  - Status updates  
  - Priority levels  
  - Assignment to advisors or professors  
  - Threaded responses  
  - Archiving

### ✔ Role‑Based Access
- **Students:** view and manage their own tickets  
- **Advisors/Professors:** view assigned or departmental tickets  
- **Admins:** full system visibility and user list filtering

### ✔ Search & Filtering
Available for both active and archived tickets:
- Status  
- Department  
- Priority  
- Text matching  
- Pagination

---

## 🧰 Technologies Used

### Backend
- **Flask** (Python)
- **SQLAlchemy + Alembic**
- **PostgreSQL** (local and Render cloud database)
- **Resend Email API** (for signup verification)

### Frontend
- **Next.js** (React, TypeScript)
- Hosted separately, located in:  
  `source_files/frontend/`

### Infrastructure
- **Render** (Backend hosting + PostgreSQL)  
- **Cloudflare** (DNS + SSL for `duckdesk.org`)

No Docker artifacts remain in the project.

---

## 📁 Repository Structure

```
ATGS/
├── web_app/                     # Flask backend
│   ├── app.py
│   ├── routes.py
│   ├── models.py
│   ├── seed.py
│   ├── migrations/
│   └── README.md                # Backend-specific documentation
│
├── source_files/
│   └── frontend/                # Next.js frontend
│       ├── app/
│       ├── components/
│       ├── lib/
│       └── README.md            # Frontend-specific documentation
│
├── docs/
│   └── openapi.yaml             # OpenAPI Specification
│
├── requirements.txt
└── README.md (this file)
```

---

## 🛠 Development Setup

### Backend Setup

1. Create a Python virtual environment and install dependencies:
```bash
cd web_app
pip install -r ../requirements.txt
```

2. Create `.env`:
```
FLASK_APP=app:create_app
FLASK_ENV=development
SECRET_KEY=dev
DATABASE_URL=postgresql://<local-user>@localhost:5432/atgs
RESEND_API_KEY=<your‑key-or-placeholder>
```

3. Initialize database:
```bash
createdb atgs
flask db upgrade
python seed.py
```

4. Start backend:
```bash
flask run
```

Backend will be available at:  
**http://localhost:5000**

---

### Frontend Setup

1. Install dependencies:
```bash
cd "source_files/frontend"
npm install
```

2. Start development server:
```bash
npm run dev
```

Frontend will be available at:  
**http://localhost:3000**

---

### Local Email (Resend) Notes

DuckDesk uses **Resend** for signup verification emails.

- The production key sends from **duckdesk.org**  
- Individual developers may not have access to that domain  
- Local development will require modifying the sender address in the Flask auth routes to use a domain allowed by their personal Resend account

These modifications are documented in the backend README.

---

## 🚀 Deployment Overview

Current production deployment uses:

### Backend (Flask)
- Hosted on Render at  
  **https://api.duckdesk.org/api**

### Database
- Render PostgreSQL instance (cloud hosted)

### Frontend (Next.js)
- Hosted on Render at  
  **https://www.duckdesk.org**


---

## 📑 API Documentation

The full DuckDesk API is documented in OpenAPI 3.0 format:

📄 **`docs/openapi.yaml`**  
https://github.com/Bardiaah2/ATGS/blob/main/docs/openapi.yaml

This includes:
- Authentication routes  
- Ticket operations  
- Archived ticket operations  
- User listing and filtering  
- Data schemas for all models

---

## 🔒 Security Considerations

DuckDesk currently implements:
- bcrypt hashed passwords  
- Flask session cookies  
- HTTPS enforced by Cloudflare  

However, **this authentication system is not suitable for production use at the University of Oregon**.  
If adopted institutionally, the platform would use:

### ➤ **Shibboleth / UO Single Sign‑On**
This would provide:
- Strong identity verification  
- Centralized credential management  
- Institutional compliance and auditing  
- Elimination of local password storage

This README transparently acknowledges these limitations for evaluation by UO Systems Administrators.

---

## ⚠️ Planned FERPA Anonymization

Ticket data reuse (e.g., for analytics or future LLM training) will likely require **redaction** and **anonymization**.

Features under consideration:
- Removing student identifiers  
- Normalizing course references  
- Anonymizing instructor names when appropriate  
- Preserving semantic intent for future model usefulness

**FERPA compliance is NOT implemented yet**—requirements will be validated with campus policy before design begins.

---

## 🤝 Contributing

DuckDesk welcomes improvements from instructors, system administrators, and project team members.

### Development Standards
- Follow the comment and documentation conventions established in CS422  
- Ensure all backend and frontend changes include descriptive commit messages  
- Update backend/frontend READMEs when altering setup steps or environment variables  
- Run Alembic migrations with care to maintain schema compatibility

---

## 📚 Additional Documentation

- **Backend README:** `web_app/README.md`  
- **Frontend README:** `source_files/frontend/README.md`  
- **OpenAPI Spec:** `docs/openapi.yaml`

---

If you have questions about system compatibility or institutional deployment, please contact the project team.
