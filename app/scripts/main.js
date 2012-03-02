(function() {
  var includes;

  includes = ["order!lib/jquery", "order!lib/underscore", "order!lib/backbone", "app"];

  require(includes, function(_, _, _, app) {
    var selector;
    return selector = app.from_ajax("./friend-list");
  });

}).call(this);
