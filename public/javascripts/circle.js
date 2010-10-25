if (typeof console == 'undefined') {
  console = {
    log: function() {
    }
  }
}

$.fn.circle = function(values, options) {

  var settings = $.extend({}, $.fn.circle.defaults, options);


  return $(this).each(function() {
    var width = $(this).width();
    var height = $(this).height();
    var radius = Math.min(width, height) / 2;
    var center = {x:width / 2 , y:height / 2 }

    var arc = Math.PI / values.length * 2;
    var outsideRadius = radius - 10;
    var c = canvas(this);

    function draw(startAngle) {

      c.clearRect(0, 0, width, height);
      c.context().font = settings.font;
      c.context().strokeStyle = "#dddddd";
      c.context().lineWidth = 1;

      $.each(values, function(i, v) {

        var angle = startAngle + i * arc;
        var color = v.color || '#ffffff';
        var textColor = v.textColor || color.darken(30);


        c.context().beginPath();
        c.context().arc(center.x, center.y, outsideRadius, angle, angle + arc, false);
        c.context().arc(center.x, center.y, settings.insideRadius, angle + arc, angle, true);
        c.context().fillStyle = color.lighten(10);
        c.context().stroke();
        c.context().fill();


        c.context().save();
//      c.context().shadowOffsetX = -1;
//      c.context().shadowOffsetY = -1;
//      c.context().shadowBlur = 0;
//      c.context().shadowColor = "rgb(220,220,220)";
        c.context().fillStyle = textColor;
        c.context().translate(center.x + Math.cos(angle + arc / 2) * settings.insideRadius,
                center.y + Math.sin(angle + arc / 2) * settings.insideRadius);
        c.context().rotate(angle + arc / 2);// + Math.PI / 2);
        var text = v.p;
        c.context().fillText(text, settings.textOffset[0], settings.textOffset[1]);
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
        c.context().arc(center.x, center.y, outsideRadius, - arc / 2, arc / 2, false);
        c.context().arc(center.x, center.y, settings.insideRadius, arc / 2, -arc / 2, true);
        c.context().fillStyle = settings.hilightColor;
        c.context().globalAlpha = .3;
        c.context().fill();
        c.context().globalAlpha = 1;
      }


    }

    var currentAngle = -arc / 2;
    draw(currentAngle);

    var spinInterval = null;

    $(this).bind('spin', function(event) {
      if (spinInterval) {
        return;
      }
      spinInterval = setInterval(function() {
        draw(currentAngle);
        currentAngle += Math.PI / 360 * 3;
      }, 50);
    });

    $(this).bind('stop', function(event) {
      if (spinInterval) {
        clearInterval(spinInterval);
        spinInterval = null;
      }
    });

    var destination = null;
    $(this).bind('scrollTo', function(event, dest) {

      for (var i = 0; i < values.length; i++) {
        if (dest == values[i].p)  break;
      }

      newAngle = (-i - .5) * arc;
      animateTo(newAngle);
    });

    function animateTo(newAngle, options) {
      if (animateTo.interval) {
        clearInterval(animateTo.interval);
        animateTo.interval = null;
      }

      if (currentAngle < 0) currentAngle += 2 * Math.PI;
      if (newAngle < 0) newAngle += 2 * Math.PI;


      var firstAngle = currentAngle;
      var diff = newAngle - currentAngle;

      if (diff < -Math.PI) {
        newAngle += 2 * Math.PI;
        diff = newAngle - currentAngle;
      }

      if (Math.abs(diff) < 0.000001) {
        console.log('nothing to do because curr: ' + firstAngle + ' to  ' + newAngle + ' delta=' + diff);
        return;
      }

      var settings = $.extend({}, { steps: Math.abs(Math.round(diff * 40)), duration: 500 }, options);
      var steps = settings.steps;
      var step = 0;
      console.log('curr: ' + firstAngle + ' to  ' + newAngle + ' delta=' + diff);
      animateTo.interval = setInterval(function() {
        currentAngle = $.easing.easeOutQuad(null, step++, firstAngle, diff, steps);
        //  old format currentAngle = $.easing.easeOutBounce(p++/steps, steps, firstAngle, diff);
        draw(currentAngle);
        if (step >= steps) {
          clearInterval(animateTo.interval);
          animateTo.interval = null;
          draw(newAngle);
          currentAngle = newAngle;
        }
      }, settings.duration / steps);
    }


    return this;

  });
};


$.fn.circle.defaults = {
  insideRadius: 100,
  font: 'bold 16px Helvetica, Arial',
  textOffset: [0,0]

};

function randomColor() {
  return '#' + Math.round((Math.random() * 1000000000)).toString(16).substr(0, 6);
}


$(function() {

//    dots.push({radius: Math.random() * 80 + 3, color:  });

  var items = [
    {p:'Andy Peterson',v:'whatever', color: randomColor()},
    {p:'Aila Peterson',v:'whatever', color: randomColor()},
    {p:'Annika Peterson',v:'whatever', color: randomColor()},
    {p:'Priita Peterson',v:'whatever', color: randomColor()},
    {p:'Richard Peterson',v:'whatever', color: randomColor()},
    {p:'Sue Peterson',v:'whatever', color: randomColor()},
    {p:'Ben Peterson',v:'whatever', color: randomColor()},
    {p:'Dan Peterson',v:'whatever', color: randomColor()},
    {p:'Julio Peterson',v:'whatever', color: randomColor()},
    {p:'Jennifer Peterson',v:'whatever', color: randomColor()},
    {p:'Tiia Carswell',v:'whatever', color: randomColor()},
    {p:'Juri',v:'whatever', color: randomColor()},
    {p:'Phil Carswell',v:'whatever', color: randomColor()},
    {p:'Tanya Cartwheel',v:'whatever', color: randomColor()}
  ];
  $('#small_circle').css({
    border: '5px solid #333'
  }).circle(items,
    {
      insideRadius: 10,
      font: '10px georgia',
      textOffset: [3,3]
    });


  //'stage is diverge or converge'
  var activities =
          [
            {name: 'paper prototyping',
              egs: ['Are the steps of the task correct?']},
            {name: 'hallway testing',
              aka: "cafe testing, Usability Testing - Hallway Testing",
              tests: 'Accuracy',
              egs: ['How many mistakes did people make?',
                'Can people recover from mistakes in the UI?)']},
            {name: 'remote testing', aka: 'Usability Testing - Remote Testing',
              egs: ['How much does the person remember afterwards or after periods of non-use?']},
            {name: 'expert review',
              aka: 'Usability Testing - Expert Review',
              tests: 'emotional response',
              egs: ['How does the person feel about the tasks completed?',
                'Is the person confident, stressed?',
                'Would the user recommend this system to a friend?']},
            {name: 'eye tracking',
              egs: ['What do people notice on the screen?']},
            {name: 'personas',
              tests: 'definition of user',
              egs: ['What are the possible types of users?',
                'What are the goals of the users?']
            },
            {name: 'user interviews',
              tests: 'problems, domain knowledge, goals, tasks',
              egs: [
                "What is the product?",
                "What should the product accomplish?",
                "What is a reasonable timeframe?"
              ]},
            {name: 'subject matter expert interviews',
              tests: 'complexities of domain, specialized knowledge, best practices',
              egs: [
                "What is the product?",
                "What should the product accomplish?",
                "What is a reasonable timeframe?"
              ]},
            {name: 'customer interviews',
              tests: 'goals, frustrations, buying considerations',
              egs: [
                "How much should it cost?",
                "What is the product?",
                "What should the product accomplish?",
                "What is a reasonable timeframe?"
              ]},
            {name: 'quantitative research',
              tests: 'financial questions, market demographics',
              egs: ['How much should it cost?',
                'Are there potential users?']},
            {name: 'surveys'},
            {name: 'web analytics',
              egs: ['Is page A better than page B?',
                'How do people find our site?',
                'What do people actually do with our site?']},
            {name: 'focus groups',
              tests: 'sense of brand or new domain',
              egs: [
                'Do we understand the brand?',
                'Do we understand the domain?']
            },
            {name: 'usability testing',
              tests: "assessing prototype's first-time ease of use, fine tuning button labels and such, persuading people there IS a problem",
              egs: [
              'How easy is it to learn?',
              'Should we have confidence to release the product?']
            },
            {name: 'user diaries',
              tests: 'behavior over time',
            egs: ['How do people behave over time?']},
            {name: 'ethnographic interviews',
              tests: 'extract values and goals that motivate actions'}
          ];


  var qs = [];
  for (var i = 0; i < activities.length; i++) {
    var activity = activities[i];
    if (activity.egs) {
      for (var e = 0; e < activity.egs.length; e++) {
        qs.push({p:activity.egs[e], color: '#fff', textColor: '#000'});
      }
    }
  }


//  console.log('%o', qs);
  $('#circle').circle(qs, {
    textOffset: [10,5],
    maskColor: '#ccc',
    hilightColor: 'yellow',
    font: 'bold 12px Georgia, Helvetica, Arial'
  });


  $('html').bind('keydown', function(event) {
    if (event.keyCode == 32) {
      $('#circle').trigger('spin');
    } else {
      number = event.keyCode - 48;
      if (number >= 0 && number < 10) {
        $('#circle').trigger('scrollTo', qs[number].p);
      } else {
        $('#circle').trigger('stop');
      }
    }

  });


});

