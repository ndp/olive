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

    var headlineFont = 'trebuchet ms';
    var bodyFont = 'trebuchet ms';
    $.fn.boxes = function() {

        var settings = {
            height: 180,
            width: 960 / 5
        };

        return $(this).each(function() {

            var $this = $(this);
            var mouseMoving = true;
            $this.mousemove(function() {
                mouseMoving = true;
            });

            $this.addClass('boxes');
            $this.children().wrap('<div class="box"></div>');
            $this.find('.double-wide').closest('.box').addClass('double-wide');

            var $new = $('<div class="box">');

            function slideInNew() {
                if (mouseMoving) {
                    mouseMoving = false;
                    setTimeout(slideInNew, 5000);
                } else {
                    var $last = $this.find('.box:last');

                    $new.css({width: 0, backgroundColor: $last.css('backgroundColor')}).insertAfter($this.find('.box:nth(3)'));

                    $new.animate({width: settings.width}, 1000, function() {
                        $last.insertAfter($new);
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
                                        if (wasFocused) {
                                            $(this).trigger('blur').removeClass('focused');
                                        } else {
                                            $(this).trigger('focus').addClass('focused');
                                        }
                                    }).bind('focus',
                                           function(e) {
                                               console.log('focus %o', this);
                                               $(this).attr('data-original-ht', $(this).innerHeight());
                                               $(this).attr('data-original-wd', $(this).innerWidth());
                                               var rowHt = $(this).find('[data-height]').attr('data-height');
                                               var rowWidth = $(this).find('[data-width]').attr('data-width');

                                               var css = {};
                                               if ('2' == rowWidth) {
                                                   css.width = settings.width * 2 -2
                                               }
                                               if ('2' == rowHt) {
                                                   css.height = settings.height * 2 - 2
                                               }
                                               if ('3' == rowHt) {
                                                   css.height = settings.height * 3 - 6
                                               }
                                               $(this).animate(css);

                                           }).bind('blur', function(e) {

                var css = {};
                css.width = '' + $(this).attr('data-original-wd') + 'px';
                css.height = '' + $(this).attr('data-original-ht') + 'px';
                $(this).animate(css, 'slow');
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
                        height: settings.height - 2,
                        width: settings.width - 2,
                        border: '1px solid transparent',
                        '&.double-wide': {width: settings.width * 2 - 2}
                    }
                }
            });

        });

    };

    $('div.boxes').children().prepend('<div class="bg"></div>');
    $('div.boxes').boxes();
    $('div.boxes').find('a').attr('target', '_blank');


    var classes = ['house','dev_tool','visualization','cheatsheet','prototype','collaboration'];
    var colors = ColorFactory.interpolate('#ae6500', '#069', classes.length);
    var colors = ['#045A8B','#3399cc','#990000','#A3CFE4','#006600','#cc6600']
//    var colors = ColorFactory.interpolate('#eee','#999',classes.length);
    var css = {};
    for (var i in classes) {
        var cls = classes[i];
        var clr = colors[i];
        css['.box .' + cls] = {
            backgroundColor: bg = clr,
            color: clr.lighten(40)
        };
        css['.box:hover .' + cls] = {
            backgroundColor: bg = clr.saturate(10).darken(10),
            color: clr.lighten(60)
        };
        css['.box.focused .' + cls] = {
            h1: {
                color: clr.lighten(80)
            },
            backgroundColor: bg = clr,
            color: clr.lighten(60)
        };
        css['.box .' + cls + ' a'] = {
            backgroundColor: bg = clr.saturate(-20).lighten(20),
            borderColor: bg = clr.saturate(0).lighten(30),
            color: clr
        };
        css['.box .' + cls + ' a:hover'] = {
            backgroundColor: bg = clr.saturate(0).lighten(20),
            borderColor: bg = clr.saturate(0).lighten(50),
            color: clr.lighten(50)
        };
    }
    Csster.style(css);


//    console.log('%o',colors);
    Csster.style({
        '.box': {
            cursor: 'pointer',
            '>div': {
                height: '100%',
                position: 'relative'
            },
            h1: {
                margin: 0,
                marginLeft: 5,
                padding: '25px 0 0 0',
                font: '50px ' + headlineFont,
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
                font: 'bold 20px ' + headlineFont
            },
            h4: {
                margin: '0 0 5px 5px',
                padding: 0,
                font: '14px ' + headlineFont,
                visibility: 'hidden'
            },
            a: {
                display: 'block',
                margin: '0 auto 0 5px',
                'float': 'left',
                font: '14px ' + headlineFont,
                color: 'white !important',
                visibility: 'hidden',
                border: '1px solid white',
                padding: '3px 5px',
                has: [roundedCorners(5)],
                textDecoration: 'none',
                zIndex: 100
            },
            'p,ul': {
                marginLeft: 5,
                marginRight: 20,
                visibility: 'hidden',
                font: '14px ' + bodyFont
            },
            'div.tags': {
                marginLeft: 5,
                font: 'italic 11px ' + bodyFont,
                position: 'absolute',
                bottom: 5,
                visibility: 'hidden'
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
                'h4,.tags': {
                    visibility: 'visible'
                },
                '.bg': {
                    opacity: .1
                }
            },
            '&.focused': {
                color: 'white !important',
                'h4,a,p,.tags,ul': {
                    visibility: 'visible'
                },
                '.bg': {
                    display: 'none',
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
//                background: 'url(/images/portfolio/show_char_limit.png) no-repeat -100px 0px'
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
        },
        '#so': {
            '.bg': {
//                background: 'url(http://stackoverflow.com/users/flair/114584.png) -78px 0'
            }
        },
        '#title': {
            backgroundColor: 'black',
            '*': {
                color: 'white',
                visibility: 'visible'
            }
        },
        '.box.focused #so': {
//            backgroundColor: 'transparent'
        }
    });


});