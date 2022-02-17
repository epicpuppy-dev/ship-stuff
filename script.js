const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const turning = {};
const player = {};
player.x = 400;
player.y = 300;
player.vx = 0;
player.vy = 0;
player.scoef = 40;
player.accelerate = false;
player.rotspeed = 2.5;
player.speed = 0.1;
player.weapon = {};
player.weapon.rate = 20;
player.weapon.speed = 5;
player.weapon.cooldown = 0;
player.weapon.fire = false;
turning.left = false;
turning.right = false;
player.direction = 0;
projectiles = [];
/*
0: x= y-
1-89: x+ y-
90: x+ y=
91-179: x+ y+
180: x= y+
181-269: x- y+
270: x- y=
271-359: x- y+
*/
class projectile {
    constructor (v, x, y, direction, d) {
        this.x = x;
        this.y = y;
        this.xv = v[0];
        this.yv = v[1];
        this.direction = direction;
        this.xd = d[0];
        this.yd = d[1];
    }
    tick () {
        this.x += this.xv;
        this.y += this.yv;
        if (this.x > 820 || this.x < -20 || this.y > 620 || this.y < -20) return true;
    }
    draw () {
        const path = new Path2D();
        path.moveTo(this.x, this.y);
        path.lineTo(this.x + this.xd, this.y + this.yd);
        ctx.strokeStyle = 'black';
        ctx.stroke(path);
    }
}
function toRadians (angle) {
  return angle * (Math.PI / 180);
}
function getXY(direction, amount) {
    switch (direction) {
        case 0:
            return [0, -amount];
        case 90:
            return [amount, 0];
        case 180:
            return [0, amount];
        case 270:
            return [-amount, 0];
    }
    if (direction >= 1 && direction <= 89) return [(Math.sin(toRadians(direction))*amount), -(Math.cos(toRadians(direction))*amount)];
    if (direction >= 91 && direction <= 179) return [(Math.sin(toRadians(180 - direction))*amount), (Math.cos(toRadians(180 - direction))*amount)];
    if (direction >= 181 && direction <= 269) return [-(Math.sin(toRadians(direction - 180))*amount), (Math.cos(toRadians(direction - 180))*amount)];
    if (direction >= 271 && direction <= 359) return [-(Math.sin(toRadians(360 - direction))*amount), -(Math.cos(toRadians(360 - direction))*amount)];
}
function DrawPlayer() {
    var path = new Path2D();
    path.moveTo(0, -10);
    path.lineTo(10, 10);
    path.lineTo(-10, 10);
    path.lineTo(0, -10);
    var translation = new DOMMatrix([1,0,0,1,0,0])
    .translateSelf(player.x + 10, player.y + 10)
    .rotateSelf(player.direction);
    var object = new Path2D();
    object.addPath(path, translation);
    ctx.fillStyle = 'black';
    ctx.fill(object);
}
function Main() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 800, 600);
    if (turning.right) player.direction += player.rotspeed;
    if (turning.left) player.direction -= player.rotspeed;
    if (player.direction >= 360) {
        player.direction -= 360;
    } else if (player.direction < 0) {
        player.direction += 360;
    }
    if (player.weapon.cooldown <= 0 && player.weapon.fire) {
        projectiles.push(new projectile(getXY(player.direction, player.weapon.speed), player.x + 10, player.y + 10, player.direction, getXY(player.direction, 8)));
        player.weapon.cooldown = 1 / player.weapon.rate * 50;
    }
    for (p=0; p<projectiles.length; p++) {
        out = projectiles[p].tick();
        if (out) {
            projectiles = projectiles.slice(0, p).concat(projectiles.slice(p+1));
            p--;
        } else {
            projectiles[p].draw();
        }
    }
    if (player.x > 820) player.x += 840;
    else if (player.x < -20) player.x -= 840;
    if (player.y > 620) player.y -= 640;
    else if (player.y < -20) player.y += 640;
    if (player.accelerate) delta = getXY(player.direction, player.speed);
    else delta = [0, 0];
    player.vx += delta[0];
    player.vy += delta[1];
    if (player.vx > delta[0] * player.scoef && player.vx > 0) player.vx = Math.max(player.vx - player.speed, 0);
    if (player.vx < delta[0] * player.scoef && player.vx < 0) player.vx = Math.min(player.vx + player.speed, 0);
    if (player.vy > delta[1] * player.scoef && player.vy > 0) player.vy = Math.max(player.vy - player.speed, 0);
    if (player.vy < delta[1] * player.scoef && player.vy < 0) player.vy = Math.min(player.vy + player.speed, 0);
    player.x += player.vx;
    player.y += player.vy;
    DrawPlayer();
    player.weapon.cooldown--;
}
function Update() {
    player.speed = parseFloat(document.getElementById('speed').value);
    player.rotspeed = parseFloat(document.getElementById('rotspeed').value);
    player.weapon.rate = parseFloat(document.getElementById('firerate').value);
    player.weapon.speed = parseFloat(document.getElementById('firespeed').value);
    player.scoef = parseFloat(document.getElementById('scoef').value);
}
document.addEventListener('keydown', function (event) {
    if (event.code == 'ArrowRight') turning.right = true;
    if (event.code == 'ArrowLeft') turning.left = true;
    if (event.code == 'ArrowUp') player.accelerate = true;
    if (event.code == 'Space') player.weapon.fire = true;
});
document.addEventListener('keyup', function (event) {
    if (event.code == 'ArrowRight') turning.right = false;
    if (event.code == 'ArrowLeft') turning.left = false;
    if (event.code == 'ArrowUp') player.accelerate = false;
    if (event.code == 'Space') player.weapon.fire = false;
});
setInterval(Main, 20);