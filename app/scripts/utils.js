(function() {

  define(function() {
    var exports;
    exports = {};
    exports.startsWith = function(haystack, needle) {
      return haystack.indexOf(needle) === 0;
    };
    exports.complement = function(f) {
      return function() {
        return !f.apply(f, arguments);
      };
    };
    exports.keyCodes = {
      KEY_BACKSPACE: 8,
      KEY_TAB: 9,
      KEY_ENTER: 13,
      KEY_SHIFT: 16,
      KEY_CTRL: 17,
      KEY_ALT: 18,
      KEY_ESCAPE: 27,
      KEY_DELETE: 46,
      KEY_LEFT: 37,
      KEY_UP: 38,
      KEY_RIGHT: 39,
      KEY_DOWN: 40
    };
    return exports;
  });

}).call(this);
