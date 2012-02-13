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
    exports.last = function(seq) {
      return seq[seq.length - 1];
    };
    exports.first = function(seq) {
      return seq[0];
    };
    return exports;
  });

}).call(this);
