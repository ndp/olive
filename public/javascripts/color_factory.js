if (typeof ColorFactory == 'undefined') {
  ColorFactory = {
    sixHexDigits: 0xffffff,
    random: function() {
      var c = Math.round((Math.random() * ColorFactory.sixHexDigits) + ColorFactory.sixHexDigits).toString(16);
      c = c.substr(c.length - 6, 6);
      return '#' + c;
    },
    randomGray: function() {
      return ColorFactory.random().saturate(-100);
    },
    randomHue: function(s, l) {
      h = Math.round(Math.random() * 256);
      return Csster.hslToHexColor(h, s, l);
    }
  };
}

