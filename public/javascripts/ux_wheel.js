$(function() {

    var uxQuestions = generateUXQuestions();

    var items = [];
    for (var q in uxQuestions) {
        var acts = uxQuestions[q];
        if (!acts[0].color) {
            var c = ColorFactory.randomHue(20, 40);
            acts[0].color = c;
        }
//        var color = acts[0].color;
//        var color = {
//            'requirements': '#316184',
//            'requirements,design': '#BD5108'.saturate(-50),//'black',//'#F7DE84'.darken(30).saturate(10),yellow
//            'design': 'unused',
//            'design,test': '#BD5108'.saturate(-30), // orange
//            'test': '#840839'.saturate(-40).lighten(10),// red
//            'requirements,test': '#F7106B',
//            'requirements,design,test': '#8F8FBC'
//        }[acts[0].category] || '#000000'.saturate(-40).lighten(20);
        var c = '#F7106B';
        c = '#8F8FBC';
        var color = {
            'requirements': c.darken(25),
            'requirements,design': c.darken(20),
            'design': c.darken(15),
            'design,test': c.darken(10),
            'test': c.darken(5),
            'requirements,test': c,
            'requirements,design,test': c.saturate(-100)
        }[acts[0].category] || '#000000'.saturate(-40).lighten(20);
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

                         $('<h6>').text('Most important during...').appendTo('#answers');
                         var cat = data[0].category;
                         $phases = $('<ol>');
                         $('<li>').text('requirements').addClass(cat.indexOf('requirements') >= 0 ? 'on' : 'off').appendTo($phases);
                         $('<li>').text('design').addClass(cat.indexOf('design') >= 0 ? 'on' : 'off').appendTo($phases);
                         $('<li>').text('build & test').addClass(cat.indexOf('test') >= 0 ? 'on' : 'off').appendTo($phases);
                         $phases.appendTo('#answers');
                         $('<p></p>').html({
                             'requirements': 'These questions are usually asked <em>before</em> product definition starts.',
                             'requirements,design': 'These questions are usually asked <em>before or during</em> product definition, while early design ideas develop.',
                             'design': 'unused',
                             'design,test': 'These questions are usually asked <em>after</em> basic requirements, while defining and iterating on the product.',
                             'test': 'These questions are usually asked <em>while iterating on</em> the product.',
                             'requirements,test': 'These questions are usually asked <em>before</em> product definition or after construction.',
                             'requirements,design,test': 'These questions are asked during all phases of a product development.'
                         }[cat]).appendTo('#answers');

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
                                                       font: '12px verdana, Arial'
                                                   });


    $('html').bind('keydown', function(event) {
        if (event.keyCode == 32) {
            $('#circle').trigger('toggle');
        } else if (event.keyCode == 61 || event.keyCode == 107 || event.keyCode == 40) {
            $('#circle').trigger('next');
        } else if (event.keyCode == 38 || event.keyCode == 109) {
            $('#circle').trigger('prev');
        } else {
            number = event.keyCode - 48;
            if (number >= 0 && number < 10) {
                $('#circle').trigger('spinTo', items[number].text);
            } else {
                console.log(event.keyCode);
            }
        }

    });

    Csster.style({
        body: {
            backgroundColor: '#BD5108'.lighten(30).saturate(-60)
        },
        '#circle': {
            cursor: 'pointer',
            position: 'absolute',
            top:45,
            left: 20

        },
        h1: {
            font: '35px/35px georgia',
            padding: '0 0 0 20px',
            margin: 0,
            color: 'rgb(132, 8, 57)',
            fontVariant: 'small-caps',
            span: {
                color: '#BD5108'
            }
        },
        'div.copyright': {
            color: '#BD5108',
            position: 'fixed',
            fontSize: 12,
            bottom: 0,
            right: 20,
            'a:link': {
                color: '#BD5108'
            }
        },
        '#answers': {
            padding: 20,
            backgroundColor: '#ddd',
            position: 'absolute',
            top: 150,
            left: 830,
            width: 350,
            font: '18px/30px georgia',
            border: '1px 1px 1px 0 solid #666',
            has: roundedCorners(10),
            '.nib': {
                position: 'absolute',
                borderRight: '20px solid red',
                borderTop: '20px solid transparent',
                borderBottom: '20px solid transparent',
                top: 275,
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
                    border: '1px solid white',
                    '&.off': {
                        opacity: .3
                    }
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

