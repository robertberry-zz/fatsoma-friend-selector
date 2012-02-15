(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["models", "templates", "exceptions", "backbone_extensions", "utils"], function(models, templates, exceptions, extensions, utils) {
    var exports;
    exports = {};
    exports.FriendSelector = (function(_super) {

      __extends(FriendSelector, _super);

      function FriendSelector() {
        FriendSelector.__super__.constructor.apply(this, arguments);
      }

      FriendSelector.prototype.template = templates.friend_selector;

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
        selected_friends.on("remove", _.bind(this.remaining_friends.add, this.remaining_friends));
        this.search = new exports.SearchInput;
        this.search.render();
        return this.search.on("autocomplete", _.bind(this.do_autocomplete, this));
      };

      FriendSelector.prototype.do_autocomplete = function(terms) {
        var matched,
          _this = this;
        if (terms.length > 0 && _.any(terms)) {
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
          this.$(".autocomplete_box").html(this.autocomplete.el);
          this.autocomplete.on("select", _.bind(this.select_user, this));
          this.autocomplete.on("focus_input", function() {
            return _this.search.$el.focus();
          });
          return this.autocomplete.render();
        } else {
          return this.$(".autocomplete_box").html("");
        }
      };

      FriendSelector.prototype.select_user = function(user) {
        this.selected.add_model(user);
        return this.search.set_query("");
      };

      FriendSelector.prototype.render = function() {
        FriendSelector.__super__.render.apply(this, arguments);
        this.$(".selected").html(this.selected.el);
        return this.$(".search_box").html(this.search.el);
      };

      return FriendSelector;

    })(extensions.MustacheView);
    exports.SearchInput = (function(_super) {

      __extends(SearchInput, _super);

      function SearchInput() {
        SearchInput.__super__.constructor.apply(this, arguments);
      }

      SearchInput.prototype.tagName = "input";

      SearchInput.prototype.attributes = {
        type: "text",
        "class": "search"
      };

      SearchInput.prototype.events = {
        "keyup": "on_key_up"
      };

      SearchInput.prototype.on_key_up = function(event) {
        if (event.keyCode === utils.keyCodes.KEY_DOWN) {
          return this.trigger("focus_autocomplete");
        } else {
          return this.trigger("autocomplete", this.terms());
        }
      };

      SearchInput.prototype.full_query = function() {
        return this.$el.val() || "";
      };

      SearchInput.prototype.set_query = function(query) {
        this.$el.val(query);
        return this.trigger("autocomplete", this.terms());
      };

      SearchInput.prototype.terms = function() {
        return this.full_query().toLowerCase().split(/\s+/);
      };

      return SearchInput;

    })(Backbone.View);
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

      UserAutocompleteItem.prototype.focus = function() {};

      UserAutocompleteItem.prototype.unfocus = function() {};

      return UserAutocompleteItem;

    })(extensions.MustacheView);
    exports.UserAutocomplete = (function(_super) {

      __extends(UserAutocomplete, _super);

      function UserAutocomplete() {
        UserAutocomplete.__super__.constructor.apply(this, arguments);
      }

      UserAutocomplete.prototype.item_view = exports.UserAutocompleteItem;

      UserAutocomplete.prototype.attributes = {
        "class": "autocomplete"
      };

      UserAutocomplete.prototype.events = {
        "keydown": "on_key_down"
      };

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

      UserAutocomplete.prototype.focused = false;

      UserAutocomplete.prototype.focused_item = null;

      UserAutocomplete.prototype.on_key_down = function(event) {
        if (event.keyCode === utils.keyCodes.KEY_UP) {
          return this.prev();
        } else if (event.keyCode === utils.keyCodes.KEY_DOWN) {
          return this.next();
        }
      };

      UserAutocomplete.prototype.prev = function() {
        if (this.focused_item === 0) {
          return this.trigger("focus_input");
        } else {
          return this.focus_item(this.focused_item - 1);
        }
      };

      UserAutocomplete.prototype.next = function() {
        if (this.focused_item === this.items.length - 1) {
          return this.focus_item(0);
        } else {
          return this.focus_item(this.focused_item + 1);
        }
      };

      UserAutocomplete.prototype.select = function(model) {
        return this.trigger("select", model);
      };

      UserAutocomplete.prototype.focus_item = function(n) {
        if (n >= this.items.length) {
          throw new exceptions.InvalidArgumentError("Attempting to focus item " + ("" + n + " but autocomplete only has " + this.items.length + " items."));
        }
        if (n < 0) {
          throw new exceptions.InvalidArgumentError("Attempting to focus item " + ("" + n + "."));
        }
        if (this.focused_item !== n) {
          if (this.focused_item) this.items[this.focused_item].unfocus();
          this.items[n].focus();
          return this.focused_item = n;
        }
      };

      UserAutocomplete.prototype.float = function() {
        var left, top, _ref;
        _ref = this.$el.offset(), top = _ref.top, left = _ref.left;
        this.$el.css("position", "absolute");
        this.$el.css("top", top);
        return this.$el.css("left", left);
      };

      UserAutocomplete.prototype.render = function() {
        UserAutocomplete.__super__.render.apply(this, arguments);
        return this.float();
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
