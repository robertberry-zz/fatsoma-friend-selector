# Specs relating to Backbone extensions

require ["backbone_extensions", "fixtures", "jquery", "underscore", "backbone"], \
    (extensions, fixtures, $, _, Backbone) ->
  describe "CollectionView", ->
    CollectionViewStub = null
    CollectionViewItemStub = null
    ModelStub = null
    CollectionStub = null
    model_attributes = null

    beforeEach ->
      class CollectionViewItemStub extends extensions.MustacheView
        template: ""
      class CollectionViewStub extends extensions.CollectionView
        item_view: CollectionViewItemStub
      class ModelStub extends Backbone.Model
        # pass
      class CollectionStub extends Backbone.Collection
        model: ModelStub
      model_attributes = fixtures.test_models

    describe "sub view rendering", ->
      view = null

      beforeEach ->
        view = new CollectionViewStub
          collection: new CollectionStub model_attributes
        view.render()

      it "should initially render sub views for all items in the collection", ->
        expect(view.items.length).toBe model_attributes.length
        for i in [0..model_attributes.length-1]
          item = view.items[i]
          expect(item.model.attributes).toEqual model_attributes[i]

      it "should add a new sub view when a new item is added to the
          collection", ->
        view.collection.add fixtures.extra_test_model
        expect(view.items.length).toBe model_attributes.length + 1
        expect(_.last(view.items).model.attributes).toEqual \
          fixtures.extra_test_model

      it "should remove the sub view when an item is removed from the
          collection", ->
        view.collection.remove view.collection.models[0]
        expect(view.items.length).toBe model_attributes.length - 1
        expect(_.first(view.items).model.attributes).toEqual \
          model_attributes[1]

      it "should contain the root elements of all its sub views", ->
        view.render()
        for sub_view in view.items
          expect($.contains(view.el, sub_view.el)).toBeTruthy()
