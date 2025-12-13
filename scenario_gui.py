#!/usr/bin/env python3
"""
GUI application for entering scenarios into the database.
"""

import sqlite3
import tkinter as tk
from tkinter import ttk, messagebox
from datetime import datetime
import os
import webbrowser

DB_FILE = 'database.db'
CONFIG_FILE = 'config.txt'

class ScenarioGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Scenario Database Manager")
        self.root.geometry("800x600")
        self.root.configure(bg='#f5f5f5')
        
        # Style configuration
        style = ttk.Style()
        style.theme_use('clam')
        
        # Load config data
        self.config_data = self.load_config()
        
        # Main container
        main_frame = tk.Frame(root, bg='#f5f5f5', padx=20, pady=20)
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Config info frame at the top
        config_frame = tk.Frame(main_frame, bg='#e3f2fd', relief=tk.RAISED, bd=2)
        config_frame.pack(fill=tk.X, pady=(0, 20))
        
        # Organization name
        orgname_label = tk.Label(
            config_frame,
            text="Organization:",
            font=('Arial', 10, 'bold'),
            bg='#e3f2fd',
            fg='#333',
            anchor='w'
        )
        orgname_label.pack(side=tk.LEFT, padx=10, pady=8)
        
        self.orgname_value = tk.Label(
            config_frame,
            text=self.config_data.get('orgname', 'N/A'),
            font=('Arial', 10),
            bg='#e3f2fd',
            fg='#1976d2',
            anchor='w'
        )
        self.orgname_value.pack(side=tk.LEFT, padx=(0, 20), pady=8)
        
        # Address
        address_label = tk.Label(
            config_frame,
            text="Address:",
            font=('Arial', 10, 'bold'),
            bg='#e3f2fd',
            fg='#333',
            anchor='w'
        )
        address_label.pack(side=tk.LEFT, padx=10, pady=8)
        
        self.address_value = tk.Label(
            config_frame,
            text=self.config_data.get('address', 'N/A'),
            font=('Arial', 10),
            bg='#e3f2fd',
            fg='#1976d2',
            anchor='w'
        )
        self.address_value.pack(side=tk.LEFT, padx=(0, 10), pady=8)
        
        # Title
        title_label = tk.Label(
            main_frame, 
            text="Scenario Entry Form", 
            font=('Arial', 20, 'bold'),
            bg='#f5f5f5',
            fg='#333'
        )
        title_label.pack(pady=(0, 20))
        
        # Form frame
        form_frame = tk.LabelFrame(
            main_frame,
            text="Enter New Scenario",
            font=('Arial', 12, 'bold'),
            bg='#f5f5f5',
            fg='#333',
            padx=15,
            pady=15
        )
        form_frame.pack(fill=tk.BOTH, expand=True, pady=(0, 20))
        
        # Scenario field
        scenario_label = tk.Label(
            form_frame,
            text="Scenario:",
            font=('Arial', 10),
            bg='#f5f5f5',
            anchor='w'
        )
        scenario_label.grid(row=0, column=0, sticky='w', pady=10, padx=10)
        
        self.scenario_entry = tk.Entry(
            form_frame,
            font=('Arial', 10),
            width=40
        )
        self.scenario_entry.grid(row=0, column=1, pady=10, padx=10, sticky='ew')
        self.scenario_entry.focus()
        
        # Description field
        description_label = tk.Label(
            form_frame,
            text="Description:",
            font=('Arial', 10),
            bg='#f5f5f5',
            anchor='w'
        )
        description_label.grid(row=1, column=0, sticky='w', pady=10, padx=10)
        
        self.description_entry = tk.Entry(
            form_frame,
            font=('Arial', 10),
            width=40
        )
        self.description_entry.grid(row=1, column=1, pady=10, padx=10, sticky='ew')
        
        # Owner field
        owner_label = tk.Label(
            form_frame,
            text="Owner:",
            font=('Arial', 10),
            bg='#f5f5f5',
            anchor='w'
        )
        owner_label.grid(row=2, column=0, sticky='w', pady=10, padx=10)
        
        self.owner_entry = tk.Entry(
            form_frame,
            font=('Arial', 10),
            width=40
        )
        self.owner_entry.grid(row=2, column=1, pady=10, padx=10, sticky='ew')
        
        # Configure grid weights
        form_frame.grid_columnconfigure(1, weight=1)
        
        # Buttons frame
        button_frame = tk.Frame(form_frame, bg='#f5f5f5')
        button_frame.grid(row=3, column=0, columnspan=2, pady=20)
        
        # Save button
        save_btn = tk.Button(
            button_frame,
            text="Save Scenario",
            font=('Arial', 11, 'bold'),
            bg='#4CAF50',
            fg='black',
            padx=20,
            pady=10,
            cursor='hand2',
            command=self.save_scenario,
            relief=tk.FLAT
        )
        save_btn.pack(side=tk.LEFT, padx=5)
        
        # Clear button
        clear_btn = tk.Button(
            button_frame,
            text="Clear Form",
            font=('Arial', 11),
            bg='#ff9800',
            fg='black',
            padx=20,
            pady=10,
            cursor='hand2',
            command=self.clear_form,
            relief=tk.FLAT
        )
        clear_btn.pack(side=tk.LEFT, padx=5)
        
        # Refresh button
        refresh_btn = tk.Button(
            button_frame,
            text="Refresh List",
            font=('Arial', 11),
            bg='#2196F3',
            fg='black',
            padx=20,
            pady=10,
            cursor='hand2',
            command=self.load_scenarios,
            relief=tk.FLAT
        )
        refresh_btn.pack(side=tk.LEFT, padx=5)
        
        # Open HTML button
        open_html_btn = tk.Button(
            button_frame,
            text="Open Drawing App",
            font=('Arial', 11),
            bg='#9C27B0',
            fg='black',
            padx=20,
            pady=10,
            cursor='hand2',
            command=self.open_index_html,
            relief=tk.FLAT
        )
        open_html_btn.pack(side=tk.LEFT, padx=5)
        
        # Scenarios list frame
        list_frame = tk.LabelFrame(
            main_frame,
            text="Existing Scenarios",
            font=('Arial', 12, 'bold'),
            bg='#f5f5f5',
            fg='#333',
            padx=15,
            pady=15
        )
        list_frame.pack(fill=tk.BOTH, expand=True)
        
        # Treeview for displaying scenarios
        columns = ('ID', 'Scenario', 'Description', 'Owner', 'Created At')
        self.tree = ttk.Treeview(
            list_frame,
            columns=columns,
            show='headings',
            height=10
        )
        
        # Configure column headings
        self.tree.heading('ID', text='ID')
        self.tree.heading('Scenario', text='Scenario')
        self.tree.heading('Description', text='Description')
        self.tree.heading('Owner', text='Owner')
        self.tree.heading('Created At', text='Created At')
        
        # Configure column widths
        self.tree.column('ID', width=50, anchor='center')
        self.tree.column('Scenario', width=200, anchor='w')  # Increased for VARCHAR(50)
        self.tree.column('Description', width=300, anchor='w')  # Increased for VARCHAR(100)
        self.tree.column('Owner', width=100, anchor='w')
        self.tree.column('Created At', width=180, anchor='w')
        
        # Scrollbar
        scrollbar = ttk.Scrollbar(list_frame, orient=tk.VERTICAL, command=self.tree.yview)
        self.tree.configure(yscrollcommand=scrollbar.set)
        
        # Pack treeview and scrollbar
        self.tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Status label
        self.status_label = tk.Label(
            main_frame,
            text="Ready",
            font=('Arial', 9),
            bg='#f5f5f5',
            fg='#666',
            anchor='w'
        )
        self.status_label.pack(fill=tk.X, pady=(10, 0))
        
        # Load existing scenarios
        self.load_scenarios()
        
        # Bind Enter key to save
        self.root.bind('<Return>', lambda e: self.save_scenario())
    
    def load_config(self):
        """Load configuration from config.txt file."""
        config = {}
        if not os.path.exists(CONFIG_FILE):
            return config
        
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line and ';' in line:
                        parts = line.split(';', 1)  # Split only on first semicolon
                        if len(parts) == 2:
                            key = parts[0].strip()
                            value = parts[1].strip()
                            config[key] = value
        except Exception as e:
            messagebox.showwarning("Config Error", f"Error reading config file: {e}")
        
        return config
        
    def get_db_connection(self):
        """Get database connection."""
        try:
            conn = sqlite3.connect(DB_FILE)
            return conn
        except sqlite3.Error as e:
            messagebox.showerror("Database Error", f"Error connecting to database: {e}")
            return None
    
    def save_scenario(self):
        """Save scenario to database."""
        scenario = self.scenario_entry.get().strip()
        description = self.description_entry.get().strip()
        owner = self.owner_entry.get().strip()
        
        # Validate required fields
        if not scenario:
            messagebox.showwarning("Validation Error", "Scenario field is required!")
            self.scenario_entry.focus()
            return
        
        if not description:
            messagebox.showwarning("Validation Error", "Description field is required!")
            self.description_entry.focus()
            return
        
        # Validate length (VARCHAR(50) for scenario, VARCHAR(100) for description)
        if len(scenario) > 50:
            messagebox.showwarning("Validation Error", "Scenario must be 50 characters or less!")
            self.scenario_entry.focus()
            return
        
        if len(description) > 100:
            messagebox.showwarning("Validation Error", "Description must be 100 characters or less!")
            self.description_entry.focus()
            return
        
        if owner and len(owner) > 30:
            messagebox.showwarning("Validation Error", "Owner must be 30 characters or less!")
            self.owner_entry.focus()
            return
        
        # Save to database
        conn = self.get_db_connection()
        if not conn:
            return
        
        try:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO scenarios (scenario, description, owner) VALUES (?, ?, ?)",
                (scenario, description, owner if owner else None)
            )
            conn.commit()
            
            # Show success message
            messagebox.showinfo("Success", f"Scenario '{scenario}' saved successfully!")
            self.status_label.config(text=f"Scenario '{scenario}' saved at {datetime.now().strftime('%H:%M:%S')}")
            
            # Clear form and reload list
            self.clear_form()
            self.load_scenarios()
            
        except sqlite3.Error as e:
            messagebox.showerror("Database Error", f"Error saving scenario: {e}")
            self.status_label.config(text="Error saving scenario")
        finally:
            conn.close()
    
    def clear_form(self):
        """Clear all form fields."""
        self.scenario_entry.delete(0, tk.END)
        self.description_entry.delete(0, tk.END)
        self.owner_entry.delete(0, tk.END)
        self.scenario_entry.focus()
        self.status_label.config(text="Form cleared")
    
    def open_index_html(self):
        """Open index.html in the default web browser."""
        html_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'index.html')
        
        if not os.path.exists(html_file):
            messagebox.showerror("File Not Found", f"Could not find index.html at:\n{html_file}")
            self.status_label.config(text="Error: index.html not found")
            return
        
        try:
            # Convert to file:// URL format
            file_url = f"file://{os.path.abspath(html_file)}"
            webbrowser.open(file_url)
            self.status_label.config(text="Opened index.html in browser")
        except Exception as e:
            messagebox.showerror("Error", f"Could not open index.html:\n{e}")
            self.status_label.config(text="Error opening index.html")
    
    def load_scenarios(self):
        """Load scenarios from database and display in treeview."""
        # Clear existing items
        for item in self.tree.get_children():
            self.tree.delete(item)
        
        conn = self.get_db_connection()
        if not conn:
            return
        
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT id, scenario, description, owner, created_at FROM scenarios ORDER BY id DESC")
            rows = cursor.fetchall()
            
            for row in rows:
                # Format created_at for display
                created_at = row[4] if row[4] else 'N/A'
                if created_at != 'N/A':
                    try:
                        # Parse and format datetime
                        dt = datetime.fromisoformat(created_at.replace(' ', 'T'))
                        created_at = dt.strftime('%Y-%m-%d %H:%M:%S')
                    except:
                        pass
                
                self.tree.insert('', 'end', values=(
                    row[0],  # id
                    row[1] or '',  # scenario
                    row[2] or '',  # description
                    row[3] or 'N/A',  # owner
                    created_at  # created_at
                ))
            
            self.status_label.config(text=f"Loaded {len(rows)} scenario(s)")
            
        except sqlite3.Error as e:
            messagebox.showerror("Database Error", f"Error loading scenarios: {e}")
            self.status_label.config(text="Error loading scenarios")
        finally:
            conn.close()

def main():
    root = tk.Tk()
    app = ScenarioGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()

