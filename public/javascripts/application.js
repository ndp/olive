/**
 * Canvas abstraction implementation
 * see http://svgopen.org/2009/papers/54-SVG_vs_Canvas_on_Trivial_Drawing_Application/
 */
var canvasWrapper = function(element) {
  var ctx = element.getContext('2d');
  return {
    context: function() {
      return ctx;
    },
    drawCircle: function(c, fillStyle) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2, true); // Outer circle
      ctx.fillStyle = fillStyle;
      ctx.strokeStyle = "#ffffff";
      ctx.fill();
      ctx.stroke();
    },
    clear: function() {
      ctx.clearRect(0,0,element.width, element.height);
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
    var canvas = canvasWrapper(this);
    var center = {x:$(this).width() / 2 , y:$(this).height() / 2 };

    function assignOffset(dot) {
      dot.offset = {
        x: ((Math.random() * 10 - 5) ),
        y: ((Math.random() * 10 - 5) )
      };
    }

    function placeDot(dot, newDots) {
      var newDot = $.extend(dot, center);
      while (circleIntersectsAny(newDot, newDots)) {
        newDot.x += dot.offset.x;
        newDot.y += dot.offset.y;
      }
      return newDot;
    }

    // Clone an array of objects
    function cloneDots(dots) {
      var newDots = [];
      if (!dots) return null;
      for (var i = 0; i < dots.length; i++) {
        newDots[i] = $.extend({}, dots[i]);
      }
      return newDots;
    }

    function moveDots(oldDots, newDots) {
      if (oldDots) {
        canvas.clear();
//        for (var i = 0; i < oldDots.length; i++) {
//          if (oldDots[i]) {
//            canvas.drawCircle(oldDots[i], '#fff');
//          }
//        }
      }
      for (var j = 0; j < newDots.length; j++) {
        canvas.drawCircle(newDots[j], newDots[j].color);
      }
    }

    function animateDots(oldDots, newDots) {
      if (oldDots) {
        var steps = 20;
        var prevDots = cloneDots(oldDots);
        var nextDots = cloneDots(oldDots);

        var step = 0;

        function stepForward() {
          step++;
          // nudge next dots forward
          for (var j = 0; j < nextDots.length; j++) {
            nextDots[j].radius += (newDots[j].radius - oldDots[j].radius) / steps;
            nextDots[j].x += (newDots[j].x - oldDots[j].x) / steps;
            nextDots[j].y += (newDots[j].y - oldDots[j].y) / steps;
          }
          moveDots(prevDots, nextDots);
          prevDots = nextDots;
          if (step == steps) {
            moveDots(nextDots, newDots);
          } else {
            setTimeout(stepForward, 15);
          }
        }

        setTimeout(stepForward, 20);

      } else {
        moveDots(null, newDots);
      }
    }


    var bounds = {top: 0, left: 0, bottom: $(this).height(), right: $(this).width()};

    $.each(dots, function(i, dot) {
      if (!dot.offset) assignOffset(dot);
    });

    var newDots = [];
    $.each(dots, function(i, dot) {
      var newDot = placeDot(dot, newDots);
      var attempts = 1;
      while (!circleWithinRectangle(newDot, bounds) && attempts < settings.maxAttempts) {
        assignOffset(dot);
        newDot = placeDot(dot, newDots);
        attempts++;
      }

      newDots.push(newDot);
    });

    animateDots(this.dots, newDots);

    // remember it for next time
    this.dots = cloneDots(newDots);
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
  var limit = Math.floor(1 + Math.random() * 20);
  for (var i = 0; i < limit; i++) {
    dots.push({
      key: '' + i,
      color: '#' + Math.round((Math.random() * 1000000000)).toString(16).substr(0, 6) }
            );
  }

  function randomValues(dots) {
    for (var i = 0; i < dots.length; i++) {
      dots[i]['value'] = Math.random() * 20;
    }
  }

  /**
   * Dots have values expressed as numbers, but we need to make the
   * areas proportional. Therefore we take the sqrt.
   * We also want to make smaller data sets take up as much
   * room as larger ones.
   * @param dots
   */
  function normalize(dots) {
    var total = 0;
    for (var i = 0; i < dots.length; i++) {
      dots[i]['radius'] = Math.sqrt(dots[i]['value']);
      total += dots[i]['radius'];
    }

    // OK, we have a total, now scale so they mostly fit
    // If there's one circle, 130 fits nicely into a
    // 300px high rectangle. As there are more dots, they
    // fit tighter and therefore can have a larger radius.
    var idealMaxRadii = Math.max(80,110*Math.log(dots.length));
    var scale = idealMaxRadii / total;
//    console.log('n='+dots.length + ' idealMaxRadii='+idealMaxRadii+' total='+total+' scale='+scale+ ' ratio=' + total/scale);
    for (var i = 0; i < dots.length; i++) {
      dots[i]['radius'] *= scale;
      if (dots[i]['radius'] > 0) dots[i]['radius'] = Math.max(5, dots[i]['radius']);
    }
  }

  randomValues(dots);
  normalize(dots);

  $('#graph').css({
    border: '5px solid #333'
  }).olives(dots);


  $('#animate').click(function() {
    randomValues(dots);
    normalize(dots);
    $('#graph').olives(dots);
  });

});

