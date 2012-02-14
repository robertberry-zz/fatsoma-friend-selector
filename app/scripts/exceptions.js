(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function() {
    var exports;
    exports = {};
    exports.Exception = (function(_super) {

      __extends(Exception, _super);

      function Exception() {
        Exception.__super__.constructor.apply(this, arguments);
      }

      Exception.prototype.initialize = function(message) {
        this.message = message;
      };

      return Exception;

    })(Error);
    exports.InvalidArgumentError = (function(_super) {

      __extends(InvalidArgumentError, _super);

      function InvalidArgumentError() {
        InvalidArgumentError.__super__.constructor.apply(this, arguments);
      }

      return InvalidArgumentError;

    })(exports.Exception);
    exports.ClassDefinitionError = (function(_super) {

      __extends(ClassDefinitionError, _super);

      function ClassDefinitionError() {
        ClassDefinitionError.__super__.constructor.apply(this, arguments);
      }

      return ClassDefinitionError;

    })(exports.Exception);
    exports.InstantiationError = (function(_super) {

      __extends(InstantiationError, _super);

      function InstantiationError() {
        InstantiationError.__super__.constructor.apply(this, arguments);
      }

      return InstantiationError;

    })(exports.Exception);
    return exports;
  });

}).call(this);
