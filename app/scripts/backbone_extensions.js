(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["utils", "jquery", "underscore", "backbone", "mustache/mustache"], function(utils) {
    var create_context, exports;
    exports = {};
    create_context = function(view, model) {
      var context, model_methods, view_methods;
      context = {};
      view_methods = utils.methods(view);
      model_methods = utils.methods(model);
      _.extend(context, view_methods);
      _.extend(context, model_methods);
      _.extend(context, model.attributes);
      return context;
    };
    exports.MustacheView = (function(_super) {

      __extends(MustacheView, _super);

      function MustacheView() {
        MustacheView.__super__.constructor.apply(this, arguments);
      }

      MustacheView.prototype.render = function() {
        var context, model;
        if (this.model) {
          context = new create_context(this, this.model);
        } else if (this.collection) {
          context = {
            collection: (function() {
              var _i, _len, _ref, _results;
              _ref = this.collection.models;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                model = _ref[_i];
                _results.push(create_context(this, model));
              }
              return _results;
            }).call(this)
          };
        } else {
          context = {};
        }
        return this.$el.html(Mustache.render(this.template, context));
      };

      return MustacheView;

    })(Backbone.View);
    exports.CollectionView = (function(_super) {

      __extends(CollectionView, _super);

      function CollectionView() {
        CollectionView.__super__.constructor.apply(this, arguments);
      }

      CollectionView.prototype.initialize = function() {
        var collection;
        collection = this.options["collection"];
        if (!collection) {
          throw new exceptions.InstantiationError("CollectionView must be " + "initialized with a collection.");
        }
        collection.bind("add", _.bind(this.render, this));
        collection.bind("remove", _.bind(this.render, this));
        return this.items = {};
      };

      CollectionView.prototype.render = function() {
        var view, _i, _len, _ref, _results,
          _this = this;
        _(this.items).invoke("off");
        _(this.items).invoke("remove");
        this.$el.html("");
        this.items = this.collection.map(function(model) {
          return new _this.item_view({
            model: model
          });
        });
        this.trigger("refresh", this.items);
        _ref = this.items;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          view.render();
          _results.push(this.$el.append(view.el));
        }
        return _results;
      };

      return CollectionView;

    })(Backbone.View);
    return exports;
  });

}).call(this);
