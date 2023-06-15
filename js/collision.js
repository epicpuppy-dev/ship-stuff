const collide = {};


function box (p1, p2) {
    if (p1.x < p2.x + p2.width &&
        p1.x + p1.width > p2.x &&
        p1.y < p2.y + p2.height &&
        p1.height + p1.y > p2.y) {
            return true;
        }
    return false;
}

collide.box = box;

collide.sat = {};

function satpoly (p1, c1, d1, p2, c2, d2) {
    var points1 = [];
    for (const point of p1) {
        points1.push(new SAT.V(point[0], point[1]));
    }
    var poly1 = new SAT.Polygon(new SAT.V(c1[0], c1[1]), points1, d1);
    var points2 = [];
    for (const point of p2) {
        points2.push(new SAT.V(point[0], point[1]));
    }
    var poly2 = new SAT.Polygon(new SAT.V(c2[0], c2[1]), points2, d2);
    var collided = SAT.testPolygonPolygon(poly1, poly2);
    return collided;
}

collide.sat.poly = satpoly;

function satpoint (o, c, p, d=0) {
    var points = [];
    for (const point of o) {
        points.push(new SAT.V(point[0], point[1]));
    }
    var poly = new SAT.Polygon(new SAT.V(c[0], c[1]), points, d);
    var collided = SAT.pointInPolygon(new SAT.V(p[0], p[1]), poly);
    return collided;
}

collide.sat.point = satpoint;