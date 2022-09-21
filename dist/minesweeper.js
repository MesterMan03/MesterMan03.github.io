const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const PixelSize = 25;
const HorizPixels = canvas.width / PixelSize;
const VerticPixels = canvas.height / PixelSize;
const TotalMines = HorizPixels * VerticPixels * 0.25;
let playerState;
let chordPos = null;
let playing = false;
const bombImage = document.getElementById("bomb");
function drawGrid() {
    for (let x = 0; x < HorizPixels; x++) {
        for (let y = 0; y < VerticPixels; y++) {
            ctx.beginPath();
            ctx.fillStyle = "#808080";
            ctx.moveTo(x * PixelSize, y * PixelSize + PixelSize);
            ctx.lineTo(x * PixelSize + PixelSize, y * PixelSize + PixelSize);
            ctx.lineTo(x * PixelSize + PixelSize, y * PixelSize);
            ctx.lineTo(x * PixelSize + PixelSize - 3, y * PixelSize + 3);
            ctx.lineTo(x * PixelSize + PixelSize - 3, y * PixelSize + PixelSize - 3);
            ctx.lineTo(x * PixelSize + 3, y * PixelSize + PixelSize - 3);
            ctx.lineTo(x * PixelSize, y * PixelSize + PixelSize);
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = "#fff";
            ctx.moveTo(x * PixelSize, y * PixelSize + PixelSize);
            ctx.lineTo(x * PixelSize, y * PixelSize);
            ctx.lineTo(x * PixelSize + PixelSize, y * PixelSize);
            ctx.lineTo(x * PixelSize + PixelSize - 3, y * PixelSize + 3);
            ctx.lineTo(x * PixelSize + 3, y * PixelSize + 3);
            ctx.lineTo(x * PixelSize + 3, y * PixelSize + PixelSize - 3);
            ctx.lineTo(x * PixelSize, y * PixelSize + PixelSize);
            ctx.fill();
        }
    }
}
function drawOneFrame() {
    if (!playing)
        return;
    ctx.fillStyle = "#c6c6c6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    for (let x = 0; x < HorizPixels; x++) {
        for (let y = 0; y < VerticPixels; y++) {
            const piece = playerState.board[y][x];
            if (piece.revealed) {
                ctx.fillStyle = "#c6c6c6";
                ctx.fillRect(x * PixelSize, y * PixelSize, PixelSize, PixelSize);
                ctx.fillStyle = "#000";
                ctx.font = "19px bold Consolas";
                ctx.textAlign = "center";
                ctx.fillText(piece.minesAround.toString(), x * PixelSize + PixelSize / 2, y * PixelSize + PixelSize - 3);
            }
            chording: if (chordPos && !piece.revealed) {
                if (x === chordPos[0] && y === chordPos[1])
                    break chording;
                if (Math.abs(chordPos[0] - x) > 1 || Math.abs(chordPos[1] - y) > 1)
                    break chording;
                ctx.fillStyle = "#c6c6c6";
                ctx.fillRect(x * PixelSize, y * PixelSize, PixelSize, PixelSize);
            }
        }
    }
    if (playing)
        window.requestAnimationFrame(drawOneFrame);
}
function end(detonated = false) {
    if (detonated) {
        for (let x = 0; x < HorizPixels; x++) {
            for (let y = 0; y < VerticPixels; y++) {
                const piece = playerState.board[y][x];
                if (piece.mine) {
                    ctx.drawImage(bombImage, x * PixelSize, y * PixelSize);
                }
            }
        }
    }
    ctx.font = "60px bold Consolas";
    ctx.textAlign = "center";
    ctx.fillStyle = detonated ? "#f00" : "#0f0";
    ctx.fillText(detonated ? `Oh no, you clicked on a mine` : `Oh nice, you found all mines`, canvas.width / 2, canvas.height / 2 - 300);
    playing = false;
}
function clickPiece(x, y, piece) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
    piece.revealed = true;
    if (piece.mine) {
        end(true);
        return;
    }
    const minesAround = Number((_c = (_b = (_a = playerState.board[y]) === null || _a === void 0 ? void 0 : _a[x - 1]) === null || _b === void 0 ? void 0 : _b.mine) !== null && _c !== void 0 ? _c : false) +
        Number((_f = (_e = (_d = playerState.board[y]) === null || _d === void 0 ? void 0 : _d[x + 1]) === null || _e === void 0 ? void 0 : _e.mine) !== null && _f !== void 0 ? _f : false) +
        Number((_j = (_h = (_g = playerState.board[y - 1]) === null || _g === void 0 ? void 0 : _g[x - 1]) === null || _h === void 0 ? void 0 : _h.mine) !== null && _j !== void 0 ? _j : false) +
        Number((_m = (_l = (_k = playerState.board[y - 1]) === null || _k === void 0 ? void 0 : _k[x + 1]) === null || _l === void 0 ? void 0 : _l.mine) !== null && _m !== void 0 ? _m : false) +
        Number((_q = (_p = (_o = playerState.board[y + 1]) === null || _o === void 0 ? void 0 : _o[x - 1]) === null || _p === void 0 ? void 0 : _p.mine) !== null && _q !== void 0 ? _q : false) +
        Number((_t = (_s = (_r = playerState.board[y + 1]) === null || _r === void 0 ? void 0 : _r[x + 1]) === null || _s === void 0 ? void 0 : _s.mine) !== null && _t !== void 0 ? _t : false) +
        Number((_w = (_v = (_u = playerState.board[y + 1]) === null || _u === void 0 ? void 0 : _u[x]) === null || _v === void 0 ? void 0 : _v.mine) !== null && _w !== void 0 ? _w : false) +
        Number((_z = (_y = (_x = playerState.board[y - 1]) === null || _x === void 0 ? void 0 : _x[x]) === null || _y === void 0 ? void 0 : _y.mine) !== null && _z !== void 0 ? _z : false);
    piece.minesAround = minesAround;
}
function handleMouseMoveEvent(event) {
    if (event.buttons !== 4)
        return;
    if (event.x > canvas.width || event.y > canvas.height)
        return;
    const pieceX = Math.floor(event.x / PixelSize);
    const pieceY = Math.floor(event.y / PixelSize);
    chordPos = [pieceX, pieceY];
}
function handleMouseDownEvent(event) {
    var _a;
    if (event.x > canvas.width || event.y > canvas.height)
        return;
    const pieceX = Math.floor(event.x / PixelSize);
    const pieceY = Math.floor(event.y / PixelSize);
    const piece = (_a = playerState.board[pieceY]) === null || _a === void 0 ? void 0 : _a[pieceX];
    if (!piece)
        return;
    if (event.button === 1)
        chordPos = [pieceX, pieceY];
    if (event.button === 0)
        clickPiece(pieceX, pieceY, piece);
}
function handleMouseUpEvent(event) {
    if (event.button === 1) {
        chordPos = null;
    }
}
function generateBombs() {
    let board = [];
    for (let y = 0; y < VerticPixels; y++) {
        board[y] = [null, null, null, null, null, null, null, null];
        for (let x = 0; x < HorizPixels; x++) {
            board[y][x] = {
                mine: false,
                revealed: false,
                minesAround: null
            };
        }
    }
    let i = 0;
    while (i < TotalMines) {
        const x = Math.floor(Math.random() * HorizPixels);
        const y = Math.floor(Math.random() * VerticPixels);
        if (board[y][x].mine)
            continue;
        board[y][x].mine = true;
        i++;
    }
    return board;
}
function main() {
    canvas.addEventListener("mousedown", handleMouseDownEvent);
    canvas.addEventListener("mousemove", handleMouseMoveEvent);
    canvas.addEventListener("mouseup", handleMouseUpEvent);
    playerState = {
        board: generateBombs(),
        died: false,
        minesRevealed: 0,
    };
    playing = true;
    window.requestAnimationFrame(drawOneFrame);
}
main();
export {};
