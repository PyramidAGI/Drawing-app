# Drawing App - Dialogue Flow Diagram

A modern, interactive drawing application built with HTML5 Canvas for creating dialogue flow diagrams. Each circle represents a dialogue turn, and you can connect them with lines to visualize conversation flow.

## Features

- **Dialogue Turn Circles**: Create circles representing dialogue turns by clicking and dragging on the canvas. Each circle can be given a custom name.
- **Dialogue Text Editor**: Edit dialogue text for each circle in a dedicated textbox panel on the right side of the canvas.
- **Line Drawing**: Connect circles with lines that automatically snap to circle edges and stop at their borders, showing the flow of dialogue.
- **Move Circles**: Click and drag circles to reposition them. Connected lines automatically update to maintain connections.
- **Visual Feedback**: Real-time preview while drawing with dashed lines. Selected circles are highlighted in red.
- **Circle Legend**: View all circle names in a legend below the canvas.
- **Keyboard Shortcuts**: Quick mode switching with keyboard shortcuts for efficient workflow.
- **Modern UI**: Beautiful gradient design with smooth animations and intuitive layout.

## How to Use

### Getting Started

1. Open `index.html` in your web browser.
2. The interface consists of:
   - **Toolbar**: Mode selection buttons at the top
   - **Canvas**: Main drawing area on the left
   - **Dialogue Panel**: Text editor on the right for editing dialogue turns
   - **Legend**: Circle names displayed below the canvas
3. Start creating your dialogue flow diagram!

### Creating Dialogue Turns (Circles)

1. Click the **"Add Circle"** button or press **'C'** to enter circle mode.
2. Click and drag on the canvas to create a circle representing a dialogue turn.
3. When you release the mouse, you'll be prompted to enter a name for the circle.
4. The circle will appear with its name displayed in the center.

### Editing Dialogue Text

1. Click on any circle to select it (it will be highlighted in red).
2. The dialogue editor panel on the right will show the selected circle's name.
3. Enter or edit the dialogue text in the textarea.
4. The text is automatically saved as you type.

### Connecting Dialogue Turns (Lines)

1. Click the **"Add Line"** button or press **'L'** to enter line mode.
2. Click near a circle to start the line (it will snap to the nearest circle).
3. Drag to another circle and release near it.
4. The line will automatically connect the two circles at their edges, showing the flow between dialogue turns.

### Moving Circles

1. Click the **"Move Circle"** button or press **'M'** to enter move mode.
2. Click and drag any circle to reposition it.
3. All lines connected to the moved circle will automatically update to maintain their connections.
4. The circle remains selected (highlighted) while moving.

### Keyboard Shortcuts

- **C** - Switch to Circle mode (Add Circle)
- **L** - Switch to Line mode (Connect Circles)
- **M** - Switch to Move mode (Move Circle)

### Clearing the Canvas

Click the **"Clear Canvas"** button to remove all circles and lines from the canvas.

## File Structure

```
Drawing app/
├── index.html      # Main HTML file
├── style.css       # Stylesheet with modern UI design
├── script.js       # JavaScript logic for drawing functionality
└── README.md       # This file
```

## Technologies Used

- **HTML5 Canvas** - For rendering graphics
- **Vanilla JavaScript** - For application logic
- **CSS3** - For styling and animations

## Technical Details

### Circle Class
- Stores circle position (x, y), radius, name, and dialogue text
- Renders circles with a semi-transparent fill and name label
- Supports selection state with visual highlighting (red border when selected)

### Line Class
- Connects two circles at their edge points
- Lines automatically calculate intersection points with circle borders
- Lines dynamically update when connected circles are moved

### Features
- **Smart Circle Detection**: Finds the nearest circle within a reasonable distance
- **Edge Calculation**: Calculates exact edge points on circles for line connections
- **Dynamic Line Updates**: Lines automatically recalculate when circles are moved
- **Circle Selection**: Click on circles to select and edit their dialogue text
- **Responsive Canvas**: Automatically adjusts to window size changes

## Browser Compatibility

This app works in all modern browsers that support HTML5 Canvas:
- Chrome
- Firefox
- Safari
- Edge

## Future Enhancements

Potential features that could be added:
- Save/load dialogue diagrams
- Undo/redo functionality
- Different line styles and colors
- Circle resizing
- Export as image
- Delete individual circles or lines
- Copy/paste circles
- Zoom and pan functionality

## License

This project is open source and available for personal and educational use.

