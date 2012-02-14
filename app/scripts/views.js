(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["models", "templates", "exceptions", "backbone_extensions"], function(models, templates, exceptions, extensions) {
    var exports;
    exports = {};
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
        var selected_friends;
        this.friends = this.options["friends"];
        selected_friends = new models.Users(this.options["selected"]);
        this.selected = new exports.SelectedUsers({
          collection: selected_friends
        });
        this.selected.render();
        this.remaining_friends = new models.Users(this.friends.without(selected_friends.models));
        selected_friends.on("add", _.bind(this.remaining_friends.remove, this.remaining_friends));
        return selected_friends.on("remove", _.bind(this.remaining_friends.add, this.remaining_friends));
      };

      FriendSelector.prototype.position_dropdown = function() {
        var dropdown, left, search_input, top, _ref;
        dropdown = this.$('.autocomplete');
        search_input = this.$('input.search');
        _ref = dropdown.offset(), top = _ref.top, left = _ref.left;
        dropdown.css("position", "absolute");
        dropdown.css("top", top);
        dropdown.css("left", left);
        return dropdown.css("width", search_input.css("width"));
      };

      FriendSelector.prototype.search_term = function() {
        return this.$(".search").val() || "";
      };

      FriendSelector.prototype.set_search_term = function(term) {
        this.$(".search").val(term);
        return this.render_autocomplete();
      };

      FriendSelector.prototype.render_autocomplete = function() {
        var matched, terms,
          _this = this;
        if (this.search_term()) {
          terms = this.search_term().toLowerCase().split(/\s+/);
          matched = this.remaining_friends.filter(function(user) {
            return _(terms).all(function(term) {
              var names;
              names = user.get("name").split(/\s+/);
              return _(names).any(function(name) {
                return name.toLowerCase().indexOf(term) === 0;
              });
            });
          });
          this.autocomplete = new exports.UserAutocomplete({
            collection: new models.Users(matched)
          });
          this.$(".autocomplete").html(this.autocomplete.el);
          this.autocomplete.on("select", _.bind(this.select_user, this));
          return this.autocomplete.render();
        } else {
          return this.$(".autocomplete").html("");
        }
      };

      FriendSelector.prototype.select_user = function(user) {
        this.selected.add_model(user);
        this.$(".search").val("");
        return this.render_autocomplete();
      };

      FriendSelector.prototype.render = function() {
        FriendSelector.__super__.render.apply(this, arguments);
        this.$(".selected").html(this.selected.el);
        return this.position_dropdown();
      };

      return FriendSelector;

    })(extensions.MustacheView);
    exports.UserAutocompleteItem = (function(_super) {

      __extends(UserAutocompleteItem, _super);

      function UserAutocompleteItem() {
        UserAutocompleteItem.__super__.constructor.apply(this, arguments);
      }

      UserAutocompleteItem.prototype.events = {
        "click": "on_click"
      };

      UserAutocompleteItem.prototype.template = templates.user_autocomplete_item;

      UserAutocompleteItem.prototype.on_click = function(event) {
        return this.trigger("select", this.model);
      };

      return UserAutocompleteItem;

    })(extensions.MustacheView);
    exports.UserAutocomplete = (function(_super) {

      __extends(UserAutocomplete, _super);

      function UserAutocomplete() {
        UserAutocomplete.__super__.constructor.apply(this, arguments);
      }

      UserAutocomplete.prototype.item_view = exports.UserAutocompleteItem;

      UserAutocomplete.prototype.initialize = function() {
        var select;
        UserAutocomplete.__super__.initialize.apply(this, arguments);
        select = _.bind(this.select, this);
        _(this.items).invoke("on", "select", select);
        this.on("add", function(subView) {
          return subView.on("select", select);
        });
        return this.on("remove", function(subView) {
          return subView.off("select", select);
        });
      };

      UserAutocomplete.prototype.select = function(model) {
        return this.trigger("select", model);
      };

      return UserAutocomplete;

    })(extensions.CollectionView);
    exports.SelectedUsersItem = (function(_super) {

      __extends(SelectedUsersItem, _super);

      function SelectedUsersItem() {
        SelectedUsersItem.__super__.constructor.apply(this, arguments);
      }

      SelectedUsersItem.prototype.template = templates.selected_users_item;

      return SelectedUsersItem;

    })(extensions.MustacheView);
    exports.SelectedUsers = (function(_super) {

      __extends(SelectedUsers, _super);

      function SelectedUsers() {
        SelectedUsers.__super__.constructor.apply(this, arguments);
      }

      SelectedUsers.prototype.item_view = exports.SelectedUsersItem;

      return SelectedUsers;

    })(extensions.CollectionView);
    return exports;
  });

}).call(this);
