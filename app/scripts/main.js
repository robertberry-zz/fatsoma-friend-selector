(function() {
  var includes;

  require.config({
    paths: {
      jquery: "libs/jquery/jquery-min",
      underscore: "libs/underscore/underscore-min",
      backbone: "libs/backbone/backbone-min"
    }
  });

  includes = ["app", "fixtures"];

  require(includes, function(app, fixtures) {
    var selector;
    return selector = app.from_fixtures(fixtures.friends);
  });

}).call(this);
