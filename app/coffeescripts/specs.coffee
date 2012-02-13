# Specs
#
# The Jasmine specs file for the project. Describes the behaviour of all the
# components. To run these tests open SpecRunner.html in your browser.
#
# Author: Robert Berry
# Date: February 10th 2012

require ["views", "utils", "models", "exceptions", "fixtures", "jquery"], \
    (views, utils, models, exceptions, fixtures) ->
  describe "CollectionView", ->
    CollectionViewStub = null
    CollectionViewItemStub = null
    model_attributes = null

    beforeEach ->
      class CollectionViewItemStub extends views.MustacheView
        # pass
      class CollectionViewStub extends views.CollectionView
        @item_view = CollectionViewItemStub
      model_attributes = fixtures.test_models

    describe "subclass definition", ->
      it "should throw an error if no item view is defined", ->
        # Construct a broken stub instead of the working one set up in
        # beforeEach
        class CollectionViewStub extends views.CollectionView
          item_view = null
        expect(-> new CollectionViewStub).toThrow \
          new exceptions.ClassDefinitionError

      it "should not throw an error if item view is defined", ->
        expect(-> new CollectionViewStub).not.toThrow \
          new exceptions.ClassDefinitionError

    describe "sub view rendering", ->
      view = null

      beforeEach ->
        view = new CollectionViewStub collection: model_attributes

      it "should initially render sub views for all items in the collection", ->
        expect(view.items.length).toBe model_attributes.length
        for i in [0..model_attributes.length]
          item = view.items[i]
          expect(item.prototype).toBe CollectionViewItemStub
          expect(item.model.attributes).toBe model_attributes[i]

      it "should update the sub views to reflect the contents of the collection
          whenever it changes", ->
        view.collection.add fixtures.extra_test_model
        expect(view.items.length).toBe model_attributes.length + 1
        expect(utils.last(view.items).attributes).toBe fixtures.extra_test_model

  describe "FriendSelector", ->
    selector = null
    elem = null
    friends = null

    beforeEach ->
      # create a fake friend selector for testing on
      elem = $('<div id="selector"></div>')
      $("body").append elem

      friends = new models.Users fixtures.friends
      selector = new views.FriendSelector
        el: $("#selector")
        friends: friends
      selector.render()

      @addMatchers
        toBeVisible: () -> $(@actual).is ":visible"
        toBeEmpty: () ->
          contents = $(@actual).html()
          not contents || contents.trim() == ""

    afterEach ->
      elem.remove()
      elem = null

    describe "search box", ->
      search_box = null

      beforeEach ->
        search_box = selector.$(".search")

      afterEach ->
        search_box = null

      it "should be initially empty", ->
        expect(search_box.val()).toBeFalsy()

      it "should render the autocomplete dropdown when input changes", ->
        spyOn selector, "render_autocomplete"
        # you must call delegateEvents after spying on a method that will be
        # called via a callback as specified in Backbone.View events hash. this
        # is to do with the the original method being wrapped in a function and
        # that the event triggers the wrapped function, not the wrapper
        selector.delegateEvents()
        search_box.keyup()
        expect(selector.render_autocomplete).toHaveBeenCalled()

    describe "autocomplete dropdown", ->
      autocomplete = null

      beforeEach ->
        autocomplete = selector.$(".autocomplete")

      it "should be initially empty", ->
        expect(autocomplete).toBeEmpty()

      describe "when a user enters a valid search term", ->
        view = null
        search_term = "Ro"
        # function for matching friend fixtures based on the search term
        match_search_term = (friend) ->
          names = friend.name.split /\s+/
          _(names).any (name) ->
            utils.startsWith name, search_term

        beforeEach ->
          selector.set_search_term search_term
          view = selector.autocomplete

        it "should be populated", ->
          expect(autocomplete).not.toBeEmpty()

        describe "the view's collection", ->
          it "should contain three users (given the fixtures)", ->
            expect(view.collection.length).toBe 3

          it "should contain three users regardless of the case of the search
              term", ->
            selector.set_search_term search_term.toUpperCase()
            view = selector.autocomplete
            expect(view.collection.length).toBe 3
            selector.set_search_term search_term.toLowerCase()
            view = selector.autocomplete
            expect(view.collection.length).toBe 3

          it "should list all of the user's friends one of whose names begin with
              the search term", ->
            matched_friends = _(fixtures.friends).filter match_search_term
            collection_ids = view.collection.pluck("id")
            for id in _(matched_friends).pluck "id"
              expect(collection_ids).toContain id

          it "should not list any of the user's friends whose names do not
              contain the search term", ->
            match_not_search_term = utils.complement(match_search_term)
            unmatched_friends = _(fixtures.friends).filter match_not_search_term
            collection_ids = view.collection.pluck "id"
            for id in _(unmatched_friends).pluck "id"
              expect(collection_ids).not.toContain id

        describe "the html", ->
          it "should contain the names of all the matched users", ->
            for user in view.collection.models
              name = user.get "name"
              expect(autocomplete.html()).toContain name

    describe "selected list", ->
      list = null

      beforeEach ->
        list = selector.$('.selected')

      afterEach ->
        list = null