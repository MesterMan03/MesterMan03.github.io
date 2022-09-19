var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const infoField = document.getElementById("info");
const canvas = document.getElementById("canvas");
const ctx = canvas === null || canvas === void 0 ? void 0 : canvas.getContext("2d");
let frameCount = 0, fps = 0, fpsInterval = 1000 / 15, startTime, then;
let lastRenderTime, fpsToShow, lastFpsUpdate = 0;
let ready = false;
let playing = false;
let playerStateSaveInterval;
const PixelSize = 10;
const HorizPixels = 60;
const VerticPixels = 38;
let applePos = [0, 0];
const Direction = {
    Up: [0, -1],
    Right: [1, 0],
    Down: [0, 1],
    Left: [-1, 0]
};
let playerState = {
    pieces: [],
    died: false,
    direction: Direction.Left,
    nextDirection: Direction.Left,
    score: 0
};
function spawnApple() {
    const emptySpaces = getEmptySpaces();
    const selectedPos = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
    applePos[0] = selectedPos[0];
    applePos[1] = selectedPos[1];
}
function getEmptySpaces() {
    let emptySpaces = [];
    for (let x = 0; x < HorizPixels - 1; x++) {
        for (let y = 0; y < VerticPixels - 1; y++) {
            if (!playerState.pieces.find((piece) => piece.pos[0] === x && piece.pos[1] === y))
                emptySpaces.push([x, y]);
        }
    }
    return emptySpaces;
}
function spawnNewPiece() {
    const lastPiece = playerState.pieces[playerState.pieces.length - 1];
    playerState.pieces.push({
        pos: [lastPiece.pos[0], lastPiece.pos[1]],
        new: true
    });
}
function drawOneFrame() {
    var _a;
    if (playerState.died)
        return;
    if (playing)
        window.requestAnimationFrame(drawOneFrame);
    const now = performance.now();
    const elapsed = now - then;
    if (elapsed <= fpsInterval && playing)
        return;
    then = now;
    playerState.direction = playerState.nextDirection;
    for (let i = playerState.pieces.length - 1; i >= 0; i--) {
        const piece = playerState.pieces[i];
        if (i === 0) {
            piece.pos[0] += playerState.direction[0];
            piece.pos[1] += playerState.direction[1];
            if (piece.pos[0] < 0)
                piece.pos[0] = HorizPixels - 1;
            if (piece.pos[0] > HorizPixels - 1)
                piece.pos[0] = 0;
            if (piece.pos[1] < 0)
                piece.pos[1] = VerticPixels - 1;
            if (piece.pos[1] > VerticPixels - 1)
                piece.pos[1] = 0;
        }
        else if (!piece.new) {
            piece.pos[0] = playerState.pieces[i - 1].pos[0];
            piece.pos[1] = playerState.pieces[i - 1].pos[1];
        }
        if (piece.new)
            piece.new = false;
    }
    if (playerState.pieces[0].pos[0] === applePos[0] && playerState.pieces[0].pos[1] === applePos[1]) {
        playerState.score += 1;
        spawnApple();
        spawnNewPiece();
    }
    if (playerState.pieces.slice(1).find((piece) => piece.pos[0] === playerState.pieces[0].pos[0] && piece.pos[1] === playerState.pieces[0].pos[1])) {
        playerState.died = true;
        clearInterval(playerStateSaveInterval);
    }
    if (!playerState.died) {
        ctx.fillStyle = "#97b087";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 20, canvas.width, 2);
        for (let i = 0, piece = playerState.pieces[i]; i < playerState.pieces.length; i++, piece = playerState.pieces[i]) {
            ctx.fillStyle = i === 0 ? "#555" : "#000";
            const pieceX = piece.pos[0] * PixelSize;
            const pieceY = 20 + piece.pos[1] * PixelSize;
            ctx.fillRect(pieceX, pieceY, PixelSize, PixelSize);
        }
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(applePos[0] * PixelSize + 1, applePos[1] * PixelSize + 20 + 1, 8, 8);
    }
    const delta = ((_a = performance.now() - lastRenderTime) !== null && _a !== void 0 ? _a : performance.now()) / 1000;
    lastRenderTime = performance.now();
    fps = 1 / delta;
    if (lastRenderTime - lastFpsUpdate > 500) {
        fpsToShow = fps.toFixed(0);
        lastFpsUpdate = lastRenderTime;
    }
    ctx.font = "15px bold Consolas";
    ctx.textAlign = "start";
    ctx.fillStyle = "#000";
    ctx.fillText(`FPS: ${fpsToShow !== null && fpsToShow !== void 0 ? fpsToShow : "loading..."}`, 5, 15);
    ctx.textAlign = "end";
    ctx.fillText(`Score: ${playerState.score}`, canvas.width - 5, 15);
    if (playerState.died) {
        ctx.textAlign = "center";
        ctx.fillText(`Game over!`, canvas.width / 2, 15);
    }
    if (!playing) {
        ctx.textAlign = "center";
        ctx.font = "40px bold Consolas";
        ctx.fillText("Press Space to start the game!", canvas.width / 2, canvas.height - 80);
    }
}
function handleKeyDownEvent(event) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!ready)
            return;
        if (event.key === "1")
            fpsInterval = 1000 / 15;
        if (event.key === "2")
            fpsInterval = 1000 / 20;
        if (event.key === "3")
            fpsInterval = 1000 / 25;
        if (event.key === "d") {
            console.log(playerState);
            return;
        }
        if (event.key === "s") {
            drawOneFrame();
            return;
        }
        if (event.key === "n") {
            spawnNewPiece();
            return;
        }
        if (event.code === "Space") {
            if (!playing) {
                playing = true;
                drawOneFrame();
                return;
            }
        }
        let chosenDirection;
        switch (event.key) {
            case "ArrowUp":
                chosenDirection = Direction.Up;
                break;
            case "ArrowRight":
                chosenDirection = Direction.Right;
                break;
            case "ArrowDown":
                chosenDirection = Direction.Down;
                break;
            case "ArrowLeft":
                chosenDirection = Direction.Left;
                break;
        }
        if (chosenDirection == null)
            return;
        if (chosenDirection[0] * -1 === playerState.direction[0] || chosenDirection[1] * -1 === playerState.direction[1])
            return;
        playerState.nextDirection = chosenDirection;
    });
}
function handleKeyUpEvent(event) {
    return __awaiter(this, void 0, void 0, function* () {
        if (["1", "2", "3"].includes(event.key))
            fpsInterval = 1000 / 10;
    });
}
function generateDefaultPlayer() {
    return [
        { pos: [28, 19] },
        { pos: [29, 19] },
        { pos: [30, 19] },
        { pos: [31, 19] },
        { pos: [32, 19] },
    ];
}
function reset() {
    return __awaiter(this, void 0, void 0, function* () {
        playerState = {
            pieces: generateDefaultPlayer(),
            died: false,
            direction: Direction.Left,
            nextDirection: Direction.Left,
            score: 0
        };
        spawnApple();
        then = performance.now();
    });
}
function main() {
    if (!ctx) {
        infoField.innerHTML = "There was an error trying to get the canvas context.";
        return;
    }
    document.body.addEventListener("keydown", handleKeyDownEvent);
    document.body.addEventListener("keyup", handleKeyUpEvent);
    ready = true;
    ctx.font = "60px bold Consolas";
    ctx.textAlign = "center";
    ctx.fillText("Loading game...", canvas.width / 2, canvas.height / 2);
    reset().then(() => {
        window.requestAnimationFrame(drawOneFrame);
    });
}
main();
export {};
