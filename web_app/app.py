# =============================================================================
# File: app.py
# Project: DuckDesk (ATGS University of Oregon Ticketing System)
# Description:
#     Core Flask application factory responsible for initializing the backend
#     application, database, migrations, CORS configuration, and session
#     settings. This file is the entry point for creating and running the
#     DuckDesk backend server.
#
# Creation Date: October 16th
# Authors: Kyran McCown, ChatGPT
#
# Notes:
#     - This file defines the application factory pattern used for creating
#       independent instances of the backend (useful for testing, development,
#       and deployment).
#     - Sensitive values (SECRET_KEY, DATABASE_URL, FRONTEND_URL, etc.) are
#       loaded from environment variables for security and configurability.
# =============================================================================

"""
Web application entry point for the University of Oregon's DuckDesk system,
a student–advisor/professr ticketing and communication platform.

This module defines the Flask application factory and configures:
    - SQLAlchemy database connection
    - Alembic migrations via Flask-Migrate
    - Cross‑origin resource sharing (CORS) for secure communication with
      the React/Next.js frontend
    - Session cookie behavior for development and production environments
"""

# ----------------------------- Imports ---------------------------------------
# Core Flask modules for request handling, rendering (rarely used in the API),
# redirection, URL generation, and secure session management.
# Flask-Migrate enables Alembic-powered database migrations.
# Flask-SQLAlchemy provides ORM access to the PostgreSQL database.
# Flask-CORS is used to expose cookie-based authentication to the frontend.
# SQLAlchemy utilities support optimized query loading strategies.
# python-dotenv loads environment variables from a .env file during development.
from flask import Flask, request, render_template, redirect, url_for, session
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import case
from sqlalchemy.orm import joinedload
from dotenv import load_dotenv
import os

load_dotenv()

# SQLAlchemy database instance and Alembic migration handler.
# These are initialized here and later attached to the Flask app inside
# create_app() so that they can be shared across modules.
db = SQLAlchemy()
migrate = Migrate()


def create_app():
    """
    Application factory for creating and configuring an instance of the DuckDesk
    backend.

    Responsibilities:
        - Import and register database models and the main API route blueprint.
        - Configure environment‑specific session cookie behavior to ensure secure
          authentication in production.
        - Attach SQLAlchemy and Flask-Migrate instances to the app.
        - Apply CORS settings to allow the frontend (Next.js) to communicate
          with this backend using credential‑protected requests.
        - Return the fully constructed Flask app instance.

    Returns:
        Flask: A configured Flask application ready to be run or tested.
    """
    from models import Department, Major, Minor, User, Ticket
    from routes import bp as main_bp

    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

    # Configure cookie security: production requires Secure + SameSite=None,
    # development uses relaxed settings to allow local testing.
    if os.getenv("FLASK_ENV") == "production":
        app.config['SESSION_COOKIE_SAMESITE'] = "None"
        app.config['SESSION_COOKIE_SECURE'] = True
    else:
        app.config['SESSION_COOKIE_SAMESITE'] = "Lax"
        app.config['SESSION_COOKIE_SECURE'] = False

    app.config['SESSION_COOKIE_HTTPONLY'] = True
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://127.0.0.1:3000")
    
    # Enable CORS so the frontend can send credentialed requests (cookies).
    # Allowed origins include local dev servers and the production DuckDesk domain.
    CORS(
        app,
        supports_credentials=True,
        origins=[
            FRONTEND_URL,
            "http://127.0.0.1:3000",
            "http://localhost:3000",
            "https://duckdesk.org",
            "https://www.duckdesk.org"
        ]
    )

    db.init_app(app)
    migrate.init_app(app, db)
    app.register_blueprint(main_bp)

    return app

# --------------------------- Application Runner ------------------------------
# Running this file directly launches the backend server using the configured
# environment settings. In production, this is typically managed by a WSGI
# server (e.g., gunicorn), not by Flask's built-in development server.
if __name__ == '__main__':
    # Enable debug mode only when not in production.
    debug = os.getenv("FLASK_ENV") != "production"
    create_app().run(debug=debug, host=os.getenv("BACKEND_URL"))