'''Ensures the database is created with proper tables whenever app is run

Created 10/30/25 - Kyran McCown & ChatGPT'''

from flask_migrate import upgrade
from app import app, db

# This assumes app and db are defined in app.py and imported directly
with app.app_context():
    upgrade()