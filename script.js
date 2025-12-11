const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const circleBtn = document.getElementById('circleBtn');
const lineBtn = document.getElementById('lineBtn');
const clearBtn = document.getElementById('clearBtn');
const currentModeSpan = document.getElementById('currentMode');
const circleList = document.getElementById('circleList');

// Drawing state - declare before functions that use them
let currentMode = 'circle'; // 'circle' or 'line'
let isDrawing = false;
let startX = 0;
let startY = 0;
let startCircle = null; // Circle where line starts
let circles = [];
let lines = [];

// Circle class
class Circle {
    constructor(x, y, radius, name) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.name = name;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = 'rgba(102, 126, 234, 0.1)';
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

// Redraw everything
function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines.forEach(line => line.draw());
    circles.forEach(circle => circle.draw());
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
    currentModeSpan.textContent = 'Add Circle';
}

// Switch to line mode
function switchToLineMode() {
    currentMode = 'line';
    lineBtn.classList.add('active');
    circleBtn.classList.remove('active');
    currentModeSpan.textContent = 'Connect Circles';
}

// Mode switching
circleBtn.addEventListener('click', switchToCircleMode);
lineBtn.addEventListener('click', switchToLineMode);

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
    }
});

// Clear canvas
clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the canvas?')) {
        circles = [];
        lines = [];
        redraw();
    }
});

// Mouse events
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (currentMode === 'line') {
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
    
    if (currentMode === 'line' && isDrawing && startCircle) {
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

canvas.addEventListener('mouseup', async (e) => {
    if (!isDrawing) return;
    isDrawing = false;
    
    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    
    if (currentMode === 'line' && startCircle) {
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
            redraw();
        }
    }
});

canvas.addEventListener('mouseleave', () => {
    if (isDrawing) {
        isDrawing = false;
        startCircle = null;
        redraw();
    }
});

// Set canvas size
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    redraw();
}

// Initialize
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
updateLegend();
