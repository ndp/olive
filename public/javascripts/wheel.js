$.fn.wheel = function(values, options) {

  var settings = $.extend({}, $.fn.wheel.defaults, options);

  return $(this).each(function() {

    var $this = $(this);
    var width = $this.width();
    var height = $this.height();
    var interval = null;
    var lastFocusedIndex = null;

    function stopInterval() {
      clearInterval(interval);
      interval = null;
    }

    var radius = Math.min(width, height) / 2;
    var center = {x:width / 2 , y:height / 2 }
    var arc = Math.PI / values.length * 2;

    var currentItem = 0;
    var rotationAngle = 0;

    $this.click(function(event) {

      function ptToAngle(pt) {
        var angle = Math.atan(-pt.y / pt.x);
        if (pt.x < 0 && pt.y > 0) angle = Math.PI + angle;
        if (pt.x < 0 && pt.y < 0) angle += Math.PI;
        if (pt.x > 0 && pt.y < 0) angle = 2 * Math.PI + angle;
        return angle;
      }
      pt = { x: event.layerX - center.x, y: event.layerY - center.y };
      var angle = ptToAngle(pt);
      angle = angle + rotationAngle;
      if (angle < 0) angle += 2 * Math.PI;

      function angleToItemIndex(angle) {
           return (values.length + values.length - Math.round(angle / arc)) % values.length;
      }

      var itemIndex = angleToItemIndex(angle);
      $this.trigger('clickOn', [values[itemIndex], itemIndex]);
    });

    function stringToItemIndex(s) {
      for (var i = 0; i < values.length; i++) {
        if (s == values[i].p)  return i;
      }
      return null;
    }

    // Return to the center
    function itemIndexToAngle(item) {
      return rotationAngle + item * arc - arc / 2;
    }

    var outsideRadius = radius - 10;
    var c = canvasWrapper(this);

    function drawWheel() {

      // trigger even if new item is focused
      var focusedIndex = Math.round(-rotationAngle / arc + 2 * values.length) % values.length;
      if (focusedIndex != lastFocusedIndex) {
        $this.trigger('passBy', [values[focusedIndex], focusedIndex]);
        lastFocusedIndex = focusedIndex;
      }

      c.clearRect(0, 0, width, height);
      c.context().font = settings.font;

      $.each(values, function(i, v) {

        var angle = itemIndexToAngle(i);
        var backgroundColor = v.backgroundColor || '#ffffff';
        var textColor = v.color || backgroundColor.darken(30);


        c.context().beginPath();
        c.context().arc(center.x, center.y, outsideRadius, angle, angle + arc, false);
        c.context().arc(center.x, center.y, settings.insideRadius, angle + arc, angle, true);
        c.context().fillStyle = backgroundColor;
        c.context().strokeStyle = "#dddddd";
        c.context().lineWidth = 1;
        c.context().stroke();
        c.context().fill();


        c.context().save();
        c.context().fillStyle = textColor;
        c.context().translate(center.x + Math.cos(angle + arc / 2) * settings.insideRadius,
                center.y + Math.sin(angle + arc / 2) * settings.insideRadius);
        c.context().rotate(angle + arc / 2);// + Math.PI / 2);
        var text = v.p;
        c.context().fillText(text, settings.textOffset[0], settings.textOffset[1], outsideRadius - settings.insideRadius - settings.textOffset[0] - 5);
        //-c.context().measureText(text).width
        c.context().restore();
      });

      if (settings.maskColor) {
        c.context().beginPath();
        c.context().arc(center.x, center.y, outsideRadius, arc / 2, 2 * Math.PI - arc / 2, false);
        c.context().arc(center.x, center.y, settings.insideRadius, 2 * Math.PI - arc / 2, arc / 2, true);
        c.context().fillStyle = settings.maskColor;
        c.context().globalAlpha = .3;
        c.context().fill();
        c.context().globalAlpha = 1;
      }

      if (settings.hilightColor) {
        c.context().beginPath();
        c.context().arc(center.x, center.y, outsideRadius + 2, - arc / 2, arc / 2, false);
        c.context().arc(center.x, center.y, settings.insideRadius - 2, arc / 2, -arc / 2, true);
        c.context().fillStyle = settings.hilightColor;
        c.context().globalAlpha = .3;
        c.context().fill();
        c.context().globalAlpha = 1;
//        c.context().lineWidth = 3;
//        c.context().strokeStyle = '#666';
//        c.context().stroke();
      }


    }

    drawWheel();

    $this.bind('toggle', function() {
      console.log('toggle');
      if (interval) {
        $this.trigger('stop');
      } else {
        $this.trigger('spin');
      }

    });


    $this.bind('spin', function(event) {
      console.log('spin');
      if (interval) {
        return;
      }
      interval = setInterval(function() {
        drawWheel();
        rotationAngle += Math.PI / 360 * 3;
      }, 50);
    });

    $this.bind('stop', function(event) {
      stopInterval();
      $this.trigger('focusOn', [values[lastFocusedIndex], lastFocusedIndex]);
    });

    $this.bind('next', function() {
      var nextIndex = ((lastFocusedIndex || 0) + 1) % values.length;
      var newAngle = -(nextIndex * arc);
      animateTo(newAngle);
    });

    $this.bind('prev', function() {
      var nextIndex = ((lastFocusedIndex || 0) - 1 + values.length) % values.length;
      var newAngle = -(nextIndex * arc);
      animateTo(newAngle);
    });

    $this.bind('spinTo', function(event, dest) {
      var i = stringToItemIndex(dest);
      var newAngle = -(i * arc);
      console.log('spinTo: ' + dest + ' #=' + i + ' arc=' + newAngle);
      animateTo(newAngle);
    });

    function animateTo(newAngle, options) {
      stopInterval();

      if (rotationAngle < 0) rotationAngle += 2 * Math.PI;
      if (newAngle < 0) newAngle += 2 * Math.PI;


      var firstAngle = rotationAngle;
      var diff = newAngle - rotationAngle;

      // simple heuristic to rotate the closest direction
      if (diff < -Math.PI) {
        newAngle += 2 * Math.PI;
      }
      if (diff > Math.PI) {
        newAngle -= 2 * Math.PI;
      }
      diff = newAngle - rotationAngle;

      if (Math.abs(diff) < 0.000001) {
        console.log('nothing to do because curr: ' + firstAngle + ' to  ' + newAngle + ' delta=' + diff);
        return;
      }

      var settings = $.extend({}, { steps: Math.abs(Math.round(diff * 20)), duration: 1000 }, options);
      var steps = settings.steps;
      var step = 0;
      console.log('curr: ' + firstAngle + ' to  ' + newAngle + ' delta=' + diff);
      interval = setInterval(function() {
        rotationAngle = $.easing.easeOutQuad(null, step++, firstAngle, diff, steps);
        //  old format currentAngle = $.easing.easeOutBounce(p++/steps, steps, firstAngle, diff);
        drawWheel();
        if (step >= steps) {
          stopInterval();
          drawWheel();
          $this.trigger('focusOn', [values[lastFocusedIndex], lastFocusedIndex]);
          rotationAngle = newAngle;
        }
      }, settings.duration / steps);
    }


    return this;

  }
          )
          ;
}
        ;


$.fn.wheel.defaults = {
  insideRadius: 100,
  font: 'bold 16px Helvetica, Arial',
  textOffset: [0,0]

};