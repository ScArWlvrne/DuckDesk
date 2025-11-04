'''
Web application for University of Oregon 
student/advisor ticketing system and graduation planner
'''

from flask import Flask, request, render_template, redirect, url_for, session
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import case
from sqlalchemy.orm import joinedload
import os


db = SQLAlchemy()
migrate = Migrate()


def create_app():
    from web_app.models import Department, Major, Minor, User, Ticket
    from web_app.routes import bp as main_bp

    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://localhost/atgs')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev')

    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(main_bp)

    return app

if __name__ == '__main__':
    create_app().run(debug=True)