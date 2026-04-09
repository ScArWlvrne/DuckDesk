# 🦆 DuckDesk

Workspace-Based Academic Communication Platform (Redesign of the original DuckDesk system)

DuckDesk is a full‑stack academic communication platform currently undergoing a major redesign (DuckDesk vNext). The original system focused on ticket-based workflows for advising and academic questions. The new version shifts to a flexible, workspace-based model that supports both private support threads and public peer support forums within course sections and advising contexts.

This README provides a high‑level overview intended to outline the new project vision.

Detailed WIP backend and frontend READMEs are linked below.

---

## 📘 Table of Contents

- [🦆 DuckDesk](#-duckdesk)
  - [📘 Table of Contents](#-table-of-contents)
  - [🎯 Project Mission](#-project-mission)
  - [✨ System Overview (vNext Design)](#-system-overview-vnext-design)
    - [✔ Workspace Model](#-workspace-model)
    - [✔ Thread-Based Communication](#-thread-based-communication)
    - [✔ Role \& Permission System](#-role--permission-system)
    - [✔ Message System](#-message-system)
    - [✔ Prioritization \& Organization](#-prioritization--organization)
  - [🧰 Technologies Used](#-technologies-used)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [📁 Repository Structure](#-repository-structure)
  - [🛠 Development Setup](#-development-setup)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
    - [Local Email (Resend) Notes](#local-email-resend-notes)
  - [📑 API Documentation](#-api-documentation)
  - [🔒 Security Considerations](#-security-considerations)
    - [➤ **Shibboleth / UO or Microsoft Single Sign‑On**](#-shibboleth--uo-or-microsoft-single-signon)
  - [🤝 Contributing](#-contributing)
    - [Development Standards](#development-standards)
  - [📚 Additional Documentation](#-additional-documentation)
  
---

## 🎯 Project Mission

DuckDesk’s purpose is to provide an organized, centralized communication workflow built around **workspaces**. Each workspace represents a course section or advising context, where users can communicate through structured threads.

The redesigned system focuses on:

- Reducing reliance on email for academic communication
- Providing visibility into unanswered questions
- Supporting both **private support threads** (student ↔ staff communication)
- Enabling **public peer support forum threads** (Piazza-style collaboration)
- Giving instructors flexible control over permissions and behavior within their courses

DuckDesk vNext is designed to better reflect real academic workflows while remaining adaptable across different departments and use cases.

---

## ✨ System Overview (vNext Design)

### ✔ Workspace Model

- Communication is organized into **workspaces** (course sections or advising contexts)
- Users join workspaces and are assigned roles (student, instructor, GE/TA, admin)
- Workspace behavior is configurable via reusable configuration objects

### ✔ Thread-Based Communication

- **Private Threads:** Direct communication between students and staff
- **Public Threads:** Open peer support forum visible to all workspace members
- Threads support:
  - Structured message history
  - File attachments
  - Resolution status (open/resolved)
  - Moderation (lock, hide)
  - Optional anonymity for public posts

### ✔ Role & Permission System

- Base roles define default permissions within a workspace
- Capability overrides allow fine-grained control (granting or restricting actions)
- Permissions enforce visibility and moderation rules

### ✔ Message System

- Messages are the core unit of communication
- Support for:
  - Standard messages
  - Staff-only notes (visible only to staff)
  - Attachments

### ✔ Prioritization & Organization

- Threads are organized by:
  - Unanswered status
  - Resolution state
  - Recent activity
- Designed to surface high-priority questions quickly for staff

---

## 🧰 Technologies Used

### Backend

- **Flask** (Python)
- **SQLAlchemy + Alembic**
- **PostgreSQL**
- **Resend Email API**

### Frontend

- **Next.js** (React, TypeScript)
- Hosted separately, located in:
  `frontend/`

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
├── frontend/                # Next.js frontend
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── README.md            # Frontend-specific documentation
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
cd frontend
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

DuckDesk currently uses **Resend** for signup verification emails.

- The production key sends from **duckdesk.org**
- Individual developers may not have access to that domain
- Local development will require modifying the sender address in the Flask auth routes to use a domain allowed by their personal Resend account

These modifications are documented in the backend README.

---

## 📑 API Documentation

The full DuckDesk API is documented in OpenAPI 3.0 format:

📄 **`docs/openapi.yaml`**  
https://github.com/ScArWlvrne/DuckDesk/blob/main/docs/openapi.yaml

This includes:

- Authentication routes
- Workspace and membership operations
- Thread and message operations
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

### ➤ **Shibboleth / UO or Microsoft Single Sign‑On**

This would provide:

- Strong identity verification  
- Centralized credential management  
- Institutional compliance and auditing  
- Elimination of local password storage

This README transparently acknowledges these limitations for evaluation by UO Systems Administrators.

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
- **Frontend README:** `frontend/README.md`  
- **OpenAPI Spec:** `docs/openapi.yaml`

---

If you have questions about system compatibility or institutional deployment, please contact the project team.
