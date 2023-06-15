const generator = {};
generator.asteroid = [
    [7,-23],
    [-7,-23],
    [-19,-14],
    [-24,0],
    [-19,14],
    [-7,23],
    [7,23],
    [19,14],
    [24,0],
    [19,-14]
];
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
        ctx.stroke(path);
    }
}
class projectileEnemy extends projectile {
    constructor (v, x, y, direction, d, damage) {
        super(v, x, y, direction, d);
        this.damage = damage;
    }
}
class enemy {
    constructor (health, damage, rotspeed, acceleration, maxspeed, color) {
        const spawn = Math.floor(Math.random() * 4);
        switch (spawn) {
            case 0:
                this.x = -30;
                this.y = Math.floor(Math.random() * (HEIGHT + 60) - 30);
                this.direction = Math.floor(Math.random() * 180);
                break;
            case 1:
                this.y = -30;
                this.x = Math.floor(Math.random() * (WIDTH + 60) - 30);
                this.direction = Math.floor(Math.random() * 180 + 90);
                break;
            case 2:
                this.x = WIDTH + 30;
                this.y = Math.floor(Math.random() * (HEIGHT + 60) - 30);
                this.direction = Math.floor(Math.random() * 180 + 180);
                break;
            case 3:
                this.y = HEIGHT + 30;
                this.x = Math.floor(Math.random() * (WIDTH + 60) - 30);
                this.direction = Math.floor(Math.random() * 180 + 270);
        }
        this.health = health;
        this.damage = damage;
        const delta = getXY(this.direction, maxspeed / 50);
        this.vx = delta[0];
        this.vy = delta[1];
        this.rotspeed = rotspeed;
        this.accel = acceleration;
        this.maxspeed = maxspeed;
        this.color = color;
        this.left = false;
        this.right = false;
    }
}
class drifter extends enemy {
    tick (projectiles) {
        if (this.target === undefined) {
            this.target = [Math.floor(Math.random() * WIDTH), Math.floor(Math.random() * HEIGHT)];
        }
        const targetDirection = Math.toDegrees(Math.atan2(this.target[1] - this.y, this.target[0] - this.x)) + 90;
        var directionDiff = parseFloat((targetDirection - this.direction).toFixed(2));
        if (directionDiff > 180) directionDiff -= 360;
        else if (directionDiff < -180) directionDiff += 360;
        if (directionDiff < 0) this.left = true;
        else this.left = false;
        if (directionDiff > 0) this.right = true;
        else this.right = false;
        if (Math.abs(directionDiff) < this.rotspeed) {
            this.direction = targetDirection;
        } else {
            if (this.right) this.direction += this.rotspeed;
            if (this.left) this.direction -= this.rotspeed;
            if (this.direction >= 360) {
                this.direction -= 360;
            } else if (this.direction < 0) {
                this.direction += 360;
            }
        }
        const delta = getXY(this.direction, this.accel);
        if (
            !((this.vx > (delta[0] / this.accel) * (this.maxspeed / 50) && this.vx > 0) ||
            (this.vx < (delta[0] / this.accel) * (this.maxspeed / 50) && this.vx < 0))
        ) this.vx += delta[0];
        if (
            !((this.vy > (delta[1] / this.accel) * (this.maxspeed / 50) && this.vy > 0) ||
            (this.vy < (delta[1] / this.accel) * (this.maxspeed / 50) && this.vy < 0))
        ) this.vy += delta[1];
        if (this.vx >
            (delta[0] / this.accel) * (this.maxspeed / 50) && this.vx > 0) this.vx = Math.max(this.vx - this.accel / DRIFT, 0);
        if (this.vx <
            (delta[0] / this.accel) * (this.maxspeed / 50) && this.vx < 0) this.vx = Math.min(this.vx + this.accel / DRIFT, 0);
        if (this.vy >
            (delta[1] / this.accel) * (this.maxspeed / 50) && this.vy > 0) this.vy = Math.max(this.vy - this.accel / DRIFT, 0);
        if (this.vy <
            (delta[1] / this.accel) * (this.maxspeed / 50) && this.vy < 0) this.vy = Math.min(this.vy + this.accel / DRIFT, 0);
        if (!abilities.freeze.active) {
            this.x += this.vx;
            this.y += this.vy;
        }
        if (this.x > player.x - 10 && this.x < player.x + 30) {
            var playercollide = collide.sat.poly([[-15, 15], [-12, -9], [0, -15], [12, -9], [15, 15]],
            [this.x, this.y], this.direction, [[10, 0], [20, 20], [0, 20]], [player.x, player.y], player.direction);
            if (playercollide) {
                if (!abilities.shield.active) {
                    player.health -= this.damage;
                    audio.hurt.play();
                }
                if (player.health <= 0) return 'e';
                return true;
            }
        }
        for (p = 0; p < projectiles.length; p++) {
            if (projectiles[p].x > this.x - 25 && projectiles[p].x < this.x + 25) {
                var collided = collide.sat.point([[-15, 15], [-12, -9], [0, -15], [12, -9], [15, 15]],
                [this.x, this.y], [projectiles[p].x, projectiles[p].y], this.direction);
                if (collided) {
                    this.health -= player.weapon.damage;
                    projectiles.splice(p, 1);
                    if (this.health <= 0) {
                        player.GainXP(3 + (difficulty));
                        player.GainScore(50 + 8 * difficulty);
                        audio.destroy.play();
                        return true;
                    }
                }
            }
        }
        if (this.x > this.target[0] - 10 && this.x < this.target[0] + 10 && this.y > this.target[1] - 10 && this.y < this.target[1] + 10) {
            this.target = undefined;
        }
        return false;
    }
    draw () {
        var path = new Path2D();
        path.moveTo(0, 6);
        path.lineTo(-15, 15);
        path.lineTo(-12, -9);
        path.lineTo(0, -15);
        path.lineTo(12, -9);
        path.lineTo(15, 15);
        path.lineTo(0, 6);
        var translation = new DOMMatrix([1,0,0,1,0,0])
        .translateSelf(this.x, this.y)
        .rotateSelf(this.direction);
        var object = new Path2D();
        object.addPath(path, translation);
        ctx.fillStyle = this.color;
        ctx.fill(object);
    }
}
class fighter extends enemy {
    tick (projectiles) {
        const targetDirection = Math.toDegrees(Math.atan2(player.y + 10 - this.y, player.x + 10 - this.x)) + 90;
        var directionDiff = targetDirection - this.direction;
        if (directionDiff > 180) directionDiff -= 360;
        else if (directionDiff < -180) directionDiff += 360;
        if (directionDiff < 0) this.left = true;
        else this.left = false;
        if (directionDiff > 0) this.right = true;
        else this.right = false;
        if (!abilities.freeze.active) {
            if (Math.abs(directionDiff) < this.rotspeed) {
                this.direction = targetDirection;
            } else {
                if (this.right) this.direction += this.rotspeed;
                if (this.left) this.direction -= this.rotspeed;
                if (this.direction >= 360) {
                    this.direction -= 360;
                } else if (this.direction < 0) {
                    this.direction += 360;
                }
            }
        }
        const delta = getXY(this.direction, this.accel);
        if (
            !((this.vx > (delta[0] / this.accel) * (this.maxspeed / 50) && this.vx > 0) ||
            (this.vx < (delta[0] / this.accel) * (this.maxspeed / 50) && this.vx < 0))
        ) this.vx += delta[0];
        if (
            !((this.vy > (delta[1] / this.accel) * (this.maxspeed / 50) && this.vy > 0) ||
            (this.vy < (delta[1] / this.accel) * (this.maxspeed / 50) && this.vy < 0))
        ) this.vy += delta[1];
        if (this.vx >
            (delta[0] / this.accel) * (this.maxspeed / 50) && this.vx > 0) this.vx = Math.max(this.vx - this.accel / DRIFT, 0);
        if (this.vx <
            (delta[0] / this.accel) * (this.maxspeed / 50) && this.vx < 0) this.vx = Math.min(this.vx + this.accel / DRIFT, 0);
        if (this.vy >
            (delta[1] / this.accel) * (this.maxspeed / 50) && this.vy > 0) this.vy = Math.max(this.vy - this.accel / DRIFT, 0);
        if (this.vy <
            (delta[1] / this.accel) * (this.maxspeed / 50) && this.vy < 0) this.vy = Math.min(this.vy + this.accel / DRIFT, 0);
        if (!abilities.freeze.active) {
            this.x += this.vx;
            this.y += this.vy;
        }
        if (this.x > player.x - 10 && this.x < player.x + 30) {
            var playercollide = collide.sat.poly([[15, 15], [-15, 15], [0, -15]],
            [this.x, this.y], this.direction, [[10, 0], [20, 20], [0, 20]], [player.x, player.y], player.direction);
            if (playercollide) {
                if (!abilities.shield.active) {
                    player.health -= this.damage;
                    audio.hurt.play();
                }
                if (player.health <= 0) return 'e';
                return true;
            }
        }
        for (p = 0; p < projectiles.length; p++) {
            if (projectiles[p].x > this.x - 25 && projectiles[p].x < this.x + 25) {
                var collided = collide.sat.point([[15, 15], [-15, 15], [0, -15]], [this.x, this.y], [projectiles[p].x, projectiles[p].y], this.direction);
                if (collided) {
                    this.health -= player.weapon.damage;
                    projectiles.splice(p, 1);
                    if (this.health <= 0) {
                        player.GainXP(4 + (1.5 * difficulty));
                        player.GainScore(65 + 10 * difficulty);
                        audio.destroy.play();
                        return true;
                    }
                }
            }
        }
        return false;
    }
    draw () {
        var path = new Path2D();
        path.moveTo(0, -15);
        path.lineTo(15, 15);
        path.lineTo(0, 5);
        path.lineTo(-15, 15);
        path.lineTo(0, -15);
        var translation = new DOMMatrix([1,0,0,1,0,0])
        .translateSelf(this.x, this.y)
        .rotateSelf(this.direction);
        var object = new Path2D();
        object.addPath(path, translation);
        ctx.fillStyle = this.color;
        ctx.fill(object);
    }
}
class shooter extends enemy {
    tick (projectiles) {
        if (this.cooldown === undefined ) {
            this.cooldown = 500;
        }
        if (this.target === undefined) {
            this.target = [Math.floor(Math.random() * WIDTH), Math.floor(Math.random() * HEIGHT)];
            this.mode = 'move';
        }
        var targetDirection = 0;
        if (this.mode == 'move') {
            targetDirection = Math.toDegrees(Math.atan2(this.target[1] - this.y, this.target[0] - this.x)) + 90;
        } else {
            targetDirection = Math.toDegrees(Math.atan2(player.y + 10 - this.y, player.x + 10 - this.x)) + 90;
        }
        var directionDiff = parseFloat((targetDirection - this.direction).toFixed(2));
        if (directionDiff > 180) directionDiff -= 360;
        else if (directionDiff < -180) directionDiff += 360;
        if (directionDiff < 0) this.left = true;
        else this.left = false;
        if (directionDiff > 0) this.right = true;
        else this.right = false;
        if (Math.abs(directionDiff) < this.rotspeed) {
            this.direction = targetDirection;
        } else {
            if (this.right) this.direction += this.rotspeed;
            if (this.left) this.direction -= this.rotspeed;
            if (this.direction >= 360) {
                this.direction -= 360;
            } else if (this.direction < 0) {
                this.direction += 360;
            }
        }
        var delta = [0, 0];
        if (this.mode == 'move') {
            delta = getXY(this.direction, this.accel);
        }
        if (
            !((this.vx > (delta[0] / this.accel) * (this.maxspeed / 50) && this.vx > 0) ||
            (this.vx < (delta[0] / this.accel) * (this.maxspeed / 50) && this.vx < 0))
        ) this.vx += delta[0];
        if (
            !((this.vy > (delta[1] / this.accel) * (this.maxspeed / 50) && this.vy > 0) ||
            (this.vy < (delta[1] / this.accel) * (this.maxspeed / 50) && this.vy < 0))
        ) this.vy += delta[1];
        if (this.vx >
            (delta[0] / this.accel) * (this.maxspeed / 50) && this.vx > 0) this.vx = Math.max(this.vx - this.accel / DRIFT, 0);
        if (this.vx <
            (delta[0] / this.accel) * (this.maxspeed / 50) && this.vx < 0) this.vx = Math.min(this.vx + this.accel / DRIFT, 0);
        if (this.vy >
            (delta[1] / this.accel) * (this.maxspeed / 50) && this.vy > 0) this.vy = Math.max(this.vy - this.accel / DRIFT, 0);
        if (this.vy <
            (delta[1] / this.accel) * (this.maxspeed / 50) && this.vy < 0) this.vy = Math.min(this.vy + this.accel / DRIFT, 0);
        if (!abilities.freeze.active) {
            this.x += this.vx;
            this.y += this.vy;
        }
        if (this.x > player.x - 10 && this.x < player.x + 30) {
            var playercollide = collide.sat.poly([[15, 15], [-15, 15], [0, -15]],
            [this.x, this.y], this.direction, [[10, 0], [20, 20], [0, 20]], [player.x, player.y], player.direction);
            if (playercollide) {
                if (!abilities.shield.active) {
                    player.health -= this.damage;
                    audio.hurt.play();
                }
                if (player.health <= 0) return 'e';
                return true;
            }
        }
        for (p = 0; p < projectiles.length; p++) {
            if (projectiles[p].x > this.x - 25 && projectiles[p].x < this.x + 25) {
                var collided = collide.sat.point([[15, 15], [-15, 15], [0, -15]],
                [this.x, this.y], [projectiles[p].x, projectiles[p].y], this.direction);
                if (collided) {
                    this.health -= player.weapon.damage;
                    projectiles.splice(p, 1);
                    if (this.health <= 0) {
                        player.GainXP(5 + (1.5 * difficulty));
                        player.GainScore(75 + 12 * difficulty);
                        audio.destroy.play();
                        return true;
                    }
                }
            }
        }
        if (this.mode == 'fire' && this.cooldown <= 0) {
            enemyProjectiles.push(
                new projectileEnemy(
                    getXY(this.direction, 4),
                    this.x, this.y, this.direction, getXY(this.direction, 12), this.damage)
            );
            audio.shoot.play();
            this.cooldown = 100;
            }
        if (this.x > this.target[0] - 10 && this.x < this.target[0] + 10 && this.y > this.target[1] - 10 && this.y < this.target[1] + 10) {
            this.mode = 'fire';
        }
        this.cooldown--;
        return false;
    }
    draw () {
        var path = new Path2D();
        path.moveTo(0, -15);
        path.lineTo(15, 15);
        path.lineTo(0, 5);
        path.lineTo(-15, 15);
        path.lineTo(0, -15);
        var translation = new DOMMatrix([1,0,0,1,0,0])
        .translateSelf(this.x, this.y)
        .rotateSelf(this.direction);
        var object = new Path2D();
        object.addPath(path, translation);
        ctx.fillStyle = this.color;
        ctx.fill(object);
        var pathWeapon = new Path2D();
        pathWeapon.moveTo(-5, 0);
        pathWeapon.lineTo(0, -10);
        pathWeapon.lineTo(5, 0);
        var weapon = new Path2D();
        weapon.addPath(pathWeapon, translation);
        ctx.fillStyle = 'rgb(160, 0, 0)';
        ctx.fill(weapon);
    }
}
class asteroid {
    constructor () {
        const points = [];
        for (var p = 0; p < generator.asteroid.length; p++) {
            const offset = JSON.parse(JSON.stringify(generator.asteroid[p]));
            offset[0] += Math.floor(Math.random() * 7 - 3);
            offset[1] += Math.floor(Math.random() * 7 - 3);
            points.push(offset);
        }
        const spawn = Math.floor(Math.random() * 4);
        switch (spawn) {
            case 0:
                this.x = -30;
                this.y = Math.floor(Math.random() * (HEIGHT + 60) - 30);
                this.direction = Math.floor(Math.random() * 180);
                break;
            case 1:
                this.y = -30;
                this.x = Math.floor(Math.random() * (WIDTH + 60) - 30);
                this.direction = Math.floor(Math.random() * 180 + 90);
                break;
            case 2:
                this.x = WIDTH + 30;
                this.y = Math.floor(Math.random() * (HEIGHT + 60) - 30);
                this.direction = Math.floor(Math.random() * 180 + 180);
                break;
            case 3:
                this.y = HEIGHT + 30;
                this.x = Math.floor(Math.random() * (WIDTH + 60) - 30);
                this.direction = Math.floor(Math.random() * 180 + 270);
        }
        if (this.direction >= 360) this.direction -= 360;
        this.points = convexhull.makeHull(JSON.parse(JSON.stringify(points)));
        this.points.splice(Math.ceil(this.points.length / 2) + 1, this.points.length);
        this.points.push(this.points[0]);
        this.rotation = Math.floor(Math.random() * 360);
        const color = Math.floor(Math.random() * 100 + 75);
        this.color = `rgb(${color},${color},${color})`;
        const velocity = getXY(this.direction, Math.floor(Math.random() * 15 + 2) / 10);
        this.vx = velocity[0];
        this.vy = velocity[1];
        this.health = (difficulty) + Math.floor(Math.random() * 10);
    }
    draw () {
        const path = new Path2D();
        path.moveTo(this.points[0][0], this.points[0][1]);
        for (var i = 1; i < this.points.length; i++) {
            path.lineTo(this.points[i][0], this.points[i][1]);
        }
        const translation = new DOMMatrix([1,0,0,1,0,0])
        .translateSelf(this.x, this.y)
        .rotateSelf(this.rotation);
        const object = new Path2D();
        object.addPath(path, translation);
        ctx.fillStyle = this.color;
        ctx.fill(object);
    }
    tick (projectiles) {
        var collided;
        if (this.x < -50 || this.x > WIDTH + 50 || this.y < -50 || this.y > HEIGHT + 50) {
            return true;
        }
        if (!abilities.freeze.active) {
            this.x += this.vx;
            this.y += this.vy;
        }
        for (p = 0; p < projectiles.length; p++) {
            if (projectiles[p].x > this.x - 25 && projectiles[p].x < this.x + 25) {
                collided = collide.sat.point(this.points, [this.x, this.y], [projectiles[p].x, projectiles[p].y], this.direction);
                if (collided) {
                    this.health -= player.weapon.damage;
                    projectiles.splice(p, 1);
                    if (this.health <= 0) {
                        player.GainXP(1 + (difficulty / 2));
                        player.GainScore(25 + 5 * difficulty);
                        audio.destroy.play();
                        return true;
                    }
                }
            }
        }
        return false;
    }
}