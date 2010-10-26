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
    },
    clearRect: function(x,y,w,h) {
      ctx.clearRect(x,y,w,h);
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




if (typeof console == 'undefined') {
  console = {
    log: function() {
    }
  }
}

