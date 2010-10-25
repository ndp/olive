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

