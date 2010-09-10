/**
 * Canvas abstraction implementation
 * see http://svgopen.org/2009/papers/54-SVG_vs_Canvas_on_Trivial_Drawing_Application/
 */
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


function circlesIntersect(circleA, circleB) {// returns true if circles are overlapping
  var dx = circleB.x - circleA.x;
  var dy = circleB.y - circleA.y;
  var dist = Math.sqrt(dx * dx + dy * dy);
  // if the distance between the centers of the circles is less than the combined
  // radii, then the circles must be overlapping
  return circleA.radius + circleB.radius > dist;
}

function circleIntersectsAny(circleA, circles) {
  for (var i = 0; i < circles.length; i++) {
    if (circles[i].x &&
            circlesIntersect(circleA, circles[i])) {
      return true;
    }
  }
  return false;
}

function circleWithinRectangle(circle, r) {
  return (circle.x - circle.radius) > r.left &&
          (circle.y - circle.radius) > r.top &&
          (circle.x + circle.radius) < r.right &&
          (circle.y + circle.radius) < r.bottom;
}


/**
 * Create or update olives visualization.
 * @param dots
 * @param options
 */
$.fn.olives = function(dots, options) {

  var settings = $.extend({}, $.fn.olives.defaults, options);

  return $(this).each(function() {
    var c = canvas(this);
    var bounds = {top: 0, left: 0, bottom: $(this).height(), right: $(this).width()};
    var center = {x:$(this).width() / 2 , y:$(this).height() / 2 };

    function placeDot(dot, newDots) {
      var offset = {
        x: ((Math.random() * 10 - 5) ),
        y: ((Math.random() * 10 - 5) )
      };

      var newDot = $.extend(dot, center);
      while (circleIntersectsAny(newDot, newDots)) {
        newDot.x += offset.x;
        newDot.y += offset.y;
      }
      return newDot;
    }

    var newDots = [];
    $.each(dots, function(i, dot) {
      var newDot = placeDot(dot, newDots);
      var attempts = 1;
      while (!circleWithinRectangle(newDot, bounds) && attempts < settings.maxAttempts) {
        newDot = placeDot(dot, newDots);
        attempts++;
      }

      newDots.push(newDot);
    });

    for (var i = 0; i < dots.length; i++) {
      c.circle(newDots[i], newDots[i].color);
    }
  });
};

$.fn.olives.defaults = {
    maxAttempts: 10
};

/**
 *
 */


$(function() {

  var dots = [];
  var limit = 1 + Math.random() * 10;
  for (var i = 0; i < limit; i++) {
    dots.push({
      key: '' + i,
      radius: Math.random() * 80 + 3,
      color: '#' + Math.round((Math.random() * 1000000000)).toString(16).substr(0, 6) }
            );
  }

  $('#graph').css({
    border: '5px solid #333'
  }).olives(dots);


});

