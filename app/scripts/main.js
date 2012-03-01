(function() {

  require(["order!lib/jquery", "order!lib/underscore", "order!lib/backbone"], function() {
    return require(["jquery", "underscore", "backbone", "views", "fixtures", "models"], function($, _, Backbone, views, fixtures, models) {
      var selector;
      selector = new views.FriendSelector({
        el: $("#selector"),
        friends: new models.Users(fixtures.friends)
      });
      return selector.render();
    });
  });

}).call(this);
