(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["jquery", "underscore", "backbone"], function() {
    var exports;
    exports = {};
    exports.startsWith = function(haystack, needle) {
      return haystack.indexOf(needle) === 0;
    };
    exports.methods = function(object) {
      var method_name, method_names, methods, _i, _len;
      method_names = _.functions(object);
      methods = {};
      for (_i = 0, _len = method_names.length; _i < _len; _i++) {
        method_name = method_names[_i];
        methods[method_name] = _.bind(object[method_name], object);
      }
      return methods;
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
      $(document).on('blur', '*', function() {
        return document.activeElement = null;
      });
      $(document).on('focus', '*', function() {
        return document.activeElement = this;
      });
    }
    exports.contains = function(elem1, elem2) {
      if (elem1 === elem2) return false;
      try {
        return $(elem1)[0].contains($(elem2)[0]);
      } catch (error) {
        return false;
      }
    };
    exports.Events = (function() {

      function Events() {}

      return Events;

    })();
    _.extend(exports.Events.prototype, Backbone.Events);
    exports.ElementGroup = (function(_super) {

      __extends(ElementGroup, _super);

      function ElementGroup(items) {
        this.items = _(items).map(function(item) {
          return $(item);
        });
      }

      ElementGroup.prototype.has = function(el) {
        return _(this.items).any(function(item) {
          return item.is(el) || exports.contains(item, el);
        });
      };

      return ElementGroup;

    })(exports.Events);
    exports.FocusGroup = (function(_super) {

      __extends(FocusGroup, _super);

      function FocusGroup(items) {
        var check_blur, refresh,
          _this = this;
        FocusGroup.__super__.constructor.call(this, items);
        refresh = _.bind(this._refresh_focus, this);
        $(document).on("focus", "*", refresh);
        check_blur = function() {
          if (_this.checkBlur) clearTimeout(_this.checkBlur);
          return _this.checkBlur = setTimeout(refresh, 100);
        };
        _(this.items).invoke("on", "blur", check_blur);
        _(this.items).invoke("on", "blur", "*", check_blur);
        this._refresh_focus();
      }

      FocusGroup.prototype._refresh_focus = function() {
        var focused;
        focused = this._has_focus();
        if (this.has_focus && !focused) this.trigger("blur");
        if (!this.has_focus && focused) this.trigger("focus");
        return this.has_focus = focused;
      };

      FocusGroup.prototype._has_focus = function() {
        return this.has($(document.activeElement));
      };

      return FocusGroup;

    })(exports.ElementGroup);
    return exports;
  });

}).call(this);
