"use strict";
const ctx = getSelectionCanvas();
function tilesetSelect() {
    tilesetCanvas.width = tilesetImage.width * scale;
    tilesetCanvas.height = tilesetImage.height * scale;
    // Disable anti-aliasing
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, tilesetCanvas.width, tilesetCanvas.height);
    ctx.drawImage(tilesetImage, 0, 0, tilesetImage.width, tilesetImage.height, 0, 0, tilesetCanvas.width, tilesetCanvas.height);
}
// Add event listeners for mouse drag
let isDragging = false;
let startX = 0;
let startY = 0;
let endX = pixelUnit;
let endY = pixelUnit;
function initStart(event) {
    startX =
        Math.floor(event.offsetX / (pixelUnit * scale)) * (pixelUnit * scale);
    startY =
        Math.floor(event.offsetY / (pixelUnit * scale)) * (pixelUnit * scale);
}
function initEnd(event) {
    endX = Math.floor(event.offsetX / (pixelUnit * scale)) * (pixelUnit * scale);
    endY = Math.floor(event.offsetY / (pixelUnit * scale)) * (pixelUnit * scale);
    drawSelectionRect(ctx, startX, startY, endX, endY);
}
let regClick = true;
function getPosition(event) {
    const tileX = Math.floor(endX / (pixelUnit * scale));
    const tileY = Math.floor(endY / (pixelUnit * scale));
    return [tileX, tileY];
}
// Draw a selection rectangle between two points
function drawSelectionRect(ctx, startX, startY, endX, endY) {
    ctx.clearRect(0, 0, tilesetCanvas.width, tilesetCanvas.height);
    ctx.drawImage(tilesetImage, 0, 0, tilesetImage.width, tilesetImage.height, 0, 0, tilesetCanvas.width, tilesetCanvas.height);
    ctx.strokeStyle = "cyan";
    ctx.lineWidth = 2;
    let x = endX - startX;
    let y = endY - startY;
    if (x < pixelUnit * scale || y < pixelUnit * scale) {
        x = pixelUnit * scale;
        y = pixelUnit * scale;
        // console.log(`x: ${x} y: ${y}`);
    }
    ctx.strokeRect(startX, startY, x, y);
    // console.log(startX, startY, x, y);
}
tilesetCanvas.addEventListener("click", (event) => {
    if (!isDragging) {
        event.preventDefault();
        // Execute click event callback code
        initEnd(event);
        const { x: tileX, y: tileY } = getPosition(event);
        selection = getPosition(event);
        // console.log(getPosition(event));
    }
});
tilesetCanvas.addEventListener("mousedown", (event) => {
    if (!isDragging) {
        event.preventDefault();
        // Execute click event callback code
        initStart(event);
    }
    regClick = true;
    isDragging = true;
});
selectionCanvas.addEventListener("mousemove", (event) => {
    if (isDragging) {
        regClick = false;
        initEnd(event);
        // const { x: tileX, y: tileY } = getPosition(event);
        // console.log(`left tile: (${tileX}, ${tileY})`);
    }
});
window.addEventListener("mouseup", () => {
    if (isDragging) {
        isDragging = false;
        regClick = false;
    }
});
