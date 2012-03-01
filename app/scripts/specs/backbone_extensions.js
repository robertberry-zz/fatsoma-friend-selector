(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  require(["backbone_extensions", "fixtures", "jquery", "underscore", "backbone"], function(extensions, fixtures, $, _, Backbone) {
    return describe("CollectionView", function() {
      var CollectionStub, CollectionViewItemStub, CollectionViewStub, ModelStub, model_attributes;
      CollectionViewStub = null;
      CollectionViewItemStub = null;
      ModelStub = null;
      CollectionStub = null;
      model_attributes = null;
      beforeEach(function() {
        CollectionViewItemStub = (function(_super) {

          __extends(CollectionViewItemStub, _super);

          function CollectionViewItemStub() {
            CollectionViewItemStub.__super__.constructor.apply(this, arguments);
          }

          CollectionViewItemStub.prototype.template = "";

          return CollectionViewItemStub;

        })(extensions.MustacheView);
        CollectionViewStub = (function(_super) {

          __extends(CollectionViewStub, _super);

          function CollectionViewStub() {
            CollectionViewStub.__super__.constructor.apply(this, arguments);
          }

          CollectionViewStub.prototype.item_view = CollectionViewItemStub;

          return CollectionViewStub;

        })(extensions.CollectionView);
        ModelStub = (function(_super) {

          __extends(ModelStub, _super);

          function ModelStub() {
            ModelStub.__super__.constructor.apply(this, arguments);
          }

          return ModelStub;

        })(Backbone.Model);
        CollectionStub = (function(_super) {

          __extends(CollectionStub, _super);

          function CollectionStub() {
            CollectionStub.__super__.constructor.apply(this, arguments);
          }

          CollectionStub.prototype.model = ModelStub;

          return CollectionStub;

        })(Backbone.Collection);
        return model_attributes = fixtures.test_models;
      });
      return describe("sub view rendering", function() {
        var view;
        view = null;
        beforeEach(function() {
          view = new CollectionViewStub({
            collection: new CollectionStub(model_attributes)
          });
          return view.render();
        });
        it("should initially render sub views for all items in the collection", function() {
          var i, item, _ref, _results;
          expect(view.items.length).toBe(model_attributes.length);
          _results = [];
          for (i = 0, _ref = model_attributes.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
            item = view.items[i];
            _results.push(expect(item.model.attributes).toEqual(model_attributes[i]));
          }
          return _results;
        });
        it("should add a new sub view when a new item is added to the          collection", function() {
          view.collection.add(fixtures.extra_test_model);
          expect(view.items.length).toBe(model_attributes.length + 1);
          return expect(_.last(view.items).model.attributes).toEqual(fixtures.extra_test_model);
        });
        it("should remove the sub view when an item is removed from the          collection", function() {
          view.collection.remove(view.collection.models[0]);
          expect(view.items.length).toBe(model_attributes.length - 1);
          return expect(_.first(view.items).model.attributes).toEqual(model_attributes[1]);
        });
        return it("should contain the root elements of all its sub views", function() {
          var sub_view, _i, _len, _ref, _results;
          view.render();
          _ref = view.items;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            sub_view = _ref[_i];
            _results.push(expect($.contains(view.el, sub_view.el)).toBeTruthy());
          }
          return _results;
        });
      });
    });
  });

}).call(this);
