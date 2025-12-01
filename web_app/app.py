'''
Web application for University of Oregon 
student/advisor ticketing system and graduation planner
'''

from flask import Flask, request, render_template, redirect, url_for, session
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import case
from sqlalchemy.orm import joinedload
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()


def create_app():
    from web_app.models import Department, Major, Minor, User, Ticket
    from web_app.routes import bp as main_bp

    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
    print(app.config['SQLALCHEMY_DATABASE_URI'])
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev')

    app.config['SESSION_COOKIE_SAMESITE'] = "Lax" # DEV ONLY, MUST BE NONE IN PRODUCTION
    app.config['SESSION_COOKIE_SECURE'] = False  # Must be False for localhost
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    
    CORS(
    app,
    supports_credentials=True,
    origins=[
        "http://127.0.0.1:3000",
        "http://localhost:3000",
    ],
    )

    db.init_app(app)
    migrate.init_app(app, db)
    app.register_blueprint(main_bp)

    return app

if __name__ == '__main__':
    create_app().run(debug=True, host="0.0.0.0")