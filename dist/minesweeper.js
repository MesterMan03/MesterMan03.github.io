const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const PixelSize = 20;
function drawGrid() {
    ctx.fillStyle = "#888888";
    for (let i = PixelSize; i < canvas.width; i += PixelSize) {
        ctx.fillRect(i, 0, 1, canvas.height);
    }
    for (let i = PixelSize; i < canvas.height; i += PixelSize) {
        ctx.fillRect(0, i, canvas.width, 1);
    }
}
function drawOneFrame() {
    ctx.fillStyle = "#666";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    window.requestAnimationFrame(drawOneFrame);
}
function handleMouseDownEvent(event) {
    if (event.x > canvas.width || event.y > canvas.height)
        return;
    const pieceX = Math.floor(event.x / PixelSize);
    const pieceY = Math.floor(event.y / PixelSize);
    console.log(event.x, event.y, pieceX, pieceY);
}
function main() {
    canvas.addEventListener("mousedown", handleMouseDownEvent);
    window.requestAnimationFrame(drawOneFrame);
}
main();
export {};
