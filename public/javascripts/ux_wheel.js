$(function() {

    var uxQuestions = generateUXQuestions();

    function phaseToColor(phase) {
//        #var c = ColorFactory.interpolate('#8F8FBC', '#8F8FBC'.darken(50), 7);
//        var c = ColorFactory.interpolate('purple'.lighten(30), 'purple'.darken(10), 7);
        var c = ColorFactory.interpolate('#DE790A'.lighten(10), '#BD5108', 7);
        return {
            'requirements': c[0],
            'requirements,design': c[1],
            'design': c[2],
            'design,test': c[3],
            'test': c[4],
            'requirements,test': c[5],
            'requirements,design,test': c[6]
        }[phase] || '#000000'.saturate(-40).lighten(20);
    }
    

    var items = [];
    for (var q in uxQuestions) {
        var acts = uxQuestions[q];

        var color = phaseToColor(acts[0].phase);

        var item = {
            label:q,
            backgroundColor: color,
            color: color.saturate(-30).lighten(70),
            bubbleBackgroundColor: color,
            bubbleColor: color.lighten(80),
            data: acts
        };
        items.push(item);
    }

    function shuffle(o) {
        for (var j, x, i = o.length; i; j = parseInt(Math.random() * i),x = o[--i],o[i] = o[j],o[j] = x);
        return o;


        var s = [];
        while (a.length) {
            var r = a.splice(Math.random() * a.length, 1);
            s.push(r);
        }
        return s;
        while (s.length) a.push(s.shift());
        return s;
    }

    items = shuffle(items);


    $('#circle').bind('focusOn',
                     function(e, item) {
                         $('#answers').empty().fadeIn('slow').css({color: item.bubbleColor,backgroundColor: item.bubbleBackgroundColor});
                         $('<h6>').text('If your questions are like...').appendTo('#answers');
                         $('<h3>').html('&ldquo;' + item.label + '&rdquo;').appendTo('#answers');
                         $('<h6>').text('consider...').appendTo('#answers');
                         var $names = $('<ul>');
                         var data = item.data;
                         for (var i = 0; i < data.length; i++) {
                             var $li = $('<li>').appendTo($names);
                             var link = data[i].ref || 'http://www.google.com/search?q=' + data[i].name;
                             $('<a></a>').attr('href', link).attr('target', '_blank').text(data[i].name).appendTo($li);
                         }
                         $names.appendTo('#answers');

                         $('<h6>').text('These questions come up...').appendTo('#answers');
                         var phase = data[0].phase;
                         $phases = $('<ol>');
                         $('<li>').text('before').addClass(phase.indexOf('requirements') >= 0 ? 'on' : 'off').appendTo($phases);
                         $('<li>').text('design & build').addClass(phase.indexOf('design') >= 0 ? 'on' : 'off').appendTo($phases);
                         $('<li>').text('after').addClass(phase.indexOf('test') >= 0 ? 'on' : 'off').appendTo($phases);
                         $phases.appendTo('#answers');
                         $('<p></p>').html({
                             'requirements': 'These questions are usually asked <em>before</em> product definition starts.',
                             'requirements,design': 'These questions are usually asked <em>before or during</em> product definition, while early design ideas develop.',
                             'design': 'unused',
                             'design,test': 'These questions are usually asked <em>after</em> basic requirements, while defining and iterating on the product.',
                             'test': 'These questions are usually asked <em>while iterating on</em> the product.',
                             'requirements,test': 'These questions are usually asked <em>before</em> product definition or after construction.',
                             'requirements,design,test': 'These questions are asked during all phases of a product development.'
                         }[phase]).appendTo('#answers');

                         $('<div>').addClass('nib').css('borderRightColor', item.bubbleBackgroundColor).appendTo('#answers');

                     }).bind('passBy',
                            function(e, item) {
                                $('#answers').fadeOut('fast');
                            }).bind('clickOn',
                                   function(e, item) {
                                       $(this).trigger('spinTo', item.label);
                                   }).wheel(items, {
                                                       textOffset: [10,5],
                                                       insideRadius: 80,
                                                       //    maskColor: 'transparent',
                                                       //    hilightColor: 'white',
                                                       font: '12px verdana, Arial',
                                                       duration: 1000,
                                                       easing: $.easing.easeOutBounce

                                                   });


    $('html').bind('keydown', function(event) {
        if (event.keyCode == 32) {
            $('#circle').trigger('toggle');
        } else if (event.keyCode == 61 || event.keyCode == 107 || event.keyCode == 40) {
            $('#circle').trigger('next');
        } else if (event.keyCode == 38 || event.keyCode == 109) {
            $('#circle').trigger('prev');
        }
    });

    var bg = '#BD5108'.lighten(30).saturate(-60);
    bg = phaseToColor('requirements').lighten(10).saturate(-30);
    Csster.style({
        body: {
            margin: 0,
            padding: 0,
            backgroundColor: bg
        },
        '#circle': {
            cursor: 'pointer',
            position: 'absolute',
            top: 55,
            left: 0

        },
        h1: {
            font: '35px/35px georgia',
            margin: 0,
            padding: '5px 20px 10px 10px',
            has: roundedCorners('br',20),
            backgroundColor: phaseToColor('test'),
            color: phaseToColor('test').lighten(30).saturate(-50),
            float: 'left',
            fontVariant: 'small-caps',
            span: {
                color: phaseToColor('test').lighten(50).saturate(-30),
                fontSize: '80%'
            }
        },
        'div.copyright': {
            color: 'white',
            position: 'fixed',
            fontSize: 14,
            bottom: 0,
            right: 0,
            padding:10,
            zIndex: 100,
            has: roundedCorners('tl', 10),
            opacity: .9,
            backgroundColor: bg.darken(30),
            'a:link': {
                color: 'white',
                textDecoration: 'none'
            },
            'a:hover': {
                textDecoration: 'underline'
            }
        },
        '#answers': {
            padding: 20,
            backgroundColor: bg.darken(30),
            color: 'white',
            position: 'absolute',
            top: 70,
            left: 810,
            width: 350,
            minHeight: 390,
            font: '18px/30px georgia',
            border: '1px 1px 1px 0 solid #666',
            has: roundedCorners(10),
            '.nib': {
                position: 'absolute',
                borderRight: '20px solid red',
                borderTop: '20px solid transparent',
                borderBottom: '20px solid transparent',
                top: 365,
                left: -15
            },
            h6: {
                font: '15px/15px georgia',
                padding: 0,
                margin: 0,
                opacity: .8,
                fontStyle: 'italic'
            },
            h5: {
                font: '16px/25px georgia',
                padding: 0,
                margin: 0,
                opacity: .8,
                fontStyle: 'italic'
            },
            h3: {
                letterSpacing: 2
            },
            ul: {
                display: 'block',
                padding: 0,
                li: {
                    listStylePosition: 'inside',
                    a: {
                        color: '#ffffff',
                        textDecoration: 'none',
                        '&:hover': {textDecoration: 'underline'},
                        '&:before': { content: 'abc' }
                    }
                },
                paddingBottom: 20,
                borderBottom: '1px dashed #999'
            },
            ol: {
                has: clearfix(),
                display: 'block',
                padding: 0,
                marginBottom: 0,
                li: {
                    display: 'block',
                    float: 'left',
                    padding: '5px 10px',
                    marginRight: 2,
                    color: 'white',
                    border: '1px solid white',
                    '&.off': {
                        opacity: .3
                    },
                    '&.requirements': { backgroundColor: phaseToColor('requirements')},
                    '&.design': { backgroundColor: phaseToColor('design')},
                    '&.test': { backgroundColor: phaseToColor('test')}
                }
            },
            p: {
                font: '15px/25px georgia',
                margin: 0,
                paddingRight: 30
            }
        }

    });


});


