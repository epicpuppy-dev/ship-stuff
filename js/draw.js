function TickProjectile() {
    ctx.strokeStyle = 'green';
    for (p = 0; p < projectiles.length; p++) {
        out = projectiles[p].tick();
        if (out) {
            projectiles.splice(p, 1);
            p--;
        } else {
            projectiles[p].draw();
        }
    }
}
function TickEnemyProjectile() {
    ctx.strokeStyle = 'red';
    for (ep = 0; ep < enemyProjectiles.length; ep++) {
        out = enemyProjectiles[ep].tick();
        if (out) {
            enemyProjectiles.splice(ep, 1);
            ep--;
        } else {
            enemyProjectiles[ep].draw();
        }
    }
}
function TickAsteroid() {
    for (a = 0; a < asteroids.length; a++) {
        out = asteroids[a].tick(projectiles);
        if (out) {
            asteroids.splice(a, 1);
            a--;
        } else {
            asteroids[a].draw();
        }
    }
}
function TickEnemy() {
    for (e = 0; e < enemies.length; e++) {
        out = enemies[e].tick(projectiles);
        if (out == 'e') {
            scene = 'e';
        } else if (out) {
            enemies.splice(e, 1);
            e--;
        } else {
            enemies[e].draw();
        }
    }
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
    ctx.fillStyle = 'dodgerblue';
    ctx.fill(object);
}
function DrawUI() {
    ctx.font = '24px \'Press Start 2P\'';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#fff9';
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    //get text width
    const scoreWidth = ctx.measureText(Math.round(player.score).toLocaleString("en-US")).width;
    ctx.font = '16px \'Press Start 2P\'';
    const levelWidth = ctx.measureText("Lv " + player.level.toFixed(0)).width;
    //draw xp box
    ctx.fillRect(8, 8, 250, 16);
    //draw hp box
    ctx.fillRect(8, 32, 250, 16);
    //draw reload box
    if (unlocks.weapon) ctx.fillRect(8, 56, 150, 10);
    if (unlocks.abilities.dash) ctx.fillRect(8, 74, 150, 10);
    if (unlocks.abilities.burst) ctx.fillRect(8, 92, 150, 10);
    if (unlocks.abilities.shield) ctx.fillRect(8, 110, 150, 10);
    if (unlocks.abilities.freeze) ctx.fillRect(8, 128, 150, 10);
    //draw score box
    ctx.fillRect(WIDTH - 24 - scoreWidth, 8, scoreWidth + 16, 36);
    ctx.strokeRect(WIDTH - 24 - scoreWidth, 8, scoreWidth + 16, 36);
    //draw level box
    ctx.fillRect(WIDTH - 24 - levelWidth, 54, levelWidth + 16, 28);
    ctx.strokeRect(WIDTH - 24 - levelWidth, 54, levelWidth + 16, 28);
    ctx.fillStyle = '#1e90ff88';
    //draw xp bar
    ctx.fillRect(8, 8, 250 * Math.min((player.xp / player.xpreq), 1), 16);
    ctx.strokeRect(8, 8, 250, 16);
    ctx.fillStyle = '#1060ffff';
    ctx.fillText("Lv " + player.level.toFixed(0), WIDTH - 16 - levelWidth, 60);
    ctx.fillStyle = '#ff101088';
    //draw hp bar
    ctx.fillRect(8, 32, 250 * (player.health / player.maxhealth), 16);
    ctx.strokeRect(8, 32, 250, 16);
    //draw reload bar
    if (unlocks.weapon) {
        ctx.fillStyle = '#33ff3388';
        ctx.fillRect(8, 56, 150 * Math.min((player.weapon.cooldown / (1 / player.weapon.rate * 50)), 1), 10);
        ctx.strokeRect(8, 56, 150, 10);
    }
    if (unlocks.abilities.dash) {
        ctx.fillStyle = '#aa33ff88';
        ctx.fillRect(8, 74, 150 * Math.min(abilities.dash.cooldown / abilities.dash.reload, 1), 10);
        if (abilities.dash.cooldown > abilities.dash.reload) {
            ctx.fillStyle = '#ff33ff88';
            ctx.fillRect(8, 74, 150 * Math.min((abilities.dash.cooldown - abilities.dash.reload) / abilities.dash.reload, 1), 10);
        }
        if (abilities.dash.cooldown > abilities.dash.reload * 2) {
            ctx.fillStyle = '#ff338888';
            ctx.fillRect(8, 74, 150 * Math.min((abilities.dash.cooldown - abilities.dash.reload * 2) / abilities.dash.reload, 1), 10);
        }
        ctx.strokeRect(8, 74, 150, 10);
    }
    if (unlocks.abilities.burst) {
        ctx.fillStyle = '#ffaa3388';
        ctx.fillRect(8, 92, 150 * Math.min(abilities.burst.cooldown / abilities.burst.reload, 1), 10);
        if (abilities.burst.cooldown > abilities.burst.reload) {
            ctx.fillStyle = '#ffff3388';
            ctx.fillRect(8, 92, 150 * Math.min((abilities.burst.cooldown - abilities.burst.reload) / abilities.burst.reload, 1), 10);
        }
        if (abilities.burst.cooldown > abilities.burst.reload * 2) {
            ctx.fillStyle = '#88ff3388';
            ctx.fillRect(8, 92, 150 * Math.min((abilities.burst.cooldown - abilities.burst.reload * 2) / abilities.burst.reload, 1), 10);
        }
        ctx.strokeRect(8, 92, 150, 10);
    }
    if (unlocks.abilities.shield) {
        ctx.fillStyle = '#33aaff88';
        ctx.fillRect(8, 110, 150 * Math.min(abilities.shield.cooldown / abilities.shield.reload, 1), 10);
        ctx.strokeRect(8, 110, 150, 10);
    }
    if (unlocks.abilities.freeze) {
        ctx.fillStyle = '#66ddff88';
        ctx.fillRect(8, 128, 150 * Math.min(abilities.freeze.cooldown / abilities.freeze.reload, 1), 10);
        ctx.strokeRect(8, 128, 150, 10);
    }
    ctx.fillStyle = 'black';
    //draw text
    ctx.font = '24px \'Press Start 2P\'';
    ctx.fillText(Math.round(player.score).toLocaleString("en-US"), WIDTH - 16 - scoreWidth, 16);
    DrawShop();
}
function DrawShop() {
    y = 94;
    ctx.fillStyle = "#ddda";
    if (shop.selected == 0) ctx.fillStyle = "#dfda";
    ctx.strokeStyle = "#555";
    ctx.font = '16px \'Press Start 2P\'';
    ctx.textAlign = "right";
    //Stats upgrade
    ctx.fillRect(WIDTH - shop.width - 24 + ShopAnimation(shop.width + 32, shop.animation), y, shop.width + 16, 124);
    ctx.strokeRect(WIDTH - shop.width - 24 + ShopAnimation(shop.width + 32, shop.animation), y, shop.width + 16, 124);
    y += 8;
    //Stats upgrade - text
    ctx.fillStyle = "#000";
    ctx.fillText("Ship Upgrade [A]", WIDTH - 12 + ShopAnimation(shop.width + 32, shop.animation), y);
    y += 20;
    ctx.font = '8px \'Press Start 2P\'';
    stats = ["Health", "Regen", "Acceleration", "Max Speed", "Rotation Speed", "Fire Rate", "Laser Speed", "Damage"];
    for (i = 0; i < 8; i++) {
        ctx.fillStyle = "#000";
        ctx.fillText(stats[i] + " +" + Math.round(shop.stat[i] * 100) + "%", WIDTH - 12 + ShopAnimation(shop.width + 32, shop.animation), y);
        y += 12;
    }
    y += 8;
    keys = ["S", "D", "F"];
    key = 0;
    for (const item of shop.listing) {
        ctx.fillStyle = "#ddda";
        ctx.strokeStyle = "#555";
        if (shop.selected == key + 1) ctx.fillStyle = "#dfda";
        ctx.fillRect(WIDTH - shop.width - 24 + ShopAnimation(shop.width + 32, shop.animation), y, shop.width + 16, item.height);
        ctx.strokeRect(WIDTH - shop.width - 24 + ShopAnimation(shop.width + 32, shop.animation), y, shop.width + 16, item.height);
        y += 8;
        ctx.fillStyle = "#000";
        ctx.font = '16px \'Press Start 2P\'';
        ctx.fillText(item.display + " [" + keys[key] + "]", WIDTH - 12 + ShopAnimation(shop.width + 32, shop.animation), y);
        y += 20;
        ctx.font = '8px \'Press Start 2P\'';
        for (const line of item.desc) {
            ctx.fillText(line, WIDTH - 12 + ShopAnimation(shop.width + 32, shop.animation), y);
            y += 12;
        }
        if (Object.keys(item.stats).length !== 0) y += 8;
        for (const stat in item.stats) {
            if (item.stats[stat][1] == "m") {
                ctx.fillStyle = "#000";
                ctx.fillText(shop.stats[stat] + " +" + Math.round(item.stats[stat][0] * 100) + "%", WIDTH - 12 + ShopAnimation(shop.width + 32, shop.animation), y);
            } else if (item.stats[stat][1] == "a") {
                ctx.fillStyle = "#000";
                ctx.fillText(shop.stats[stat] + " +" + Math.round(item.stats[stat][0]), WIDTH - 12 + ShopAnimation(shop.width + 32, shop.animation), y);
            }
            y += 12;
        }
        y += 8;
        key += 1;
    }
    ctx.textAlign = "left";
}

function DrawGameOver() {
    ctx.fillStyle = '#fee';
    ctx.font = '40px \'Press Start 2P\'';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', Math.round(WIDTH / 2), Math.round(HEIGHT / 2) - 100);
    ctx.font = '24px \'Press Start 2P\'';
    ctx.fillText('SCORE: ' + Math.round(player.score).toLocaleString("en-US"), Math.round(WIDTH / 2), Math.round(HEIGHT / 2) + 50);
    ctx.textAlign = 'left';
}