$(function() {


    // create questions hash of question => [activity[0], activity[1]...]
    var questions = {};
    for (var i = 0; i < activities.length; i++) {
        var activity = activities[i];
        if (activity.egs) {
            for (var e = 0; e < activity.egs.length; e++) {
                var q = activity.egs[e];
                if (q.length > 0) {
                    if (!questions[q]) {
                        questions[q] = [];
                    }
                    questions[q].push(activity);
                }
            }
        }
    }


    var items = [];
    for (var q in questions) {
        var acts = questions[q];
        if (!acts[0].color) {
            var c = ColorFactory.randomHue(20, 40);
            acts[0].color = c;
        }
//        var color = acts[0].color;
        var color = {
            'requirements': '#316184',
            'requirements,design': '#F7DE84'.darken(30).saturate(10),
            'design': 'unused',
            'design,test': '#BD5108',
            'test': '#840839',
            'requirements,test': '#F7106B',
            'requirements,design,test': '#8F8FBC'
        }[acts[0].category] || '#000000'.saturate(-40).lighten(20);
        var item = {
            p:q,
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


//  console.log('%o', qs);
//  items = [
//    {p: '0 zero', data: {}},
//    {p: '1 one', data: {}},
//    {p: '2', data: {}},
//    {p: '3', data: {}},
//    {p: '4', data: {}},
//    {p: '5 five', data: {}},
//    {p: '6', data: {}},
//    {p: '7', data: {}},
//    {p: '8 eight', data: {}},
//    {p: '9', data: {}}
//  ];
    $('#circle').bind('focusOn',
                     function(e, item) {
                         $('#answers').empty().fadeIn('slow').css({color: item.bubbleColor,backgroundColor: item.bubbleBackgroundColor});
                         $('<h6>').text('If your questions are like...').appendTo('#answers');
                         $('<h3>').html('&ldquo;' + item.p + '&rdquo;').appendTo('#answers');
                         $('<h6>').text('try...').appendTo('#answers');
                         var $names = $('<ul>');
                         var data = item.data;
                         for (var i = 0; i < data.length; i++) {
                             var $li = $('<li>').appendTo($names);
                             var link = data[i].ref || 'http://www.google.com/search?q='+data[i].name;
                             $('<a></a>').attr('href', link).attr('target','_blank').text(data[i].name).appendTo($li);
                         }
                         $names.appendTo('#answers');

                     }).bind('passBy',
                            function(e, item) {
                                $('#answers').fadeOut('fast');
                            }).bind('clickOn',
                                   function(e, item) {
                                       $(this).trigger('spinTo', item.p);
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
                $('#circle').trigger('spinTo', items[number].p);
            } else {
                console.log(event.keyCode);
            }
        }

    });

    Csster.style({
        body: {
            backgroundColor: '#ebebeb'
        },
        '#circle': { cursor: 'pointer'},
        h1: {
            font: '35px/50px georgia',
            position: 'absolute',
            left: 805,
            width: 350,
            padding: 20,
            has: roundedCorners(10),
            top: 0,
            backgroundColor: 'rgb(132, 8, 57)',
            color: '#fce6d5',
            letterSpacing: 3,
            span: {
                display: 'block',
                font: '20px/30px georgia',
                letterSpacing: 0,
                '&.copyright': {
                    fontSize: 12
                }
            }
        },
        '#answers': {
            padding: 20,
            backgroundColor: '#ddd',
            position: 'absolute',
            top: 300,
            left: 805,
            width: 350,
            font: '18px/30px georgia',
            border: '1px 1px 1px 0 solid #666',
            has: roundedCorners(10),
            h6: {
                font: '12px/15px verdana',
                padding: 0,
                margin: 0
            },
            h3: {
                letterSpacing: 2
            },
            ul: {
                li: {
                    a: {
                        color: '#ffffff'
                    }
                }
            }
        }

    });


});

