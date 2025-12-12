const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const circleBtn = document.getElementById('circleBtn');
const lineBtn = document.getElementById('lineBtn');
const moveBtn = document.getElementById('moveBtn');
const deleteBtn = document.getElementById('deleteBtn');
const clearBtn = document.getElementById('clearBtn');
const currentModeSpan = document.getElementById('currentMode');
const circleList = document.getElementById('circleList');
const selectedCircleInfo = document.getElementById('selectedCircleInfo');
const dialogueEditor = document.getElementById('dialogueEditor');
const dialogueText = document.getElementById('dialogueText');

// Drawing state - declare before functions that use them
let currentMode = 'circle'; // 'circle', 'line', 'move', or 'delete'
let isDrawing = false;
let startX = 0;
let startY = 0;
let startCircle = null; // Circle where line starts
let selectedCircle = null; // Currently selected circle
let movingCircle = null; // Circle being moved
let circleOffsetX = 0; // Offset from mouse to circle center when starting to move
let circleOffsetY = 0;
let circles = [];
let lines = [];

// Circle class
class Circle {
    constructor(x, y, radius, name) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.name = name;
        this.dialogue = ''; // Dialogue turn text
    }

    draw(isSelected = false) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        // Draw selected state with different color
        if (isSelected) {
            ctx.strokeStyle = '#ff6b6b';
            ctx.lineWidth = 4;
        } else {
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 3;
        }
        ctx.stroke();
        ctx.fillStyle = isSelected ? 'rgba(255, 107, 107, 0.15)' : 'rgba(102, 126, 234, 0.1)';
        ctx.fill();
        
        // Draw name
        if (this.name) {
            ctx.fillStyle = '#333';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.name, this.x, this.y);
        }
    }
}

// Line class
class Line {
    constructor(x1, y1, x2, y2, circle1, circle2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.circle1 = circle1; // Starting circle
        this.circle2 = circle2; // Ending circle
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.strokeStyle = '#764ba2';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}

// Find the nearest circle to a point
function findNearestCircle(x, y, maxDistance = 50) {
    let nearestCircle = null;
    let minDistance = Infinity;
    
    for (const circle of circles) {
        const distance = Math.sqrt(
            Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2)
        );
        // Check if point is within reasonable distance from circle edge
        const distanceFromEdge = Math.abs(distance - circle.radius);
        if (distanceFromEdge < maxDistance && distanceFromEdge < minDistance) {
            minDistance = distanceFromEdge;
            nearestCircle = circle;
        }
    }
    
    return nearestCircle;
}

// Calculate intersection point on circle edge from a point outside
function getCircleEdgePoint(circle, fromX, fromY) {
    const dx = fromX - circle.x;
    const dy = fromY - circle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) return { x: circle.x + circle.radius, y: circle.y };
    
    // Normalize and scale to radius
    const normalizedX = dx / distance;
    const normalizedY = dy / distance;
    
    return {
        x: circle.x + normalizedX * circle.radius,
        y: circle.y + normalizedY * circle.radius
    };
}

// Calculate intersection point between two circles (for line connecting them)
function getCircleToCircleConnection(circle1, circle2) {
    const dx = circle2.x - circle1.x;
    const dy = circle2.y - circle1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) {
        // Circles are at same position
        return {
            x1: circle1.x + circle1.radius,
            y1: circle1.y,
            x2: circle2.x + circle2.radius,
            y2: circle2.y
        };
    }
    
    // Normalize direction vector
    const normalizedX = dx / distance;
    const normalizedY = dy / distance;
    
    // Calculate edge points
    const point1 = {
        x: circle1.x + normalizedX * circle1.radius,
        y: circle1.y + normalizedY * circle1.radius
    };
    
    const point2 = {
        x: circle2.x - normalizedX * circle2.radius,
        y: circle2.y - normalizedY * circle2.radius
    };
    
    return {
        x1: point1.x,
        y1: point1.y,
        x2: point2.x,
        y2: point2.y
    };
}

// Find circle at a point
function findCircleAtPoint(x, y) {
    for (const circle of circles) {
        const distance = Math.sqrt(
            Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2)
        );
        if (distance <= circle.radius) {
            return circle;
        }
    }
    return null;
}

// Update line positions when a circle moves
function updateLinesForCircle(circle) {
    lines.forEach(line => {
        if (line.circle1 === circle || line.circle2 === circle) {
            const connection = getCircleToCircleConnection(line.circle1, line.circle2);
            line.x1 = connection.x1;
            line.y1 = connection.y1;
            line.x2 = connection.x2;
            line.y2 = connection.y2;
        }
    });
}

// Delete a circle and all lines connected to it
function deleteCircle(circle) {
    if (!circle) return;
    
    // Remove all lines connected to this circle
    lines = lines.filter(line => line.circle1 !== circle && line.circle2 !== circle);
    
    // Remove the circle
    const index = circles.indexOf(circle);
    if (index > -1) {
        circles.splice(index, 1);
    }
    
    // Clear selection if this circle was selected
    if (selectedCircle === circle) {
        selectedCircle = null;
        updateDialogueUI();
    }
    
    redraw();
}

// Update dialogue UI
function updateDialogueUI() {
    if (selectedCircle) {
        selectedCircleInfo.innerHTML = `
            <div class="circle-name">${selectedCircle.name || 'Unnamed Circle'}</div>
        `;
        dialogueEditor.style.display = 'flex';
        dialogueText.value = selectedCircle.dialogue || '';
    } else {
        selectedCircleInfo.innerHTML = '<p class="no-selection">Click on a circle to edit its dialogue</p>';
        dialogueEditor.style.display = 'none';
        dialogueText.value = '';
    }
}

// Redraw everything
function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines.forEach(line => line.draw());
    circles.forEach(circle => circle.draw(circle === selectedCircle));
    updateLegend();
}

// Update legend
function updateLegend() {
    circleList.innerHTML = '';
    if (circles.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No circles yet';
        li.className = 'empty';
        circleList.appendChild(li);
    } else {
        circles.forEach((circle, index) => {
            const li = document.createElement('li');
            li.textContent = circle.name || `Circle ${index + 1}`;
            circleList.appendChild(li);
        });
    }
}

// Switch to circle mode
function switchToCircleMode() {
    currentMode = 'circle';
    circleBtn.classList.add('active');
    lineBtn.classList.remove('active');
    moveBtn.classList.remove('active');
    deleteBtn.classList.remove('active');
    currentModeSpan.textContent = 'Add Circle';
}

// Switch to line mode
function switchToLineMode() {
    currentMode = 'line';
    lineBtn.classList.add('active');
    circleBtn.classList.remove('active');
    moveBtn.classList.remove('active');
    deleteBtn.classList.remove('active');
    currentModeSpan.textContent = 'Connect Circles';
}

// Switch to move mode
function switchToMoveMode() {
    currentMode = 'move';
    moveBtn.classList.add('active');
    circleBtn.classList.remove('active');
    lineBtn.classList.remove('active');
    deleteBtn.classList.remove('active');
    currentModeSpan.textContent = 'Move Circle';
}

// Switch to delete mode
function switchToDeleteMode() {
    currentMode = 'delete';
    deleteBtn.classList.add('active');
    circleBtn.classList.remove('active');
    lineBtn.classList.remove('active');
    moveBtn.classList.remove('active');
    currentModeSpan.textContent = 'Delete Circle';
}

// Mode switching
circleBtn.addEventListener('click', switchToCircleMode);
lineBtn.addEventListener('click', switchToLineMode);
moveBtn.addEventListener('click', switchToMoveMode);
deleteBtn.addEventListener('click', () => {
    // If a circle is selected, delete it immediately
    if (selectedCircle) {
        if (confirm(`Delete circle "${selectedCircle.name || 'Unnamed'}"?`)) {
            deleteCircle(selectedCircle);
        }
    } else {
        // Otherwise, enter delete mode
        switchToDeleteMode();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Only trigger if not typing in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        switchToCircleMode();
    } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        switchToLineMode();
    } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        switchToMoveMode();
    }
});

// Clear canvas
clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the canvas?')) {
        circles = [];
        lines = [];
        selectedCircle = null;
        updateDialogueUI();
        redraw();
    }
});

// Mouse events
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (currentMode === 'move') {
        // Find circle at click position
        movingCircle = findCircleAtPoint(x, y);
        if (movingCircle) {
            isDrawing = true;
            // Calculate offset from mouse to circle center
            circleOffsetX = x - movingCircle.x;
            circleOffsetY = y - movingCircle.y;
            // Select the circle being moved
            selectedCircle = movingCircle;
            updateDialogueUI();
        }
    } else if (currentMode === 'line') {
        // Find nearest circle to start the line
        startCircle = findNearestCircle(x, y);
        if (startCircle) {
            isDrawing = true;
            const edgePoint = getCircleEdgePoint(startCircle, x, y);
            startX = edgePoint.x;
            startY = edgePoint.y;
        }
    } else {
        isDrawing = true;
        startX = x;
        startY = y;
    }
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    if (currentMode === 'move' && isDrawing && movingCircle) {
        // Move the circle
        movingCircle.x = currentX - circleOffsetX;
        movingCircle.y = currentY - circleOffsetY;
        // Update lines connected to this circle
        updateLinesForCircle(movingCircle);
        redraw();
    } else if (currentMode === 'line' && isDrawing && startCircle) {
        // Find nearest circle at current position
        const endCircle = findNearestCircle(currentX, currentY);
        
        // Preview while drawing
        redraw();
        
        if (endCircle && endCircle !== startCircle) {
            // Draw preview line connecting the two circles
            const connection = getCircleToCircleConnection(startCircle, endCircle);
            ctx.beginPath();
            ctx.moveTo(connection.x1, connection.y1);
            ctx.lineTo(connection.x2, connection.y2);
            ctx.strokeStyle = '#764ba2';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]); // Dashed line for preview
            ctx.stroke();
            ctx.setLineDash([]);
        } else {
            // Draw line from start circle to mouse position (if no end circle found)
            const edgePoint = getCircleEdgePoint(startCircle, currentX, currentY);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(edgePoint.x, edgePoint.y);
            ctx.strokeStyle = '#764ba2';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    } else if (currentMode === 'circle' && isDrawing) {
        // Preview while drawing circle
        redraw();
        const radius = Math.sqrt(
            Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2)
        );
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = 'rgba(102, 126, 234, 0.1)';
        ctx.fill();
    }
});

let justCreated = false; // Track if we just created something

canvas.addEventListener('mouseup', async (e) => {
    if (!isDrawing) return;
    isDrawing = false;
    justCreated = false;
    
    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    
    if (currentMode === 'move' && movingCircle) {
        // Finish moving the circle
        movingCircle.x = endX - circleOffsetX;
        movingCircle.y = endY - circleOffsetY;
        // Update lines connected to this circle
        updateLinesForCircle(movingCircle);
        movingCircle = null;
        redraw();
    } else if (currentMode === 'line' && startCircle) {
        // Find nearest circle at end position
        const endCircle = findNearestCircle(endX, endY);
        
        if (endCircle && endCircle !== startCircle) {
            // Create line connecting the two circles
            const connection = getCircleToCircleConnection(startCircle, endCircle);
            const line = new Line(
                connection.x1, 
                connection.y1, 
                connection.x2, 
                connection.y2,
                startCircle,
                endCircle
            );
            lines.push(line);
            justCreated = true;
            redraw();
        }
        startCircle = null;
    } else if (currentMode === 'circle') {
        const radius = Math.sqrt(
            Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
        );
        
        if (radius > 5) { // Only create circle if radius is meaningful
            const name = prompt('Enter a name for the circle:');
            const circle = new Circle(startX, startY, radius, name || '');
            circles.push(circle);
            justCreated = true;
            redraw();
        }
    }
});

// Handle circle selection on click (when not drawing)
canvas.addEventListener('click', (e) => {
    // Don't select if we just created something or if we're in the middle of drawing
    if (justCreated || isDrawing) {
        justCreated = false;
        return;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const clickedCircle = findCircleAtPoint(x, y);
    
    if (currentMode === 'delete') {
        // Delete mode: delete the clicked circle
        if (clickedCircle) {
            if (confirm(`Delete circle "${clickedCircle.name || 'Unnamed'}"?`)) {
                deleteCircle(clickedCircle);
            }
        }
    } else if (currentMode === 'circle' || currentMode === 'line') {
        // Only allow selection when not actively drawing (move mode handles selection in mousedown)
        if (clickedCircle) {
            selectedCircle = clickedCircle;
            updateDialogueUI();
            redraw();
        } else {
            // Deselect if clicking on empty space
            selectedCircle = null;
            updateDialogueUI();
            redraw();
        }
    }
});

canvas.addEventListener('mouseleave', () => {
    if (isDrawing) {
        isDrawing = false;
        startCircle = null;
        movingCircle = null;
        redraw();
    }
});

// Set canvas size
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    redraw();
}

// Dialogue text change handler
dialogueText.addEventListener('input', (e) => {
    if (selectedCircle) {
        selectedCircle.dialogue = e.target.value;
    }
});

// Initialize
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
updateLegend();
updateDialogueUI();
