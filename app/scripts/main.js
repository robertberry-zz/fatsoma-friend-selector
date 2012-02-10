(function() {

  define(["views", "fixtures", "models", "jquery"], function(views, fixtures, models) {
    var selector;
    selector = new views.FriendSelector({
      el: $("#selector"),
      friends: new models.Users(fixtures.friends)
    });
    return selector.render();
  });

}).call(this);
