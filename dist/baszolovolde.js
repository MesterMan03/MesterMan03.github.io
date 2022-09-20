const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const playerX = 50;
const playerSpeed = 10;
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
let playing = false;
let controller;
function drawOne() {
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
    ctx.fillRect(0, canvas.height, 20, -(canvas.height * (hp / 100)));
    ctx.font = "20px bold Consolas";
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
    if (shootCooldown > 0)
        shootCooldown--;
    if (blinkCooldown > 0)
        blinkCooldown--;
    timeLeft -= performance.now() - then;
    then = performance.now();
}
function end(timeOut = false) {
    clearInterval(drawInterval);
    let highscore = Number.parseInt(localStorage.getItem("asteroidHighScore"));
    if (isNaN(highscore))
        highscore = 0;
    if (score > highscore) {
        highscore = score;
        localStorage.setItem("asteroidHighScore", highscore.toString());
    }
    ctx.font = "30px Consolas";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.fillText(`Na bazdmeg (${timeOut ? "lejárt az időcskéd" : "szar játékos vagy, belementél mindenbe"}). Pontocskáid: ${score}`, canvas.width / 2, canvas.height / 2 - 100);
    ctx.fillText(`Magas pontocskáid (ha nem írtad át, kis csaló): ${highscore}`, canvas.width / 2, canvas.height / 2 - 70);
}
function shoot() {
    if (shootCooldown > 0)
        return;
    bullets.push({ x: playerX + 30, y: playerY, hitsleft: 3 });
    shootCooldown = 15;
}
function generateEnemies() {
    for (let i = 0; i < 200; i++) {
        const size = Math.floor(Math.random() * 20) + 30;
        const speed = Math.random() * 3 + 3;
        enemies.push({ x: canvas.width + 50 + Math.floor(Math.random() * 99) + 1, y: Math.floor(Math.random() * canvas.height - size) + size / 2, size, speed });
    }
}
function resetEnemy(enemy) {
    enemy.x = canvas.width + enemy.size / 2;
    enemy.y = Math.floor(Math.random() * canvas.height - enemy.size) + enemy.size / 2;
    enemy.size = Math.floor(Math.random() * 20) + 30;
    enemy.speed = Math.random() * 3 + 3;
}
function handleKeyDownEvent(event) {
    canvas.requestFullscreen().catch((error) => { console.log(error); alert("For the best experience, please go into fullscreen mode"); });
    if (event.code == "Enter") {
        if (playing)
            return;
        playing = true;
        then = performance.now();
        drawInterval = setInterval(() => {
            drawOne();
        }, 16);
    }
    if (event.key == "ArrowDown") {
        moving = -1;
    }
    if (event.key == "ArrowUp") {
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
canvas.width = window.screen.width;
canvas.height = window.screen.availHeight;
document.addEventListener("keyup", handleKeyUp);
document.addEventListener("keydown", handleKeyDownEvent);
window.addEventListener("gamepadconnected", (event) => {
    controller = event.gamepad;
});
window.addEventListener("gamepaddisconnected", (event) => {
    controller = null;
});
generateEnemies();
ctx.fillStyle = "#000";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "#fff";
ctx.font = "60px bold Consolas";
ctx.textAlign = "center";
ctx.fillText(`Enter`, canvas.width / 2, canvas.height / 2);
export {};
