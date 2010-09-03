$.fn.olives = function(dots, options) {

    var settings = $.extend({}, $.fn.olives.defaults, options);


    return $(this).each(function() {
        var c = canvas(this);
        var center = {x:$(this).width() / 2 , y:$(this).height() / 2 }

        var newDots = [];
        $.each(dots, function(i, dot) {
            var offset = {
                x: ((Math.random()*10 - 5) ),
                y: ((Math.random()*10 - 5) )
            };

            var newDot = $.extend(dot, center);
            while (intersects(newDot, newDots)) {
                newDot.x += offset.x;
                newDot.y += offset.y;
            }
            newDots.push(newDot);
        });

        for (var i = 0; i < dots.length; i++) {
            c.circle(newDots[i], newDots[i].color);
        }
    });
};

$.fn.olives.defaults = {

};

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

$(function() {

    var dots = [];
    var limit = 1 + Math.random()*10;
    for (var i = 0; i < limit; i++) {
        dots.push({radius: Math.random()*80 + 3, color: '#' + Math.round((Math.random() * 1000000000)).toString(16).substr(0,6) });
    }

    $('#graph').css({
        height: 400,
        width: 400,
        border: '5px solid #333'
    }).olives(dots);


});

