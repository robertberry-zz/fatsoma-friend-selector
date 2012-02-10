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
    return exports;
  });

}).call(this);
