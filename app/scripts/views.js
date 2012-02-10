(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["models", "templates", "jquery", "underscore", "backbone"], function(models, templates) {
    var exports;
    exports = {};
    exports.FriendSelector = (function(_super) {

      __extends(FriendSelector, _super);

      function FriendSelector() {
        FriendSelector.__super__.constructor.apply(this, arguments);
      }

      FriendSelector.prototype.events = {
        "keypress .search": "_render_autocomplete"
      };

      FriendSelector.prototype.initialize = function() {
        return this.friends = new models.Users(this.options["friends"]);
      };

      FriendSelector.prototype.search_term = function() {
        return this.$(".search").val();
      };

      FriendSelector.prototype._render_autocomplete = function() {
        return this.render_autocomplete();
      };

      FriendSelector.prototype.render_autocomplete = function() {
        var matched, term,
          _this = this;
        term = this.search_term().toLowerCase();
        matched = this.friends.filter(function(user) {
          return user.get("name").toLowerCase().indexOf(term !== -1);
        });
        return this.$(".autocomplete").html(new exports.UserAutocomplete({
          models: matched
        }));
      };

      return FriendSelector;

    })(Backbone.View);
    exports.UserAutocomplete = (function(_super) {

      __extends(UserAutocomplete, _super);

      function UserAutocomplete() {
        UserAutocomplete.__super__.constructor.apply(this, arguments);
      }

      UserAutocomplete.prototype.template = templates.user_autocomplete;

      return UserAutocomplete;

    })(Backbone.View);
    return exports;
  });

}).call(this);
