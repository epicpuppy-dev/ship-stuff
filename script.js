const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const turning = {};
const WIDTH = 1280;
const HEIGHT = 720;
const LEVELCOEF = 5;
const DRIFT = 2.5;


const settings = {};
settings.xp = {};
settings.score = {};
settings.difficulty = {};

//-------------------------------------
//------------[XP SETTINGS]------------
//-<passive>-----[passive xp gain]-----
//-<active>--[xp gained from movement]-
//-<multi>-------[xp multiplier]-------
//-------------------------------------
settings.xp.passive = 0.05;
settings.xp.active = 0.005;
settings.xp.multi = 1;
settings.xp.increase = 2;
//-------------------------------------
//----------[SCORE SETTINGS]-----------
//-<multi>-----[score multiplier]------
//-------------------------------------
settings.score.multi = 1;
//-------------------------------------
//-------[DIFFICULTY SETTINGS]---------
//-<root>--------[root of score]-------
//-------------------------------------
settings.difficulty.root = 3;
//-------------------------------------



gen = 0;

const shop = {};
shop.animation = 0;
shop.width = 1280;
shop.stat = [0, 0, 0, 0, 0, 0, 0, 0];
shop.stats = {
    hp: "Health", rg: "Regen", ac: "Acceleration", ms: "Max Speed", rs: "Rotation Speed", fr: "Fire Rate", ls: "Laser Speed", dg: "Damage"
};
shop.selected = -1;
shop.keys = ["hp", "rg", "ac", "ms", "rs", "fr", "ls", "dg"];
shop.items = [];
shop.bought = [];
shop.listing = [];
shop.register = function (item) {
    this.items.push(item);
    return this;
};
canvas.width = WIDTH;
canvas.height = HEIGHT;

const mouse = {};
mouse.x = 0;
mouse.y = 0;
mouse.direction = 0;

const player = {};
player.x = WIDTH / 2;
player.y = HEIGHT / 2;
player.score = 0;
player.vx = 0;
player.vy = 0;
player.level = 0;
player.levelup = false;
player.xp = 0;
player.xpreq = 4;
player.health = 100;
player.regen = 0;
player.maxhealth = 100;
player.maxspeed = 0;
player.accelerate = false;
player.rotspeed = 0;
player.speed = 0;
player.weapon = {};
player.weapon.damage = 0;
player.weapon.rate = 0;
player.weapon.speed = 0;
player.weapon.cooldown = 0;
player.weapon.fire = false;
player.GainScore = function (amt) {
    this.score += amt * settings.score.multi;
}
player.GainXP = function (amt) {
    this.xp += amt * settings.score.multi;
}

const unlocks = {};
unlocks.weapon = false;
unlocks.stars = false;
unlocks.move = false;
unlocks.asteroids = false;
unlocks.enemies = false;
unlocks.abilities = {};
unlocks.abilities.dash = false;
unlocks.abilities.burst = false;
unlocks.abilities.shield = false;
unlocks.abilities.freeze = false;

const abilities = {};
abilities.dash = {};
abilities.dash.power = 180;
abilities.dash.cooldown = 0;
abilities.dash.reload = 300;
abilities.dash.overcharge = 1;
abilities.burst = {};
abilities.burst.count = 20;
abilities.burst.radius = 20;
abilities.burst.cooldown = 0;
abilities.burst.reload = 400;
abilities.burst.overcharge = 1;
abilities.shield = {};
abilities.shield.cooldown = 0;
abilities.shield.reload = 1000;
abilities.shield.active = false;
abilities.shield.duration = 200;
abilities.freeze = {};
abilities.freeze.cooldown = 0;
abilities.freeze.reload = 1000;
abilities.freeze.active = false;
abilities.freeze.duration = 200;

turning.left = false;
turning.right = false;
player.direction = 0;
var projectiles = [];
var asteroids = [];
var enemies = [];
var spawnrate = 150;
var enemyProjectiles = [];
var difficulty = 1;
var scene = 'g';
/*
hp = health
rg = regen
ac = acceleration
ms = max speed
rs = rotation speed
fr = fire rate
ls = laser speed
dg = damage
*/
class item {
    constructor (id, displayName, description, levelReq, req, onbuy, stats={}) {
        this.id = id;
        this.display = displayName;
        this.desc = description;
        this.level = levelReq;
        this.req = req;
        this.onbuy = onbuy;
        this.stats = stats;
        this.height = 28 + (12 * description.length);
        if (Object.keys(stats).length !== 0) {this.height += 8 + (Object.keys(stats).length * 12)}
    }
}
function GetSpawnRate() {
    return 50 / ((1/5) * Math.pow((difficulty + 1), 1/5));
}
function GetBoundingBox(x1, y1, x2, y2) {
    var bx1, bx2, by1, by2;
    if (x2 < x1) {
        bx1 = x2;
        bx2 = x1;
    } else {
        bx1 = x1;
        bx2 = x2;
    }
    if (y2 < y1) {
        by1 = y2;
        by2 = y1;
    } else {
        by1 = y1;
        by2 = y2;
    }
    return [x1, y1, x2-x1, y2-y1];
}
function LevelUp() {
    player.level++;
    player.xpreq = 5 * Math.pow(2, player.level + 1);
}
function getXY(direction, amount) {
    newdir = direction;
    if (direction > 360) newdir -= 360;
    if (direction < 0) newdir += 360;
    out = [];
    switch (direction) {
        case 0:
            out = [0, -amount];
            break;
        case 90:
            out = [amount, 0];
            break;
        case 180:
            out = [0, amount];
            break;
        case 270:
            out = [-amount, 0];
    }
    if (newdir > 0 && newdir < 90) out = [Math.sind(newdir)*amount, -(Math.cosd(newdir)*amount)];
    if (newdir > 90 && newdir < 180) out = [(Math.sind(180 - newdir)*amount), (Math.cosd(180 - newdir)*amount)];
    if (newdir > 180 && newdir < 270) out = [-(Math.sind(newdir - 180)*amount), (Math.cosd(newdir - 180)*amount)];
    if (newdir > 270 && newdir < 360) out = [-(Math.sind(360 - newdir)*amount), -(Math.cosd(360 - newdir)*amount)];
    //console.log(out);
    return out;
}
function ShopAnimation(size, frame) {
    out = (
        (size / 2) * Math.sin(((frame * Math.PI) / 50) + ((Math.PI / 50) * 25)) + (size / 2)
    );
    return out;
}

function PlayerCollision() {
    for (o = 0; o < asteroids.length; o++) {
        var obstacle = asteroids[o];
        if (obstacle.x > player.x - 10 && obstacle.x < player.x + 30) {
            var collision = collide.sat.poly(
                [[10, 0], [0, 20], [20, 20]], [player.x, player.y], player.direction, obstacle.points, [obstacle.x, obstacle.y], obstacle.direction
            );
            if (collision) {
                asteroids.splice(o, 1);
                o--;
                if (!abilities.shield.active) {
                    player.health -= difficulty + 2;
                }
                if (player.health <= 0) scene = 'e';
            }
        }
    }
    for (p = 0; p < enemyProjectiles.length; p++) {
        var projectile = enemyProjectiles[p];
        if (projectile.x > player.x - 10 && projectile.x < player.x + 30) {
            var collision = collide.sat.point(
                [[10, 0], [0, 20], [20, 20]], [player.x, player.y], [projectile.x, projectile.y], player.direction
            );
            if (collision) {
                if (!abilities.shield.active) {
                    player.health -= projectile.damage;
                }
                enemyProjectiles.splice(p, 1);
                p--;
                if (player.health <= 0) scene = 'e';
            }
        }
    }
}
function TickAbilities() {
    if (unlocks.abilities.dash) {
        if (abilities.dash.cooldown < abilities.dash.reload * abilities.dash.overcharge) abilities.dash.cooldown++;
    }
    if (unlocks.abilities.burst) {
        if (abilities.burst.cooldown < abilities.burst.reload * abilities.burst.overcharge) abilities.burst.cooldown++;
    }
    if (unlocks.abilities.shield) {
        if (abilities.shield.cooldown < abilities.shield.reload && !abilities.shield.active) abilities.shield.cooldown++;
        if (abilities.shield.active) {
            abilities.shield.cooldown -= abilities.shield.reload / abilities.shield.duration;
            if (abilities.shield.cooldown <= 0) {
                abilities.shield.active = false;
            }
        }
    }
    if (unlocks.abilities.freeze) {
        if (abilities.freeze.cooldown < abilities.freeze.reload && !abilities.freeze.active) abilities.freeze.cooldown++;
        if (abilities.freeze.active) {
            abilities.freeze.cooldown -= abilities.freeze.reload / abilities.freeze.duration;
            if (abilities.freeze.cooldown <= 0) {
                abilities.freeze.active = false;
            }
        }
    }
}
function BuyItem(item) {
    item.onbuy();
    for (const stat in item.stats) {
        if (item.stats[stat][1] == "m") {
            switch (stat) {
                case "hp": player.maxhealth *= 1 + item.stats[stat][0]; player.health *= 1 + item.stats[stat][0]; break;
                case "rg": player.regen *= 1 + item.stats[stat][0]; break;
                case "ac": player.speed *= 1 + item.stats[stat][0]; break;
                case "ms": player.maxspeed *= 1 + item.stats[stat][0]; break;
                case "rs": player.rotspeed *= 1 + item.stats[stat][0]; break;
                case "fr": player.weapon.rate *= 1 + item.stats[stat][0]; player.weapon.damage = Math.round(1 / player.weapon.rate * 50); break;
                case "ls": player.weapon.speed *= 1 + item.stats[stat][0] / 50; break;
                case "dg": player.weapon.damage *= 1 + item.stats[stat][0];
            }
        }
        else if (item.stats[stat][1] == "a") {
            switch (stat) {
                case "hp": player.maxhealth += item.stats[stat][0]; player.health += item.stats[stat][0]; break;
                case "rg": player.regen += item.stats[stat][0]; break;
                case "ac": player.speed += item.stats[stat][0] / 50; break;
                case "ms": player.maxspeed += item.stats[stat][0]; break;
                case "rs": player.rotspeed += item.stats[stat][0] / 50; break;
                case "fr": player.weapon.rate += item.stats[stat][0]; player.weapon.cooldown = Math.round(1 / player.weapon.rate * 50); break;
                case "ls": player.weapon.speed += item.stats[stat][0] / 50; break;
                case "dg": player.weapon.damage += item.stats[stat][0];
            }
        }
    }
    shop.bought.push(item.id);
    player.levelup = false;
    player.xp = 0;
    player.level += 1;
    player.xpreq = Math.pow(player.level + 2, settings.xp.increase);
}
function Main() {
    if (gen > 0) {
        enemies.push(
            new shooter(15 + 3 * difficulty, 2 + difficulty, (115 / 50), 0.5, 65,
            'rgb(' + (Math.floor(Math.random() * 25) + 225) + ',' + (Math.floor(Math.random() * 75) + 15) + ',0)'));
        gen--;
    }
    if (scene == 'g') {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        if (abilities.shield.active) {
            var shield = new Path2D();
            shield.arc(player.x + 10, player.y + 10, 25, 0, 2 * Math.PI);
            ctx.fillStyle = '#33aaff22';
            ctx.fill(shield);
        }
        if (abilities.freeze.active) {
            ctx.fillStyle = '#66ddff22';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
        }
        if (unlocks.asteroids) {
            if (Math.floor(Math.random() * 100) == 0) {
                asteroids.push(new asteroid())
            }
        }
        if (unlocks.enemies) {
            if (Math.floor(Math.random() * spawnrate) == 0) {
                while (true) {
                    var type = Math.floor(Math.random() * 8);
                    if (type == 8 && difficulty < 25) continue;
                    if (type >= 6 && type <= 7 && difficulty < 20) continue;
                    if (type >= 3 && type <= 5 && difficulty < 10) continue;
                    switch (type) {
                        case 0: case 1: case 2:
                            enemies.push(
                                new drifter(5 + 2 * difficulty, 2 + difficulty, (115 / 50), 0.5, 50,
                                'rgb(' + (Math.floor(Math.random() * 75) + 100) + ',0,0)'));
                            break;
                        case 3: case 4: case 5:
                            enemies.push(
                                new fighter(10 + 3 * difficulty, 3 + 1.5 * difficulty, (115 / 50), 0.5, 75,
                                'rgb(' + (Math.floor(Math.random() * 75) + 175) + ',0,0)'));
                            break;
                        case 6: case 7:
                            enemies.push(
                                new shooter(15 + 3 * difficulty, 2 + difficulty, (115 / 50), 0.5, 65,
                                'rgb(' + (Math.floor(Math.random() * 50) + 200) + ',' + (Math.floor(Math.random() * 100) + 15) + ',0)'));
                    }
                    break;
                }
            }
        }
        Turn();
        if (player.weapon.cooldown > (1 / player.weapon.rate * 50) && player.weapon.fire && unlocks.weapon) {
            projectiles.push(
                new projectile(
                    getXY(player.direction, player.weapon.speed + ((Math.abs(player.vx) + Math.abs(player.vy)) / 2)),
                    player.x + 10, player.y + 10, player.direction, getXY(player.direction, 12))
            );
            player.weapon.cooldown = 0;
        }
        TickGame();
        player.weapon.cooldown++;
        player.xp += (settings.xp.passive + Math.abs(player.vx * settings.xp.active) + Math.abs(player.vy * settings.xp.active)) * settings.xp.multi;
        player.score += player.level * 0.02 * settings.score.multi;
        difficulty = Math.pow(player.score, 1 / settings.difficulty.root);
        spawnrate = GetSpawnRate();
        player.health = Math.min(player.maxhealth, player.health + player.regen / 50);
        if (!player.levelup && shop.animation > 0) shop.animation--;
        if (shop.animation == 0 && shop.selected != -1) shop.selected = -1;
        if (player.levelup && shop.animation < 50) shop.animation++;
        if (player.levelup) player.xp = player.xpreq;
        if (player.xp >= player.xpreq && !player.levelup) {
            player.xp = player.xpreq;
            player.levelup = true;
            PickOptions();
        };
    }
    else if (scene == 'e') {
        ctx.fillStyle = '#100';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        DrawGameOver();
    }
}
function TickGame() {
    TickProjectile();
    TickEnemyProjectile();
    TickEnemy();
    TickAsteroid();
    CalcVelocity();
    TickAbilities();
    DrawPlayer();
    PlayerCollision();
    DrawUI();
}
function PickOptions() {
    shop.stat = [0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < 6; i++) {
        shop.stat[Math.floor(Math.random() * 8)] += Math.floor(Math.random() * 10) / 100;
    }
    available = [];
    for (const item of shop.items) {
        if (shop.bought.includes(item.id)) continue;
        if (player.level < item.level) continue;
        purchasable = true;
        for (const req of item.req) {
            if (!shop.bought.includes(req)) purchasable = false;
        }
        if (purchasable) available.push(item);
    }
    listing = [];
    if (available.length <= 2) {
        listing = available;
    }
    else {
        for (i = 0; i < 3; i++) {
            choice = Math.floor(Math.random() * available.length);
            listing.push(available[choice]);
            available.splice(choice, 1);
        }
    }
    //Get size
    ctx.font = '16px \'Press Start 2P\'';
    maxwidth = ctx.measureText("Ship Upgrade [A]").width;
    ctx.font = '8px \'Press Start 2P\'';
    for (i = 0; i < 8; i++) {
        width = ctx.measureText(`${shop.stats[shop.keys[i]]} +${shop.stat[i]}%`).width;
        if (width > maxwidth) maxwidth = width;
    }
    listings = 0;
    keys = ["S", "D", "F"];
    for (const item of listing) {
        ctx.font = '16px \'Press Start 2P\'';
        width = ctx.measureText(item.display + " [" + keys[listings] + "]").width;
        listings++;
        if (width > maxwidth) maxwidth = width;
        ctx.font = '8px \'Press Start 2P\'';
        for (const line of item.desc) {
            width = ctx.measureText(line).width;
            if (width > maxwidth) maxwidth = width;
        }
        for (const stat in item.stats) {
            text = shop.stats[stat];
            if (item.stats[stat][1] == "m") {
                width = ctx.measureText(text + " +" + Math.round(item.stats[stat][0] * 100) + "%");
            } else if (item.stats[stat][1] == "a") {
                width = ctx.measureText(text + " +" + Math.round(item.stats[stat][0]));
            }
        }
    }
    shop.width = Math.round(maxwidth);
    shop.listing = listing;
}
function CalcVelocity() {
    if (player.x > WIDTH + 20) player.x = -20;
    else if (player.x < -20) player.x = WIDTH + 20;
    if (player.y > HEIGHT + 20) player.y = -20;
    else if (player.y < -20) player.y = HEIGHT + 20;
    if (player.accelerate) delta = getXY(player.direction, player.speed);
    else delta = [0, 0];
    if (unlocks.move) {
        if (
            !((player.vx > (delta[0] / player.speed) * (player.maxspeed / 50) && player.vx > 0) ||
            (player.vx < (delta[0] / player.speed) * (player.maxspeed / 50) && player.vx < 0))
        ) player.vx += delta[0];
        if (
            !((player.vy > (delta[1] / player.speed) * (player.maxspeed / 50) && player.vy > 0) ||
            (player.vy < (delta[1] / player.speed) * (player.maxspeed / 50) && player.vy < 0))
        ) player.vy += delta[1];
        if (player.vx >
            (delta[0] / player.speed) * (player.maxspeed / 50) && player.vx > 0) player.vx = Math.max(player.vx - player.speed / DRIFT, 0);
        if (player.vx <
            (delta[0] / player.speed) * (player.maxspeed / 50) && player.vx < 0) player.vx = Math.min(player.vx + player.speed / DRIFT, 0);
        if (player.vy >
            (delta[1] / player.speed) * (player.maxspeed / 50) && player.vy > 0) player.vy = Math.max(player.vy - player.speed / DRIFT, 0);
        if (player.vy <
            (delta[1] / player.speed) * (player.maxspeed / 50) && player.vy < 0) player.vy = Math.min(player.vy + player.speed / DRIFT, 0);
        player.x += player.vx;
        player.y += player.vy;
    }
}
function Turn() {
    mouse.direction = Math.toDegrees(Math.atan2(mouse.y - player.y - 10, mouse.x - player.x - 10)) + 90;
    //get direction relative to player direction
    directionDiff = mouse.direction - player.direction;
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


//key detection
document.addEventListener('keydown', function (event) {
    if (event.code == 'Space') player.weapon.fire = true;
    if (player.levelup) {
        if (event.code == 'KeyA') {
            /*
            hp = health
            rg = regen
            ac = acceleration
            ms = max speed
            rs = rotation speed
            fr = fire rate
            ls = laser speed
            dg = damage
            */
            player.maxhealth *= 1 + shop.stat[0];
            player.health *= 1 + shop.stat[0];
            player.regen *= 1 + shop.stat[1];
            player.speed *= 1 + shop.stat[2];
            player.maxspeed *= 1 + shop.stat[3];
            player.rotspeed *= 1 + shop.stat[4];
            player.weapon.rate *= 1 + shop.stat[5];
            player.weapon.speed *= 1 + shop.stat[6];
            player.damage *= 1 + shop.stat[7];
            player.levelup = false;
            player.xp = 0;
            shop.selected = 0;
            player.level += 1;
            player.xpreq = Math.pow(player.level + 2, settings.xp.increase);
        }
        else if (event.code == 'KeyS') {
            if (shop.listing.length < 1) return;
            BuyItem(shop.listing[0]);
            shop.selected = 1;
        }
        else if (event.code == 'KeyD') {
            if (shop.listing.length < 2) return;
            BuyItem(shop.listing[1]);
            shop.selected = 2;
        }
        else if (event.code == 'KeyF') {
            if (shop.listing.length < 3) return;
            BuyItem(shop.listing[2]);
            shop.selected = 3;
        }
    }
    if (event.code == 'KeyZ' && unlocks.abilities.dash && abilities.dash.cooldown >= abilities.dash.reload) {
        delta = getXY(player.direction, abilities.dash.power / 50);
        player.vx += delta[0];
        player.vy += delta[1];
        abilities.dash.cooldown -= abilities.dash.reload;
    }
    if (event.code == 'KeyX' && unlocks.abilities.burst && abilities.burst.cooldown >= abilities.burst.reload) {
        for (b = 0; b < abilities.burst.count; b++) {
            var fireDirection = Math.floor(Math.random() * abilities.burst.radius * 2) - abilities.burst.radius;
            fireDirection += player.direction;
            if (fireDirection > 360) fireDirection -= 360;
            if (fireDirection < 0) fireDirection += 360;
            projectiles.push(
                new projectile(
                    getXY(fireDirection, player.weapon.speed + ((Math.abs(player.vx) + Math.abs(player.vy)) / 2)),
                    player.x + 10, player.y + 10, fireDirection, getXY(fireDirection, 16))
            );
        }
        abilities.burst.cooldown -= abilities.burst.reload;
    }
    if (event.code == 'KeyC' && unlocks.abilities.shield && abilities.shield.cooldown >= abilities.shield.reload) {
        abilities.shield.active = true;
    }
    if (event.code == 'KeyV' && unlocks.abilities.freeze && abilities.freeze.cooldown >= abilities.freeze.reload) {
        abilities.freeze.active = true;
    }
});
document.addEventListener('keyup', function (event) {
    if (event.code == 'Space') player.weapon.fire = false;
});

//click detection
document.addEventListener('mousedown', function (event) {
    player.accelerate = true;
});
document.addEventListener('mouseup', function (event) {
    player.accelerate = false;
});

//mouse x and y positions
document.addEventListener('mousemove', function (event) {
    mouse.x = event.clientX - canvas.offsetLeft;
    mouse.y = event.clientY - canvas.offsetTop;
});
setInterval(Main, 20);