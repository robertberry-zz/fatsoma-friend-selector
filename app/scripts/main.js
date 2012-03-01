(function() {
  var includes;

  includes = ["order!lib/jquery", "order!lib/underscore", "order!lib/backbone", "app"];

  define(includes, function(_, _, _, app) {
    return {
      from_fixtures: app
    };
  });

}).call(this);
