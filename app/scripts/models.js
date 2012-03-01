(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["jquery", "underscore", "backbone"], function($, _, Backbone) {
    var exports;
    exports = {};
    exports.User = (function(_super) {

      __extends(User, _super);

      function User() {
        User.__super__.constructor.apply(this, arguments);
      }

      User.prototype.type_icon = function() {
        var type;
        type = this.get('type');
        return "./images/icons/" + type + ".png";
      };

      return User;

    })(Backbone.Model);
    exports.Users = (function(_super) {

      __extends(Users, _super);

      function Users() {
        Users.__super__.constructor.apply(this, arguments);
      }

      Users.prototype.model = exports.User;

      return Users;

    })(Backbone.Collection);
    return exports;
  });

}).call(this);
