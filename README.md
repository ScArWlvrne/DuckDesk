# ATGS
Academic Ticketing and Graduation system

A full-stack application with a Flask backend and Next.js frontend for managing academic tickets and graduation planning.

## Architecture

- **Backend**: Flask API (Python) running on `http://localhost:5001`
- **Frontend**: Next.js (TypeScript/React) running on `http://localhost:3000`
- **Database**: PostgreSQL (Docker container)

## Getting Started

### Prerequisites

- python
- brew (linux)
- Node.js and npm (for frontend development)

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ATGS.git
   cd ATGS
   ```

2. **Create environment file**:
   Create `web_app/.env` with the following content:
   ```
   FLASK_APP=app.py
   FLASK_ENV=development
   SQLALCHEMY_DATABASE_URI=postgresql://localhost:5432/atgs
DATABASE_URL=postgresql://localhost:5432/atgs
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=atgs
   SECRET_KEY=dev-secret-key-change-in-production
   ```

3. **download and run the database**:
   make sure that there are no files in web_app/migrations/versions by running rm -rf migrations/versions/* in web_app/
   download and install postgresql. You'll need to download brew (linux), 
   ```bash
   brew install postgresql; brew services start postgresql
   ```
   verify the server is running
   ```bash
   pg_isready
   ```
   create the database
   ```bash
   createdb atgs
   ```
   add the tables in web_app/
   ```bash
   flask db migrate
   flask db upgrade
   ```
   add the temp data to the database
   ```bash
   python seed.py
   ```

4. **Access the backend**:
   Open your browser and go to [http://localhost:5001](http://localhost:5001)

> Note: Port 5001 is mapped to the container's internal port 5000. If you modify this mapping in `docker-compose.yml`, update the URL accordingly.

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd "source files/frontend"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access the frontend**:
   Open your browser and go to [http://localhost:3000](http://localhost:3000)

### Connecting Frontend to Backend

1. **Login to backend** (sets session cookie):
   Visit [http://localhost:5001/login/1](http://localhost:5001/login/1) in your browser
   (Replace `1` with a valid user ID from your database)

2. **Open frontend**:
   Visit [http://localhost:3000](http://localhost:3000)
   The frontend will automatically fetch tickets from the backend.

## API Endpoints

### Authentication
- `GET /login/<user_id>` - Login a user (sets session cookie)

### User
- `GET /api/current_user` - Get current logged-in user (requires session)

### Tickets
- `GET /api/get_tickets` - Get paginated list of tickets (requires session)
  - Query params: `page`, `per_page`, `status`, `department`, `priority`, `text`
- `POST /api/submit_ticket` - Create a new ticket (requires session)
  - Body: `{ department: number, subject: string, message: string }`

## Database Migrations

Migrations and seeding are automatically handled when the container starts. If you need to rerun them manually:

```bash
docker-compose exec web flask db upgrade
docker-compose exec web python seed.py
```

## Development

### Backend Development
- All backend development should be done in containers
- Backend code is mounted as a volume, so changes are reflected immediately
- Check logs: `docker-compose logs web`

### Frontend Development
- Frontend runs on your host machine (not in Docker)
- Hot reload is enabled by default
- API calls are configured to point to `http://localhost:5001`

### Environment Variables

**Backend** (`web_app/.env`):
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - Flask session secret key
- `FLASK_APP` - Flask application entry point
- `FLASK_ENV` - Flask environment (development/production)

**Frontend** (optional, `source files/frontend/.env.local`):
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: `http://localhost:5001`)

## Project Structure

```
ATGS/
├── web_app/                 # Flask backend
│   ├── app.py              # Flask application setup
│   ├── routes.py            # API routes
│   ├── models.py            # Database models
│   ├── seed.py              # Database seeding script
│   ├── migrations/          # Database migrations
│   └── .env                 # Environment variables (create this)
├── source files/
│   └── frontend/            # Next.js frontend
│       ├── app/             # Next.js app directory
│       ├── lib/             # Utility functions
│       │   ├── api.ts       # API client
│       │   └── ticketMapper.ts  # Data mapping
│       └── package.json
├── docker-compose.yml       # Docker configuration
├── Dockerfile               # Backend Docker image
└── requirements.txt         # Python dependencies
```

## Documentation

- [Backend-Frontend Connection Guide](docs/BACKEND_FRONTEND_CONNECTION.md) - How the frontend and backend connect
- [Docker Troubleshooting](docs/DOCKER_TROUBLESHOOTING.md) - Common Docker issues and solutions
- [Migration Guide](docs/MIGRATION_GUIDE.md) - Guide for copying changes between projects

## Troubleshooting

### Backend won't start
- Check that `web_app/.env` file exists with correct values
- Check Docker logs: `docker-compose logs web`
- See [Docker Troubleshooting Guide](docs/DOCKER_TROUBLESHOOTING.md)

### Frontend can't connect to backend
- Ensure backend is running: `docker-compose ps`
- Check CORS settings in `web_app/app.py`
- Make sure you've logged in first: `http://localhost:5001/login/1`
- See [Backend-Frontend Connection Guide](docs/BACKEND_FRONTEND_CONNECTION.md)

### Database issues
- Reset database: `docker-compose down -v && docker-compose up --build`
- Check migration status: `docker-compose exec web flask db current`


