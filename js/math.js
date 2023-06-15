Math.toRadians = function (degrees) {
    return degrees * (Math.PI / 180);
};
Math.toDegrees = function (radians) {
    return radians * (180 / Math.PI);
};
Math.sind = function (degrees) {
    return Math.sin(Math.toRadians(degrees));
};
Math.cosd = function (degrees) {
    return Math.cos(Math.toRadians(degrees));
};
Math.tand = function (degrees) {
    return Math.tan(Math.toRadians(degrees));
};