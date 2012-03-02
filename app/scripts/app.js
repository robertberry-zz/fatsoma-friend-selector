(function() {
  var includes;

  includes = ["jquery", "underscore", "backbone", "views", "models"];

  define(includes, function($, _, Backbone, views, models) {
    return function(friends) {
      var selector;
      selector = new views.FriendSelector({
        el: $("#selector"),
        friends: new models.Users(friends)
      });
      selector.render();
      return selector;
    };
  });

}).call(this);