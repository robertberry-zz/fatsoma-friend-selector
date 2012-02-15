(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["jquery", "underscore", "backbone"], function() {
    var Controller, ElementGroup, FocusGroup, exports;
    exports = {};
    Controller = (function(_super) {

      __extends(Controller, _super);

      function Controller() {
        Controller.__super__.constructor.apply(this, arguments);
      }

      return Controller;

    })(Backbone.Events);
    ElementGroup = (function(_super) {

      __extends(ElementGroup, _super);

      function ElementGroup() {
        ElementGroup.__super__.constructor.apply(this, arguments);
      }

      ElementGroup.prototype.initialize = function(items) {
        return this.items = _.map($, items);
      };

      ElementGroup.prototype.has = function(el) {
        return _(this.items).any(function(item) {
          return item === el || $.contains(item, el);
        });
      };

      return ElementGroup;

    })(Backbone.Events);
    FocusGroup = (function(_super) {

      __extends(FocusGroup, _super);

      function FocusGroup() {
        FocusGroup.__super__.constructor.apply(this, arguments);
      }

      FocusGroup.prototype.initialize = function(items) {
        this.items = _.map($, items);
        _(this.items).invoke("focus", _.bind(this.focus, this));
        return _(this.items).invoke("blur", _.bind(this.blur, this));
      };

      FocusGroup.prototype.focus = function() {
        return this.trigger("focus");
      };

      FocusGroup.prototype.blur = function() {
        if (!this.has($(document.activeElement))) return this.trigger("blur");
      };

      return FocusGroup;

    })(ElementGroup);
    return exports;
  });

}).call(this);
