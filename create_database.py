#!/usr/bin/env python3
"""
Script to create SQLite database from table design.
"""

import sqlite3
import os

# Database file name
DB_FILE = 'database.db'

# Read the table design
def read_table_design():
    with open('tabledesign.txt', 'r') as f:
        return f.read()

# Create database and table
def create_database():
    # Remove existing database if it exists
    if os.path.exists(DB_FILE):
        os.remove(DB_FILE)
        print(f"Removed existing {DB_FILE}")
    
    # Connect to database (creates it if it doesn't exist)
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Create table based on the design
    # The design file has a syntax error (missing table name), so we'll fix it
    create_table_sql = """
    CREATE TABLE scenarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scenario VARCHAR(50) NOT NULL,
        description VARCHAR(100) NOT NULL,
        owner VARCHAR(30),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """
    
    try:
        cursor.execute(create_table_sql)
        conn.commit()
        print(f"Successfully created database '{DB_FILE}' with table 'scenarios'")
        
        # Verify the table was created
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='scenarios'")
        if cursor.fetchone():
            print("Table 'scenarios' verified successfully")
            
            # Show table structure
            cursor.execute("PRAGMA table_info(scenarios)")
            columns = cursor.fetchall()
            print("\nTable structure:")
            print("-" * 60)
            for col in columns:
                print(f"  {col[1]:<15} {col[2]:<15} {'NOT NULL' if col[3] else 'NULL':<10} {col[4] if col[4] else ''}")
            print("-" * 60)
    except sqlite3.Error as e:
        print(f"Error creating database: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    create_database()

