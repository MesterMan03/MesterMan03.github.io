const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let screenRatio = 0;
let sizeRatio = screenRatio / 1;
const playerX = 50;
let playerSpeed = 10;
const bulletSize = 10;
let playerY = canvas.height / 2;
let moving = 0;
let score = 0;
let hp = 100;
let shootCooldown = 0;
let blinkCooldown = 0;
const bullets = [];
const enemies = [];
let drawInterval;
let timeLeft = 60000;
let then;
var GameState;
(function (GameState) {
    GameState[GameState["MainMenu"] = 0] = "MainMenu";
    GameState[GameState["Playing"] = 1] = "Playing";
    GameState[GameState["Died"] = 2] = "Died";
    GameState[GameState["Paused"] = 3] = "Paused";
})(GameState || (GameState = {}));
let playing = GameState.MainMenu;
let mobile = false;
function drawOne() {
    handleGamepad();
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (moving !== 0) {
        playerY += moving === 1 ? -playerSpeed : playerSpeed;
        if (playerY + 15 > canvas.height)
            playerY = canvas.height - 15;
        if (playerY - 15 < 0)
            playerY = 15;
    }
    ctx.beginPath();
    ctx.fillStyle = blinkCooldown % 10 < 5 ? "#fff" : "#aaa";
    ctx.moveTo(playerX, playerY - 15);
    ctx.lineTo(playerX + 30, playerY);
    ctx.lineTo(playerX, playerY + 15);
    ctx.lineTo(playerX, playerY - 15);
    ctx.fill();
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        bullet.x += 5;
        if (bullet.x - bulletSize / 2 >= canvas.width) {
            bullets.splice(i, 1);
            continue;
        }
        ctx.beginPath();
        ctx.fillStyle = "#ff0000";
        ctx.arc(bullet.x, bullet.y, bulletSize / 2, 0, 2 * Math.PI);
        ctx.fill();
    }
    for (const enemy of enemies) {
        enemy.x -= enemy.speed;
        if (enemy.x + enemy.size / 2 <= 0) {
            enemy.x = canvas.width + enemy.size / 2;
            enemy.y = Math.floor(Math.random() * canvas.height - enemy.size) + enemy.size / 2;
        }
        const radius = enemy.size / 2;
        ctx.beginPath();
        ctx.fillStyle = "#333";
        ctx.moveTo(enemy.x, enemy.y - radius);
        ctx.lineTo(enemy.x + radius, enemy.y - radius / 2);
        ctx.lineTo(enemy.x + radius, enemy.y + radius / 2);
        ctx.lineTo(enemy.x, enemy.y + radius);
        ctx.lineTo(enemy.x - radius, enemy.y + radius / 2);
        ctx.lineTo(enemy.x - radius, enemy.y - radius / 2);
        ctx.fill();
    }
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(20, 20, (100 * (hp / 100)), 10);
    ctx.font = `${20 * screenRatio}px bold Consolas`;
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.fillText(`Pontocskáid: ${score}`, canvas.width - 20, canvas.height - 20);
    ctx.fillText(`Még ennyi időcskéd van: ${(timeLeft / 1000).toFixed(2)}s`, canvas.width - 20, 20);
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        for (const enemy of enemies) {
            const distance = Math.sqrt((bullet.x - enemy.x) ** 2 + (bullet.y - enemy.y) ** 2);
            if (distance < (enemy.size / 2 + bulletSize / 2)) {
                resetEnemy(enemy);
                bullet.hitsleft -= 1;
                score += enemy.size;
                timeLeft += 50;
            }
            if (bullet.hitsleft <= 0) {
                bullets.splice(i, 1);
                break;
            }
        }
    }
    for (const enemy of enemies) {
        if (blinkCooldown > 0)
            break;
        const distance = Math.sqrt((playerX - enemy.x) ** 2 + (playerY - enemy.y) ** 2);
        if (distance < (enemy.size / 2 + 15)) {
            resetEnemy(enemy);
            hp -= 5;
            blinkCooldown = 40;
            if (hp <= 0) {
                end();
                break;
            }
        }
    }
    if (timeLeft <= 0) {
        end(true);
    }
    if (blinkCooldown > 0)
        blinkCooldown--;
    timeLeft -= performance.now() - then;
    then = performance.now();
}
function end(timeOut = false) {
    clearInterval(drawInterval);
    playing = GameState.Died;
    let highscore = Number.parseInt(localStorage.getItem("asteroidHighScore"));
    if (isNaN(highscore))
        highscore = 0;
    if (score > highscore) {
        highscore = score;
        localStorage.setItem("asteroidHighScore", highscore.toString());
    }
    ctx.font = `${30 * screenRatio}px Consolas`;
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.fillText(`Na bazdmeg (${timeOut ? "lejárt az időcskéd" : "szar játékos vagy, belementél mindenbe"}). Pontocskáid: ${score}`, canvas.width / 2, canvas.height / 2 - 100);
    ctx.fillText(`Magas pontocskáid (ha nem írtad át, kis csaló): ${highscore}`, canvas.width / 2, canvas.height / 2 - 70);
}
function shoot() {
    if (performance.now() < shootCooldown)
        return;
    bullets.push({ x: playerX + 30, y: playerY, hitsleft: 3 });
    shootCooldown = performance.now() + 500;
}
function getEnemyData() {
    return {
        size: Math.floor(Math.random() * 20) + 30,
        speed: Math.floor(Math.random() * 2 + 2),
    };
}
function generateEnemies() {
    for (let i = 0; i < 100 * (mobile ? 0.3 : 1); i++) {
        const { size, speed } = getEnemyData();
        enemies.push({ x: canvas.width + 50 + Math.floor(Math.random() * 99) + 1, y: Math.floor(Math.random() * canvas.height - size) + size / 2, size, speed });
    }
}
function resetEnemy(enemy) {
    const { size, speed } = getEnemyData();
    enemy.x = canvas.width + enemy.size / 2;
    enemy.y = Math.floor(Math.random() * canvas.height - enemy.size) + enemy.size / 2;
    enemy.speed = speed;
    enemy.size = size;
}
function handleKeyDownEvent(event) {
    canvas.requestFullscreen()
        .then(() => {
        if (canvas.height !== screen.height)
            reScale();
    })
        .catch((error) => { if (playing)
        return; alert("For the best experience, please go into fullscreen mode"); });
    if (!playing) {
        start();
    }
    if (event.code == "ArrowDown") {
        moving = -1;
    }
    if (event.code == "ArrowUp") {
        moving = 1;
    }
    if (event.code == "Space") {
        shoot();
    }
}
function handleKeyUp(event) {
    if (event.key == "ArrowUp" && moving === 1) {
        moving = 0;
    }
    if (event.key == "ArrowDown" && moving === -1) {
        moving = 0;
    }
}
function handleGamepad() {
    var _a;
    const gp = navigator.getGamepads()[0];
    if (!gp)
        return;
    if ((_a = gp.buttons[2]) === null || _a === void 0 ? void 0 : _a.pressed) {
        const e = new KeyboardEvent("keydown", {
            code: "Space"
        });
        document.dispatchEvent(e);
    }
    if (gp.axes[1] > 0.2) {
        moving = -1;
    }
    else if (gp.axes[1] < -0.2) {
        moving = 1;
    }
    else {
        moving = 0;
    }
}
function start() {
    generateEnemies();
    playing = GameState.Playing;
    then = performance.now();
    drawInterval = setInterval(() => {
        drawOne();
    }, 16);
}
function reScale() {
    canvas.width = window.screen.height / 9 * 16;
    canvas.height = window.screen.height;
    if (mobile) {
        screen.orientation.lock("landscape")
            .catch(() => { ; });
    }
    screenRatio = (window.screen.height / 1080) * (mobile ? 1.6 : 1);
    sizeRatio = 1 / screenRatio;
}
function mainMenu() {
}
mobile = "ontouchstart" in document.body;
if (mobile)
    playerSpeed = 5;
reScale();
document.addEventListener("keyup", handleKeyUp);
document.addEventListener("keydown", handleKeyDownEvent);
ctx.fillStyle = "#000";
ctx.fillRect(0, 0, canvas.width, canvas.height);
mainMenu();
export {};
