(function() {

  define(function() {
    var exports, startsWith;
    exports = {};
    return startsWith = function(haystack, needle) {
      var i, _ref;
      for (i = 0, _ref = needle.length; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        if (haystack[i] !== needle[i]) return false;
      }
      return true;
    };
  });

}).call(this);
