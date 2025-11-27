
#!/usr/bin/env python3
"""seed.py

Idempotent seeding script for development.
- Reads DATABASE_URL from the environment (falls back to local postgres).
- Will only insert users/tickets if the database appears empty (both users and tickets tables have zero rows).
- Inserts three admins (keeps the given real admin emails), a few test advisors and students (fake emails),
  and 10 tickets with varied created_at / last_updated / status / priority values for sorting tests.

Written in collaboration with ChatGPT.
"""

import os
import csv
import random
from datetime import datetime, timedelta
from pathlib import Path
from sqlalchemy import create_engine, text

# Use container-aware DATABASE_URL when available
DB_URL = os.getenv('DATABASE_URL', 'postgresql://localhost/atgs')

DATA_DIR = Path(__file__).parent / 'data'

USERS = [
    # Admins (real as requested)
    {"email": "kyran@uoregon.edu", "display_name": "Kyran McCown", "role": "admin"},
    {"email": "bardiaah@uoregon.edu", "display_name": "Bardia Ahmadi Dafchahi", "role": "admin"},
    {"email": "mmelner@uoregon.edu", "display_name": "Max Melner", "role": "admin"},
    # Advisors (generic test accounts)
    {"email": "advisor1@test.local", "display_name": "Test Advisor 1", "role": "advisor"},
    {"email": "advisor2@test.local", "display_name": "Test Advisor 2", "role": "advisor"},
    {"email": "advisor3@test.local", "display_name": "Test Advisor 3", "role": "advisor"},
    # Students (generic test accounts)
    {"email": "student1@test.local", "display_name": "Test Student 1", "role": "student"},
    {"email": "student2@test.local", "display_name": "Test Student 2", "role": "student"},
    {"email": "student3@test.local", "display_name": "Test Student 3", "role": "student"},
    {"email": "student4@test.local", "display_name": "Test Student 4", "role": "student"},
    {"email": "student5@test.local", "display_name": "Test Student 5", "role": "student"},
]

TICKET_STATUSES = ["open", "in progress", "closed"]
DEPARTMENTS = ["Tykeson", "Computer Science", "Financial Aid", "Housing"]

INSERT_DEPARTMENT_SQL = text(
    """
    INSERT INTO departments (name, display_name)
    VALUES (:name, :display_name)
    ON CONFLICT (name) DO NOTHING
    RETURNING department_id
    """
)


INSERT_MAJOR_SQL = text(
    """
    INSERT INTO majors (name, display_name, department_id)
    VALUES (:name, :display_name, :department_id)
    ON CONFLICT (name) DO NOTHING
    RETURNING major_id
    """
)

INSERT_MINOR_SQL = text(
    """
    INSERT INTO minors (name, display_name, department_id)
    VALUES (:name, :display_name, :department_id)
    ON CONFLICT (name) DO NOTHING
    RETURNING minor_id
    """
)

INSERT_USER_SQL = text(
    """
    INSERT INTO users (email, display_name, role)
    VALUES (:email, :display_name, :role)
    ON CONFLICT (email) DO NOTHING
    RETURNING user_id, role
    """
)

INSERT_TICKET_SQL = text(
    """
    INSERT INTO tickets (author, assignee, department, priority, subject, message, status, created_at, last_updated)
    VALUES (:author, :assignee, :department, :priority, :subject, :message, :status, :created_at, :last_updated)
    RETURNING ticket_id
    """
)

SELECT_COUNT_USERS = text("SELECT COUNT(*) FROM users")
SELECT_COUNT_TICKETS = text("SELECT COUNT(*) FROM tickets")

def read_csv(filepath):
    """Read a CSV file and return rows as dictionaries."""
    if not filepath.exists():
        print(f"Warning: {filepath} not found, skipping.")
        return []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)


def seed_academics(conn):
    """Seed departments, majors, and minors from CSV files (idempotent)."""
    
    # Seed departments
    print("Seeding departments...")
    csv_path = DATA_DIR / 'departments.csv'
    dept_rows = read_csv(csv_path)
    dept_map = {}
    inserted_depts = 0
    
    for row in dept_rows:
        name = row.get('name', '').strip()
        display_name = row.get('display_name', '').strip()
        
        if not name:
            continue

        if not display_name:
            display_name = name
        
        try:
            # try to insert 
            result = conn.execute(INSERT_DEPARTMENT_SQL, {
                'name': name,
                'display_name': display_name
            })
            row_data = result.fetchone()
            if row_data:
                dept_id = row_data[0]
                dept_map[name] = dept_id
                inserted_depts += 1
            else:
                # Already exists, fetch it
                existing = conn.execute(
                    text("SELECT department_id FROM departments WHERE name = :name"),
                    {'name': name}
                ).fetchone()
                if existing:
                    dept_map[name] = existing[0]
        except Exception as e:
            print(f"Error inserting department {name}: {e}")
    
    print(f"Inserted {inserted_depts} departments (total available: {len(dept_map)}).")
    
    # Seed majors
    print("Seeding majors...")
    csv_path = DATA_DIR / 'majors.csv'
    major_rows = read_csv(csv_path)
    inserted_majors = 0
    
    for row in major_rows:
        name = row.get('name', '').strip()
        display_name = row.get('display_name', '').strip()
        dept_name = row.get('department', '').strip()
        
        if not name or not display_name:
            continue
        
        dept_id = dept_map.get(dept_name) if dept_name else None
        
        try:
            result = conn.execute(INSERT_MAJOR_SQL, {
                'name': name,
                'display_name': display_name,
                'department_id': dept_id
            })
            if result.rowcount and result.rowcount > 0:
                inserted_majors += 1
        except Exception as e:
            print(f"Error inserting major {name}: {e}")
    
    print(f"Inserted {inserted_majors} majors.")
    
    # Seed minors
    print("Seeding minors...")
    csv_path = DATA_DIR / 'minors.csv'
    minor_rows = read_csv(csv_path)
    inserted_minors = 0
    
    for row in minor_rows:
        name = row.get('name', '').strip()
        display_name = row.get('display_name', '').strip()
        dept_name = row.get('department', '').strip()
        
        if not name or not display_name:
            continue
        
        dept_id = dept_map.get(dept_name) if dept_name else None
        
        try:
            result = conn.execute(INSERT_MINOR_SQL, {
                'name': name,
                'display_name': display_name,
                'department_id': dept_id
            })
            if result.rowcount and result.rowcount > 0:
                inserted_minors += 1
        except Exception as e:
            print(f"Error inserting minor {name}: {e}")
    
    print(f"Inserted {inserted_minors} minors.")
    return dept_map

def main():
    engine = create_engine(DB_URL)
    with engine.begin() as conn:
        # First seed departments, majors, minors
        try:
            dept_map = seed_academics(conn)
        except Exception as e:
            print(f"Error seeding academics: {e}")
            dept_map = {}
        
        # Also ensure the hardcoded departments exist
        for dept_name in DEPARTMENTS:
            if dept_name not in dept_map:
                try:
                    result = conn.execute(INSERT_DEPARTMENT_SQL, {
                        'name': dept_name,
                        'display_name': dept_name
                    })
                    row_data = result.fetchone()
                    if row_data:
                        dept_map[dept_name] = row_data[0]
                    else:
                        existing = conn.execute(
                            text("SELECT department_id FROM departments WHERE name = :name"),
                            {'name': dept_name}
                        ).fetchone()
                        if existing:
                            dept_map[dept_name] = existing[0]
                except Exception as e:
                    print(f"Error ensuring department {dept_name} exists: {e}")
        # Check if database is empty (no users and no tickets)
        try:
            users_count = conn.execute(SELECT_COUNT_USERS).scalar()
        except Exception:
            users_count = 0
        try:
            tickets_count = conn.execute(SELECT_COUNT_TICKETS).scalar()
        except Exception:
            tickets_count = 0

        if users_count > 0 or tickets_count > 0: # type: ignore
            print(f"Database not empty (users={users_count}, tickets={tickets_count}) — skipping seed.")
            return

        print("Seeding users...")
        inserted_users = 0
        for u in USERS:
            result = conn.execute(INSERT_USER_SQL, u)
            if result.rowcount and result.rowcount > 0:
                inserted_users += 1

        print(f"Inserted {inserted_users} users (duplicates ignored).")

        # Fetch advisor and student ids for ticket creation
        advisor_rows = conn.execute(text("SELECT user_id FROM users WHERE role = 'advisor' ORDER BY user_id")).fetchall()
        student_rows = conn.execute(text("SELECT user_id FROM users WHERE role = 'student' ORDER BY user_id")).fetchall()
        advisor_ids = [r[0] for r in advisor_rows]
        student_ids = [r[0] for r in student_rows]

        if not student_ids:
            print("No student users found after seeding — aborting ticket creation.")
            return

        print("Seeding tickets...")
        now = datetime.utcnow()
        inserted_tickets = 0

        status_map = {
            "open": 1,
            "in progress": 2,  # or 3, depending on your logic
            "closed": 0
        }

        for i in range(10):
            author = random.choice(student_ids)
            assignee = random.choice(advisor_ids) if advisor_ids and random.random() < 0.6 else None
            dept_name = random.choice(DEPARTMENTS)
            department_id = dept_map.get(dept_name)
            if not department_id:
                print(f"Warning: Department '{dept_name}' not found in dept_map, skipping ticket {i+1}")
                continue
            # Randomly make some priorities null
            priority = random.choice([None, 1, 2, 3])
            status_str = random.choice(TICKET_STATUSES)
            status = status_map.get(status_str, 1)  # Default to OPEN if unknown


            # Spread creation times over the past 30 days
            created_at = now - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23))
            # last_updated is at or after created_at
            last_updated = created_at + timedelta(hours=random.randint(0, 72))

            subject = f"Test Ticket {i+1} — {status_str}"
            message = f"This is a seeded test ticket number {i+1}. Status: {status_str}. Department: {dept_name}."
            params = {
                'author': author,
                'assignee': assignee,
                'department': department_id,
                'priority': priority,
                'subject': subject,
                'message': message,
                'status': status,
                'created_at': created_at,
                'last_updated': last_updated,
            }

            conn.execute(INSERT_TICKET_SQL, params)
            inserted_tickets += 1

        print(f"Inserted {inserted_tickets} tickets.")

    print("Seeding complete!")


if __name__ == '__main__':
    main()
