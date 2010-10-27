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
        $this.trigger('focusOn', [values[focusedIndex], focusedIndex]);
        lastFocusedIndex = focusedIndex;
      }

      c.clearRect(0, 0, width, height);
      c.context().font = settings.font;

      $.each(values, function(i, v) {

        var angle = itemIndexToAngle(i);
        var color = v.color || '#ffffff';
        var textColor = v.textColor || color.darken(30);


        c.context().beginPath();
        c.context().arc(center.x, center.y, outsideRadius, angle, angle + arc, false);
        c.context().arc(center.x, center.y, settings.insideRadius, angle + arc, angle, true);
        c.context().fillStyle = color.lighten(10);
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
        c.context().arc(center.x, center.y, settings.insideRadius-2, arc / 2, -arc / 2, true);
        c.context().fillStyle = settings.hilightColor;
        c.context().globalAlpha = .3;
        c.context().fill();
        c.context().globalAlpha = 1;
        c.context().lineWidth = 3;
        c.context().strokeStyle = '#666';
        c.context().stroke();
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
      console.log('stop');
      stopInterval();
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
          rotationAngle = newAngle;
        }
      }, settings.duration / steps);
    }


    return this;

  });
};


$.fn.wheel.defaults = {
  insideRadius: 100,
  font: 'bold 16px Helvetica, Arial',
  textOffset: [0,0]

};

function randomColor() {
  return '#' + Math.round((Math.random() * 1000000000)).toString(16).substr(0, 6);
}


$(function() {


  //'stage is diverge or converge'
  var activities =
          [
            {name: 'paper prototyping',
              egs: ['Are the steps of the task correct?',
                "Is the terminology right?",
                'Will users understand our approach to solving the problem?'
              ]},
            {name: 'hallway testing',
              aka: "cafe testing, Usability Testing - Hallway Testing",
              tests: 'Accuracy',
              egs: ['',
                "Is the terminology right?",
                '']},
            {name: 'eye tracking',
              egs: ['What do people notice on the screen?']},
            {name: 'personas',
              tests: 'definition of user',
              egs: ['What are the types of users?',
                'What are the goals and perspective of the users?']
            },
            {name: 'user interviews',
              tests: 'problems, domain knowledge, goals, tasks',
              egs: [
                      "Is the terminology right?",
                "What should the product accomplish?",
                "What specific problems should the product solve?",
                "What is a reasonable time frame?"
              ]},
            {name: 'subject matter expert interviews',
              tests: 'complexities of domain, specialized knowledge, best practices',
              egs: [
                "Is the terminology right?",
                "What specific problems should the product solve?",
                "What should the product accomplish?",
                "What is a reasonable time frame?"
              ]},
            {name: 'customer interviews',
              tests: 'goals, frustrations, buying considerations',
              egs: [
                "How much should it cost?",
                "What specific problems should the product solve?",
                "What is a reasonable time frame?"
              ]},
            {name: 'quantitative research',
              tests: 'financial questions, market demographics',
              egs: [
                'How much should it cost?',
                'Are there potential users?'
              ]},
            {name: 'surveys',
              egs: [
                ''
              ]},
            {name: 'web analytics',
              egs: [
                'Is page A better than page B?',
                'What links and pages aren\'t used?',
                'How do people actually find our site?',
                'What do people actually do on our site?'
              ]},
            {name: 'focus groups',
              tests: 'sense of brand or new domain',
              egs: [
                'Do we understand the brand?',
                'Do we understand the domain?']
            },
            {name: 'usability testing',
              tests: "assessing prototype's first-time ease of use, fine tuning button labels and such, persuading people there IS a problem",
              egs: [
                'What are the usability problems?',
                'How easy is it to learn?',
                'Is the usability that bad?',
                "Is the terminology right?",
                'Can users accomplish X in time Y?',
                'Do users understand how to use it?',
                'Can users can make the right choice and explain the why?',
                'What areas need the most attention?'
              ]
            },
            {
              name: 'remote automated user testing',
              egs: [
                'What are the usability problems?',
                "Can users accomplish a goal within a scenario?",
                'Is the usability that bad?',
                "Is the terminology right?",
                'Do users understand how to use it?',
                'Can users accomplish X in time Y?',
                "Can users complete a task?"
              ]
            },
            {name: 'user diaries',
              tests: 'behavior over time',
              egs: [
                'How do people behave over time?'
              ]},
            {name: 'ethnographic interviews',
              tests: 'extract values and goals that motivate actions',
              egs: [
              ]}
          ];

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
    var c = randomColor();
    items.push({p:q, color: c.saturate(30).darken(30), textColor: c.lighten(30), data: questions[q]});
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
                     $('#answers').empty().css({color: item.textColor,backgroundColor: item.color});
                     $('<h3>').text(item.p).appendTo('#answers');
                     var $names = $('<ul>');
                     var data = item.data;
                     for (var i = 0; i < data.length; i++) {
                       $('<li>').text(data[i].name).appendTo($names);
                     }
                     $names.appendTo('#answers');
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


});

