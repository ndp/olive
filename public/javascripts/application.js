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
            ctx.clearRect(0, 0, element.width, element.height);
        },
        clearRect: function(x, y, w, h) {
            ctx.clearRect(x, y, w, h);
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


$(function() {
    $.fn.boxes = function() {

        var settings = {
            width: 200
        };

        return $(this).each(function() {

            var $this = $(this);
            var mouseMoving = true;
            $this.mousemove(function() {
                mouseMoving = true;
            });

            $this.addClass('boxes');
            $this.children().wrap('<div class="box"></div>');

            var $new = $('<div class="box">');

            function slideInNew() {
                if (mouseMoving) {
                    mouseMoving = false;
                    setTimeout(slideInNew, 5000);
                } else {
                    var $last = $this.find('.box:last');

                    $new.css({width: 0, backgroundColor: $last.css('backgroundColor')}).prependTo($this);

                    $new.animate({width: settings.width}, 1000, function() {
                        $last.prependTo($this);
                        $new.remove();
                        setTimeout(slideInNew, 5000);
                    });
                }
            }

            slideInNew();

            $this.find('.box').click(
                                    function() {
                                        var wasFocused = $(this).hasClass('focused');
                                        $this.find('.focused').trigger('blur').removeClass('focused');
                                        if (!wasFocused) {
                                            $(this).trigger('focus').addClass('focused');

                                            var rowHt = $(this).find('[data-height]').attr('data-height');
                                            $(this).attr('data-height', rowHt);
                                            var rowWidth = $(this).find('[data-width]').attr('data-width');
                                            $(this).attr('data-width', rowWidth);
                                        }
                                    }).find('a').click(function() {
                alert('here')
            });

            Csster.style({
                '.boxes': {
                    padding: 0,
                    has: clearfix(),
                    '> .box': {
                        overflow: 'hidden',
                        display: 'block',
                        'float': 'left',
                        margin: 0,
                        padding: 0,
                        height: 200,
                        width: settings.width,
                        '&.focused[data-width="2"]': {
                            width: 400
                        },
                        '&.focused[data-width="3"]': {
                            width: 600
                        },
                        '&.focused[data-height="2"]': {
                            height: 400
                        },
                        '&.focused[data-height="3"]': {
                            height: 600
                        }
                    }
                }
            });

        });

    };

    $('div.boxes').children().prepend('<div class="bg"></div>');
    $('div.boxes').boxes().find('.head:first').closest('.box').addClass('focused');




    var classes = ['head','collaboration','dev_tool','visualization','cheatsheet','prototype']
    var colors = ColorFactory.interpolate('#069','#ae6500',classes.length);
//    var colors = ColorFactory.interpolate('#eee','#999',classes.length);
    var css = {};
    for (var i in classes) {
        var cls = classes[i];
        var clr = colors[i];
        css['.box .'+cls] = {
            backgroundColor: bg = clr.saturate(-50).lighten(40),
            color: clr
        };
        css['.box:hover .'+cls] = {
            backgroundColor: bg = clr.saturate(-40).lighten(40),
            color: clr
        };
        css['.box.focused .'+cls] = {
            h1: {
                color: clr.lighten(80)
            },
            backgroundColor: bg = clr,
            color: clr.lighten(60)
        };
    }
    Csster.style(css);


//    console.log('%o',colors);
    Csster.style({
        '.box': {
            '>div': {
                height: '100%',
                position: 'relative'
            },
            h1: {
                margin: 0,
                marginLeft: 5,
                padding: '25px 0 0 0',
                font: '50px georgia',
                letterSpacing: 3,
                '&.p2': {
                    textIndent: -200
                }
            },
            h3: {
                margin: 0,
                paddingTop: 5,
                marginLeft: 5,
                padding: 0,
                font: '25px georgia'
            },
            h4: {
                margin: 0,
                marginLeft: 5,
                padding: 0,
                font: '15px georgia',
                visibility: 'hidden'
            },
            a: {
                display: 'block',
                margin: 0,
                marginLeft: 5,
                padding: 0,
                font: '15px georgia',
                color: 'white !important',
                visibility: 'hidden',
                zIndex: 100
            },
            p: {
                marginLeft: 5,
                marginRight: 20,
                fontSize: 15,
                visibility: 'hidden'
            },
            'div.tags': {
                marginLeft: 5,
                font: 'italic 11px georgia',
                position: 'absolute',
                bottom: 5
            },
            '.bg': {
                position: 'absolute',
                top: 0,
                height: '100%',
                width: '100%',
                opacity: 1
            },
            '&:hover': {
                color: 'white !important',
                h4: {
                    visibility: 'visible'
                },
                '.bg': {
                    opacity: .1
                }
            },
            '&.focused': {
                color: 'white !important',
                'h4,a,p': {
                    visibility: 'visible'
                },
                '.bg': {
                    opacity: .1
                }
            }
        },
        '#ux_spoke': {
            'h2': {
            },
            '.bg': {
                background: 'url(/images/portfolio/ux_spoke.png)'
            } },
        '#show_char_limit': {
            '.bg': {
                background: 'url(/images/portfolio/show_char_limit.png) no-repeat -100px 0px'
            } },
        '#hibernate_mapping_cheatsheet': {
            '.bg': {
                background: 'url(/images/portfolio/hibernate_mapping_cheatsheet.png) no-repeat 0px -40px'
            } },
        '#csster': {
            '.bg': {
                background: 'url(/images/portfolio/csster.png)'
            } },
        '#tracker_story_maps': {
            '.bg': {
                background: 'url(/images/portfolio/tracker_story_maps.png)'
            } },
        '#difftionary': {
            '.bg': {
                background: 'url(/images/portfolio/difftionary.png) no-repeat 0px -40px'
            } },
        '#chklistr': {
            '.bg': {
                background: 'url(/images/portfolio/chklistr.png) no-repeat 0px -40px'
            } },
        '#bedsider': {
            '.bg': {
                background: 'url(/images/portfolio/bedsider_1.png) no-repeat 0px -40px'
            } },
        '#jspx_cheatsheet': {
            '.bg': {
//                background: 'url(/images/portfolio/jspx_cheatsheet.png) no-repeat 0px -40px'
            } },
        '#agile_methods': {
            '.bg': {
                background: 'url(/images/portfolio/agile_methods.png)'
            }
        }
    });


});