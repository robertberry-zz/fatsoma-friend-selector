(function() {
  var includes;

  includes = ["jquery", "underscore", "backbone", "views", "models"];

  define(includes, function($, _, Backbone, views, models) {
    return {
      from_fixtures: function(friends) {
        var selector;
        selector = new views.FriendSelector({
          el: $("#selector"),
          friends: new models.Users(friends)
        });
        selector.render();
        return selector;
      },
      from_ajax: function(url) {
        return $.ajax(url, {
          dataType: "json",
          success: function(friends) {
            var selector;
            selector = new views.FriendSelector({
              el: $("#selector"),
              friends: new models.Users(friends)
            });
            return selector.render();
          }
        });
      }
    };
  });

}).call(this);
