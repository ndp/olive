/**
 * Draws a "wheel" of equal size wedges, colored and labelled as indicated by values passed in.
 * There is the concept of a "current" wedge, which is the one on the right side (whose text
 * is upright).
 *
 * The following events are accepted:
 *   next -- rotate clockwise to the next wedge
 *   prev - rotate counterclockwise to the previous (next) wedge
 *   spinTo(index) -- rotate to the given wedge
 *   spin -- start spinning clockwise
 *   stop -- stop spinning, if we're spinning
 *   toggle -- spin or stop, depending on current state
 *
 * The following events are broadcast:
 *   clickOn(value, index) -- when the user clicks on a wedge
 *   passBy(value, index) -- when a given value becomes the "current" wedge
 *
 * @param values array of value objects, where each value has the following
 *               properties:
 *                 label: text to draw
 *                 backgroundColor: color of slice of the while (default white)
 *                 color: color of text (default 30% darker than the background color)
 * @param options: hash of options
 *        insideRadius- distance from center to beginning of wedge, in px
 *        font -- canvas acceptable font style, eg. '12px Verdana'
 *        textOffset -- [x,y] array of how to offset the labels bfore drawing them
 */

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
            angle = normalizeAngle(angle + rotationAngle);

            function angleToItemIndex(angle) {
                return (values.length + values.length - Math.round(angle / arc)) % values.length;
            }

            var itemIndex = angleToItemIndex(angle);
            $this.trigger('clickOn', [values[itemIndex], itemIndex]);
        });

        function triggerFocusOn() {
            $this.trigger('focusOn', [values[lastFocusedIndex], lastFocusedIndex]);
        }

        if ($.fn.mousewheel) {
            var mousewheelTimeout = null;
            $this.mousewheel(function(e, delta) {
                console.log('mousewheel=' + delta);
                stopInterval();
                if (mousewheelTimeout) clearTimeout(mousewheelTimeout);
                mousewheelTimeout = setTimeout(triggerFocusOn, 200);
                rotationAngle -= delta/15;
                normalizeAngle(rotationAngle);
                drawWheel();
                return false;
            });
        }

        function stringToItemIndex(s) {
            for (var i = 0; i < values.length; i++) {
                if (s == values[i].label)  return i;
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
            if (lastFocusedIndex != null && focusedIndex != lastFocusedIndex) {
                $this.trigger('passBy', [values[focusedIndex], focusedIndex]);
            }
            lastFocusedIndex = focusedIndex;

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

                var availableTextWidth = outsideRadius - settings.insideRadius - settings.textOffset[0] - 5;
                var text = v.label;
                if ($.browser.safari && c.context().measureText(text).width > availableTextWidth) {
                    while (c.context().measureText(text + '...').width > availableTextWidth) {
                        text = text.substr(0, text.length - 2);
                    }
                    text = text + '...'
                }
                c.context().fillText(text, settings.textOffset[0], settings.textOffset[1], availableTextWidth);
                c.context().restore();
            }
                    )
                    ;

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

            if (settings.centerColor) {
                c.context().beginPath();
                c.context().arc(center.x, center.y, settings.insideRadius, 0, Math.PI * 2, true); // Outer circle
                c.context().fillStyle = settings.centerColor;
                c.context().fill();
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
            triggerFocusOn();
        });

        $this.bind('next', function(e, amount) {
            var nextIndex = ((lastFocusedIndex || 0) + 1) % values.length;
            var newAngle = -(nextIndex * arc);
            animateTo(newAngle);
        });

        $this.bind('prev', function(e, amount) {
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

        function normalizeAngle(a) {
            while (a < 0) a += 2 * Math.PI;
            while (a > Math.PI * 2) a -= 2 * Math.PI;
            return a;
        }

        function animateTo(newAngle, options) {
            var animationSettings = $.extend({}, settings, options);

            stopInterval();

            rotationAngle = normalizeAngle(rotationAngle);
            newAngle = normalizeAngle(newAngle);


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
                console.log('nothing to do because curr: ' + rotationAngle + ' to  ' + newAngle + ' delta=' + diff);
                return;
            }

            var firstAngle = rotationAngle;
            var steps = animationSettings.steps || Math.max(Math.abs(Math.round(diff * 10)), 10);
            var step = 0;
            console.log('curr: ' + firstAngle + ' to  ' + newAngle + ' delta=' + diff);
            interval = setInterval(function() {
                rotationAngle = settings.easing(null, step++, firstAngle, diff, steps);
                //  old format currentAngle = $.easing.easeOutBounce(p++/steps, steps, firstAngle, diff);
                drawWheel();
                if (step >= steps) {
                    stopInterval();
                    rotationAngle = normalizeAngle(newAngle);
                    drawWheel();
                    triggerFocusOn();
                }
            }, animationSettings.duration / steps);
        }

        return this;

    });
};


$.fn.wheel.defaults = {
    insideRadius: 100,
    font: 'bold 16px Helvetica, Arial',
    textOffset: [0,0],
    duration: 600, // of animation
    easing: $.easing.easeOutQuad
};