(function() {
  var namespace,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  namespace = fatsoma.namespace;

  namespace("fatsoma.friend_selector.models", function(exports) {
    exports.User = (function(_super) {

      __extends(User, _super);

      function User() {
        User.__super__.constructor.apply(this, arguments);
      }

      return User;

    })(Backbone.Model);
    return exports.Users = (function(_super) {

      __extends(Users, _super);

      function Users() {
        Users.__super__.constructor.apply(this, arguments);
      }

      Users.prototype.model = exports.User;

      return Users;

    })(Backbone.Collection);
  });

}).call(this);
