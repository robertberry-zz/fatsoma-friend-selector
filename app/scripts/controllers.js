(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["utils", "jquery", "underscore", "backbone"], function() {
    var Controller, exports;
    exports = {};
    Controller = (function(_super) {

      __extends(Controller, _super);

      function Controller() {
        Controller.__super__.constructor.apply(this, arguments);
      }

      return Controller;

    })(utils.Events);
    return exports;
  });

}).call(this);
