$(function() {




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
    var data = questions[q];
    if (!data[0].color) {
      var c = ColorFactory.randomHue(20,40);
      data[0].color = c;
    }
    items.push({p:q, backgroundColor: data[0].color, color: data[0].color.lighten(50),
      bubbleBackgroundColor: data[0].color.saturate(30).darken(20), bubbleColor: data[0].color.lighten(80),
      data: data});
  }


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
                     $('#answers').stop(true, true).fadeOut('fast', function() {
                       $('#answers').empty().fadeIn('slow').css({color: item.bubbleColor,backgroundColor: item.bubbleBackgroundColor});
                       $('<h6>').text('If your questions are like...').appendTo('#answers');
                       $('<h3>').html('&ldquo;' + item.p + '&rdquo;').appendTo('#answers');
                       $('<h6>').text('try...').appendTo('#answers');
                       var $names = $('<ul>');
                       var data = item.data;
                       for (var i = 0; i < data.length; i++) {
                         $('<li>').text(data[i].name).appendTo($names);
                       }
                       $names.appendTo('#answers');
                     });
                     console.log('%o', item);

                   }).wheel(items, {
                                     textOffset: [10,5],
                                     insideRadius: 80,
                                     maskColor: 'transparent',
                                     hilightColor: 'transparent',
                                     font: 'bold 12px Georgia, Helvetica, Arial'
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
    h1: {
      font: '40px/60px georgia',
      position: 'absolute',
      left: 805,
      width: 300,
      padding: 20,
      has: roundedCorners(10),
      top: 0,
      backgroundColor: '#c94c36',
      color: '#fce6d5',
      letterSpacing: 3
    },
    '#answers': {
      padding: 20,
      backgroundColor: '#ddd',
      position: 'absolute',
      top: 300,
      left: 805,
      width: 300,
      font: '18px/30px georgia',
      border: '1px 1px 1px 0 solid #666',
      has: roundedCorners(10),
      h6: {
        font: '12px/15px georgia',
        padding: 0,
        margin: 0
      }
    }

  });


});

