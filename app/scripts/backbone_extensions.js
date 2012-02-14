(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["jquery", "underscore", "backbone", "mustache/mustache"], function() {
    var exports;
    exports = {};
    exports.MustacheView = (function(_super) {

      __extends(MustacheView, _super);

      function MustacheView() {
        MustacheView.__super__.constructor.apply(this, arguments);
      }

      MustacheView.prototype.render = function() {
        var context, model;
        if (this.model) {
          context = this.model.attributes;
        } else if (this.collection) {
          context = {
            collection: (function() {
              var _i, _len, _ref, _results;
              _ref = this.collection.models;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                model = _ref[_i];
                _results.push(model.attributes);
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
        var collection,
          _this = this;
        collection = this.options["collection"];
        if (!collection) {
          throw new exceptions.InstantiationError("CollectionView must be " + "initialized with a collection.");
        }
        collection.bind("add", _.bind(this.add_model, this));
        collection.bind("remove", _.bind(this.remove_model, this));
        return this.items = _(collection.models).map(function(model) {
          return new _this.item_view({
            model: model
          });
        });
      };

      CollectionView.prototype.add_model = function(model) {
        if (!this.collection.include(model)) {
          this.collection.add(model);
          return;
        }
        this.trigger("add", model);
        this.items.push(new this.item_view({
          model: model
        }));
        return this.render();
      };

      CollectionView.prototype.remove_model = function(model) {
        if (this.collection.include(model)) {
          this.collection.remove(model);
          return;
        }
        this.trigger("remove", model);
        this.items = _.reject(this.items, function(view) {
          return view.model.id === model.id;
        });
        return this.render();
      };

      CollectionView.prototype.render = function() {
        var view, _i, _len, _ref, _results;
        this.$el.html("");
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
