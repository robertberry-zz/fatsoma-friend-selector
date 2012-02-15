(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["jquery", "underscore", "backbone"], function() {
    var Events, exports;
    exports = {};
    exports.startsWith = function(haystack, needle) {
      return haystack.indexOf(needle) === 0;
    };
    exports.complement = function(f) {
      return function() {
        return !f.apply(f, arguments);
      };
    };
    exports.keyCodes = {
      KEY_BACKSPACE: 8,
      KEY_TAB: 9,
      KEY_ENTER: 13,
      KEY_SHIFT: 16,
      KEY_CTRL: 17,
      KEY_ALT: 18,
      KEY_ESCAPE: 27,
      KEY_DELETE: 46,
      KEY_LEFT: 37,
      KEY_UP: 38,
      KEY_RIGHT: 39,
      KEY_DOWN: 40
    };
    try {
      document.activeElement;
    } catch (error) {
      $('*').live('blur', function() {
        return document.activeElement = null;
      });
      $('*').live('focus', function() {
        return document.activeElement = this;
      });
    }
    Events = (function() {

      function Events() {}

      return Events;

    })();
    _.extend(Events.prototype, Backbone.Events);
    exports.ElementGroup = (function(_super) {

      __extends(ElementGroup, _super);

      function ElementGroup(items) {
        this.items = items;
      }

      ElementGroup.prototype.has = function(el) {
        return _(this.items).any(function(item) {
          return item === el;
        });
      };

      return ElementGroup;

    })(Events);
    exports.FocusGroup = (function(_super) {

      __extends(FocusGroup, _super);

      function FocusGroup(items) {
        var _this = this;
        FocusGroup.__super__.constructor.call(this, items);
        _(this.items).invoke("focus", function() {
          if (!_this.has_focus) return _this.focus();
        });
        _(this.items).invoke("blur", function() {
          if (!_this._has_focus()) return _this.blur();
        });
        this.has_focus = this._has_focus();
      }

      FocusGroup.prototype.focus = function() {
        this.has_focus = true;
        return this.trigger("focus");
      };

      FocusGroup.prototype._has_focus = function() {
        return this.has($(document.activeElement));
      };

      FocusGroup.prototype.blur = function() {
        this.has_focus = false;
        return this.trigger("blur");
      };

      return FocusGroup;

    })(exports.ElementGroup);
    return exports;
  });

}).call(this);
