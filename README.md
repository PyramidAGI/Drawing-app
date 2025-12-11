# Drawing App

A modern, interactive drawing application built with HTML5 Canvas that allows you to create circles and connect them with lines.

## Features

- **Circle Drawing**: Create circles by clicking and dragging on the canvas. Each circle can be given a custom name.
- **Line Drawing**: Connect circles with lines that automatically snap to circle edges and stop at their borders.
- **Visual Feedback**: Real-time preview while drawing with dashed lines.
- **Circle Legend**: View all circle names in a legend below the canvas.
- **Keyboard Shortcuts**: Quick mode switching with keyboard shortcuts.
- **Modern UI**: Beautiful gradient design with smooth animations.

## How to Use

### Getting Started

1. Open `index.html` in your web browser.
2. Start drawing!

### Drawing Circles

1. Click the **"Add Circle"** button or press **'C'** to enter circle mode.
2. Click and drag on the canvas to create a circle.
3. When you release the mouse, you'll be prompted to enter a name for the circle.
4. The circle will appear with its name displayed in the center.

### Drawing Lines

1. Click the **"Add Line"** button or press **'L'** to enter line mode.
2. Click near a circle to start the line (it will snap to the nearest circle).
3. Drag to another circle and release near it.
4. The line will automatically connect the two circles at their edges.

### Keyboard Shortcuts

- **C** - Switch to Circle mode
- **L** - Switch to Line mode

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
- Stores circle position (x, y), radius, and name
- Renders circles with a semi-transparent fill and name label

### Line Class
- Connects two circles at their edge points
- Lines automatically calculate intersection points with circle borders

### Features
- **Smart Circle Detection**: Finds the nearest circle within a reasonable distance
- **Edge Calculation**: Calculates exact edge points on circles for line connections
- **Responsive Canvas**: Automatically adjusts to window size changes

## Browser Compatibility

This app works in all modern browsers that support HTML5 Canvas:
- Chrome
- Firefox
- Safari
- Edge

## Future Enhancements

Potential features that could be added:
- Save/load drawings
- Undo/redo functionality
- Different line styles and colors
- Circle resizing and moving
- Export as image

## License

This project is open source and available for personal and educational use.

