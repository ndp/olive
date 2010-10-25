var canvas = function(element) {
    var ctx = element.getContext('2d');
    return {
        context: function() {
            return ctx;
        },
        circle: function(c, fillStyle) {
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2, true); // Outer circle
            ctx.fillStyle = fillStyle;
            ctx.strokeStyle = "#ffffff";
            ctx.fill();
            ctx.stroke();
        },
        clearRect: function(x,y,w,h) {
          ctx.clearRect(x,y,w,h);
        }
    };
};


function circles_intersect(circleA, circleB) {// returns true if circles are overlapping
    var dx = circleB.x - circleA.x; // get change in x
    var dy = circleB.y - circleA.y; // get change in y
    var dist = Math.sqrt(dx * dx + dy * dy); // find distance between centers of circles
    // if the distance between the centers of the circles is less than the combined
    // radii, then the circles must be overlapping
    return circleA.radius + circleB.radius > dist;
}

function intersects(circleA, circles) {
    for (var i = 0; i < circles.length; i++) {
        if (circles[i].x &&
                circles_intersect(circleA, circles[i])) {
            return true;
        }
    }
    return false;
}
