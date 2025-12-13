# LStudio - Dialogue Flow Diagram & Scenario Management

A comprehensive application suite for creating dialogue flow diagrams and managing scenarios in a database. The project consists of a web-based drawing application and a Python GUI for scenario database management.

## Project Components

### 1. Drawing App (Web Application)
A modern, interactive drawing application built with HTML5 Canvas for creating dialogue flow diagrams. Each circle represents a dialogue turn, and you can connect them with lines to visualize conversation flow.

### 2. Scenario Database Management (Python GUI)
A desktop application for managing scenarios in an SQLite database, with integration to display organization information from configuration files.

## Features

### Drawing App Features
- **Dialogue Turn Circles**: Create circles representing dialogue turns by clicking and dragging on the canvas. Each circle can be given a custom name.
- **Dialogue Text Editor**: Edit dialogue text for each circle in a dedicated textbox panel on the right side of the canvas.
- **Line Drawing**: Connect circles with lines that automatically snap to circle edges and stop at their borders, showing the flow of dialogue.
- **Move Circles**: Click and drag circles to reposition them. Connected lines automatically update to maintain connections.
- **Visual Feedback**: Real-time preview while drawing with dashed lines. Selected circles are highlighted in red.
- **Circle Legend**: View all circle names in a legend below the canvas.
- **Save/Load**: Save your diagrams as JSON files and load them later.
- **Keyboard Shortcuts**: Quick mode switching with keyboard shortcuts for efficient workflow.
- **Modern UI**: Beautiful gradient design with smooth animations and intuitive layout.

### Scenario Database Features
- **Scenario Entry Form**: Enter scenarios with description and owner information
- **Database Integration**: SQLite database with automatic timestamp tracking
- **Organization Display**: Shows organization name and address from config file at the top of the form
- **Scenario List**: View all existing scenarios in a sortable table
- **Data Validation**: Enforces field length limits and required fields
- **Quick Access**: Button to open the drawing app directly from the GUI

## File Structure

```
LStudio/
├── index.html              # Main HTML file for drawing app
├── style.css               # Stylesheet with modern UI design
├── script.js               # JavaScript logic for drawing functionality
├── scenario_gui.py         # Python GUI for scenario database management
├── create_database.py      # Script to create the SQLite database
├── database.db             # SQLite database file (created by create_database.py)
├── config.txt              # Configuration file (semicolon-separated) with org info
├── tabledesign.txt         # Database table design specification
└── README.md               # This file
```

## Installation & Setup

### Prerequisites
- Python 3.x
- Modern web browser (Chrome, Firefox, Safari, Edge)
- tkinter (usually included with Python)

### Database Setup

1. Create the database by running:
   ```bash
   python3 create_database.py
   ```

   This creates `database.db` with a `scenarios` table containing:
   - `id` - INTEGER PRIMARY KEY AUTOINCREMENT
   - `scenario` - VARCHAR(50) NOT NULL
   - `description` - VARCHAR(100) NOT NULL
   - `owner` - VARCHAR(30)
   - `created_at` - DATETIME DEFAULT CURRENT_TIMESTAMP

### Configuration File

The `config.txt` file should contain semicolon-separated key-value pairs:
```
orgname;Your Organization Name
address;Your Organization Address
```

The GUI reads this file and displays the organization name and address at the top of the form.

## Usage

### Using the Drawing App

1. **Open the Drawing App**:
   - Option 1: Open `index.html` directly in your web browser
   - Option 2: Use the "Open Drawing App" button in the Scenario GUI

2. **Creating Dialogue Turns (Circles)**:
   - Click the **"Add Circle"** button or press **'C'** to enter circle mode
   - Click and drag on the canvas to create a circle
   - When you release, enter a name for the circle

3. **Editing Dialogue Text**:
   - Click on any circle to select it (highlighted in red)
   - Enter or edit dialogue text in the textarea on the right panel

4. **Connecting Dialogue Turns (Lines)**:
   - Click the **"Add Line"** button or press **'L'** to enter line mode
   - Click near a circle, then drag to another circle
   - Lines automatically connect at circle edges

5. **Moving Circles**:
   - Click the **"Move Circle"** button or press **'M'** to enter move mode
   - Click and drag any circle to reposition it
   - Connected lines automatically update

6. **Saving/Loading**:
   - Click **"Save"** to download your diagram as a JSON file
   - Click **"Load"** to load a previously saved diagram

### Using the Scenario Database GUI

1. **Start the GUI**:
   ```bash
   python3 scenario_gui.py
   ```

2. **Enter a Scenario**:
   - Fill in the **Scenario** field (required, max 50 characters)
   - Fill in the **Description** field (required, max 100 characters)
   - Optionally fill in the **Owner** field (max 30 characters)
   - Click **"Save Scenario"** or press Enter

3. **View Scenarios**:
   - All saved scenarios appear in the table below the form
   - Click **"Refresh List"** to reload scenarios from the database

4. **Open Drawing App**:
   - Click the **"Open Drawing App"** button to launch the web application

5. **Clear Form**:
   - Click **"Clear Form"** to reset all input fields

## Keyboard Shortcuts (Drawing App)

- **C** - Switch to Circle mode (Add Circle)
- **L** - Switch to Line mode (Connect Circles)
- **M** - Switch to Move mode (Move Circle)
- **Enter** - Save scenario (in Scenario GUI)

## Technologies Used

### Drawing App
- **HTML5 Canvas** - For rendering graphics
- **Vanilla JavaScript** - For application logic
- **CSS3** - For styling and animations

### Scenario Database
- **Python 3** - Programming language
- **tkinter** - GUI framework
- **SQLite3** - Database engine
- **webbrowser** - For opening HTML files

## Database Schema

The `scenarios` table structure:
```sql
CREATE TABLE scenarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scenario VARCHAR(50) NOT NULL,
    description VARCHAR(100) NOT NULL,
    owner VARCHAR(30),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## Configuration

The `config.txt` file uses semicolon-separated format:
```
fieldname;value
```

The GUI automatically reads and displays:
- `orgname` - Organization name
- `address` - Organization address

## Browser Compatibility

The drawing app works in all modern browsers that support HTML5 Canvas:
- Chrome
- Firefox
- Safari
- Edge

## Technical Details

### Drawing App Components

**Circle Class**:
- Stores circle position (x, y), radius, name, and dialogue text
- Renders circles with a semi-transparent fill and name label
- Supports selection state with visual highlighting (red border when selected)

**Line Class**:
- Connects two circles at their edge points
- Lines automatically calculate intersection points with circle borders
- Lines dynamically update when connected circles are moved

**Features**:
- Smart Circle Detection: Finds the nearest circle within a reasonable distance
- Edge Calculation: Calculates exact edge points on circles for line connections
- Dynamic Line Updates: Lines automatically recalculate when circles are moved
- Circle Selection: Click on circles to select and edit their dialogue text
- Responsive Canvas: Automatically adjusts to window size changes

### Scenario GUI Components

**Database Operations**:
- Automatic connection management
- Transaction handling
- Error handling with user-friendly messages

**Form Validation**:
- Required field checking
- Field length validation matching database constraints
- Real-time status updates

**Config Integration**:
- Reads semicolon-separated config file
- Displays organization information prominently
- Graceful error handling for missing config

## Future Enhancements

Potential features that could be added:
- Export diagrams as images
- Undo/redo functionality in drawing app
- Different line styles and colors
- Circle resizing
- Delete individual circles or lines
- Copy/paste circles
- Zoom and pan functionality
- Search and filter scenarios in database
- Export scenarios to CSV/Excel
- Scenario editing and deletion
- Database backup/restore functionality

## License

This project is open source and available for personal and educational use.
