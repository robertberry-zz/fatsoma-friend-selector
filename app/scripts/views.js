(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["models", "templates", "jquery", "underscore", "backbone", "mustache/mustache"], function(models, templates) {
    var CollectionView, MustacheView, exports;
    exports = {};
    MustacheView = (function(_super) {

      __extends(MustacheView, _super);

      function MustacheView() {
        MustacheView.__super__.constructor.apply(this, arguments);
      }

      MustacheView.prototype.render = function() {
        var context, model;
        if (this.model) {
          context = this.model;
        } else if (this.collection) {
          context = {
            collection: (function() {
              var _i, _len, _ref, _results;
              _ref = this.collection.models;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                model = _ref[_i];
                _results.push(model.attributes);
              }
              return _results;
            }).call(this)
          };
        } else {
          context = {};
        }
        return $(this.el).html(Mustache.render(this.template, context));
      };

      return MustacheView;

    })(Backbone.View);
    CollectionView = (function(_super) {

      __extends(CollectionView, _super);

      function CollectionView() {
        CollectionView.__super__.constructor.apply(this, arguments);
      }

      return CollectionView;

    })(MustacheView);
    exports.FriendSelector = (function(_super) {

      __extends(FriendSelector, _super);

      function FriendSelector() {
        FriendSelector.__super__.constructor.apply(this, arguments);
      }

      FriendSelector.prototype.template = templates.friend_selector;

      FriendSelector.prototype.events = {
        "keyup .search": "render_autocomplete"
      };

      FriendSelector.prototype.initialize = function() {
        return this.friends = this.options["friends"];
      };

      FriendSelector.prototype.search_term = function() {
        return this.$(".search").val() || "";
      };

      FriendSelector.prototype.set_search_term = function(term) {
        this.$(".search").val(term);
        return this.render_autocomplete();
      };

      FriendSelector.prototype.render_autocomplete = function() {
        var matched, term,
          _this = this;
        if (this.search_term()) {
          term = this.search_term().toLowerCase();
          matched = this.friends.filter(function(user) {
            var names;
            names = user.get("name").split(/\s+/);
            return _(names).any(function(name) {
              return name.toLowerCase().indexOf(term) === 0;
            });
          });
          this.autocomplete = new exports.UserAutocomplete({
            collection: new models.Users(matched)
          });
          this.autocomplete.render();
          return this.$(".autocomplete").html(this.autocomplete.el);
        } else {
          return this.$(".autocomplete").html("");
        }
      };

      return FriendSelector;

    })(MustacheView);
    exports.UserAutocomplete = (function(_super) {

      __extends(UserAutocomplete, _super);

      function UserAutocomplete() {
        UserAutocomplete.__super__.constructor.apply(this, arguments);
      }

      UserAutocomplete.prototype.template = templates.user_autocomplete;

      return UserAutocomplete;

    })(MustacheView);
    exports.SelectedUsers = (function(_super) {

      __extends(SelectedUsers, _super);

      function SelectedUsers() {
        SelectedUsers.__super__.constructor.apply(this, arguments);
      }

      SelectedUsers.prototype.template = templates.selected_users;

      return SelectedUsers;

    })(MustacheView);
    return exports;
  });

}).call(this);
