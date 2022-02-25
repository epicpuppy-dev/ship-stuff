const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const turning = {};
const WIDTH = 1280;
const HEIGHT = 720;
const LEVELCOEF = 5;
canvas.width = WIDTH;
canvas.height = HEIGHT;
const mouse = {};
mouse.x = 0;
mouse.y = 0;
mouse.direction = 0;
const player = {};
player.x = WIDTH / 2;
player.y = HEIGHT / 2;
player.vx = 0;
player.vy = 0;
player.level = 0;
player.exp = 0;
player.xpreq = 1;
player.health = 100;
player.maxhealth = 100;
player.scoef = 40;
player.accelerate = false;
player.rotspeed = 2.5;
player.speed = 0.1;
player.weapon = {};
player.weapon.rate = 2;
player.weapon.speed = 5;
player.weapon.cooldown = (1 / player.weapon.rate * 50);
player.weapon.fire = false;
const unlocks = {};
unlocks.weapon = false;
unlocks.move = false;
unlocks.asteroids = false;
unlocks.enemies = false;
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
        if (this.x > WIDTH + 20 || this.x < -20 || this.y > HEIGHT + 20 || this.y < -20) return true;
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
function toDegrees (angle) {
    return angle * (180 / Math.PI);
}
function getXY(direction, amount) {
    newdir = direction;
    if (direction > 360) newdir -= 360;
    if (direction < 0) newdir += 360;
    out = [];
    switch (direction) {
        case 0:
            out = [0, -amount];
        case 90:
            out = [amount, 0];
        case 180:
            out = [0, amount];
        case 270:
            out = [-amount, 0];
    }
    if (newdir > 0 && newdir < 90) out = [(Math.sin(toRadians(newdir))*amount), -(Math.cos(toRadians(newdir))*amount)];
    if (newdir > 90 && newdir < 180) out = [(Math.sin(toRadians(180 - newdir))*amount), (Math.cos(toRadians(180 - newdir))*amount)];
    if (newdir > 180 && newdir < 270) out = [-(Math.sin(toRadians(newdir - 180))*amount), (Math.cos(toRadians(newdir - 180))*amount)];
    if (newdir > 270 && newdir < 360) out = [-(Math.sin(toRadians(360 - newdir))*amount), -(Math.cos(toRadians(360 - newdir))*amount)];
    //console.log(out);
    return out;
}
function DrawPlayer() {
    var path = new Path2D();
    path.moveTo(0, -10);
    path.lineTo(10, 10);
    path.lineTo(0, 5);
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
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    Turn();
    if (player.weapon.cooldown > (1 / player.weapon.rate * 50) && player.weapon.fire && unlocks.weapon) {
        projectiles.push(new projectile(getXY(player.direction, player.weapon.speed + Math.abs(player.vx) + Math.abs(player.vy)), player.x + 10, player.y + 10, player.direction, getXY(player.direction, 8)));
        player.weapon.cooldown = 0;
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
    if (player.x > WIDTH + 20) player.x = -20;
    else if (player.x < -20) player.x = WIDTH + 20;
    if (player.y > HEIGHT + 20) player.y = -20;
    else if (player.y < -20) player.y = HEIGHT + 20;
    if (player.accelerate) delta = getXY(player.direction, player.speed);
    else delta = [0, 0];
    if (unlocks.move) {
        player.vx += delta[0];
        player.vy += delta[1];
        if (player.vx > delta[0] * player.scoef && player.vx > 0) player.vx = Math.max(player.vx - player.speed, 0);
        if (player.vx < delta[0] * player.scoef && player.vx < 0) player.vx = Math.min(player.vx + player.speed, 0);
        if (player.vy > delta[1] * player.scoef && player.vy > 0) player.vy = Math.max(player.vy - player.speed, 0);
        if (player.vy < delta[1] * player.scoef && player.vy < 0) player.vy = Math.min(player.vy + player.speed, 0);
        player.x += player.vx;
        player.y += player.vy;
    }
    DrawPlayer();
    DrawUI();
    player.weapon.cooldown++;
    player.exp += 0.004;
}
function Turn() {
    mouse.direction = toDegrees(Math.atan2(mouse.y - player.y, mouse.x - player.x)) + 90;
    //get direction relative to player direction
    directionDiff = Math.round(mouse.direction - player.direction);
    if (directionDiff > 180) directionDiff -= 360;
    else if (directionDiff < -180) directionDiff += 360;
    if (directionDiff < 0) turning.left = true;
    else turning.left = false;
    if (directionDiff > 0) turning.right = true;
    else turning.right = false;
    if (Math.abs(directionDiff) < player.rotspeed) {
        player.direction = mouse.direction;
    } else {
        if (turning.right) player.direction += player.rotspeed;
        if (turning.left) player.direction -= player.rotspeed;
        if (player.direction >= 360) {
            player.direction -= 360;
        } else if (player.direction < 0) {
            player.direction += 360;
        }
    }
}
function DrawUI() {
    ctx.fillStyle = '#eee';
    ctx.strokeStyle = 'black';
    ctx.fillRect(8, 8, 250, 16);
    ctx.fillRect(8, 32, 250, 16);
    ctx.fillRect(8, 56, 100, 16);
    ctx.fillStyle = 'dodgerblue';
    ctx.fillRect(8, 8, 250 * Math.min((player.exp / player.xpreq), 1), 16);
    ctx.strokeRect(8, 8, 250, 16);
    ctx.fillStyle = 'crimson';
    ctx.fillRect(8, 32, 250 * (player.health / player.maxhealth), 16);
    ctx.strokeRect(8, 32, 250, 16);
    ctx.fillStyle = 'gray';
    ctx.fillRect(8, 56, 100 * Math.min((player.weapon.cooldown / (1 / player.weapon.rate * 50)), 1), 16);
    ctx.strokeRect(8, 56, 100, 16);
}
document.addEventListener('keydown', function (event) {
    if (event.code == 'Space') player.accelerate = true;
});
document.addEventListener('keyup', function (event) {
    if (event.code == 'Space') player.accelerate = false;
});
document.addEventListener('mousedown', function (event) {
    player.weapon.fire = true;
});
document.addEventListener('mouseup', function (event) {
    player.weapon.fire = false;
});
//mouse x and y positions
document.addEventListener('mousemove', function (event) {
    mouse.x = event.clientX - canvas.offsetLeft;
    mouse.y = event.clientY - canvas.offsetTop;
});
setInterval(Main, 20);