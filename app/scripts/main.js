(function() {

  define(["views", "jquery"], function(views) {
    return jQuery(function($) {
      var request;
      request = $.ajax({
        url: "../test/fixtures/friends.json",
        type: "GET",
        dataType: "json"
      });
      request.done(function(data) {
        var selector;
        return selector = new views.FriendSelector("#selector", data);
      });
      return request.fail(function(jqXHR, textStatus) {
        return alert("Unable to load test fixtures: " + testStatus);
      });
    });
  });

}).call(this);
