# Specs
#
# The Jasmine specs file for the project. Describes the behaviour of all the
# components. To run these tests open SpecRunner.html in your browser.
#
# Author: Robert Berry
# Date: February 10th 2012

require ["views", "utils", "models", "exceptions", "fixtures", \
    "backbone_extensions", "jquery", "underscore", "backbone"], \
    (views, utils, models, exceptions, fixtures, extensions) ->
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

      it "should initially render sub views for all items in the collection", ->
        expect(view.items.length).toBe model_attributes.length
        for i in [0..model_attributes.length-1]
          item = view.items[i]
          expect(item.model.attributes).toEqual model_attributes[i]

      it "should add a new sub view when a new item is added to the
          collection", ->
        view.collection.add fixtures.extra_test_model
        expect(view.items.length).toBe model_attributes.length + 1
        expect(utils.last(view.items).model.attributes).toEqual \
          fixtures.extra_test_model

      it "should remove the sub view when an item is removed from the
          collection", ->
        view.collection.remove view.collection.models[0]
        expect(view.items.length).toBe model_attributes.length - 1
        expect(utils.first(view.items).model.attributes).toEqual \
          model_attributes[1]

      it "should contain the root elements of all its sub views", ->
        view.render()
        for sub_view in view.items
          expect($.contains(view.el, sub_view.el)).toBeTruthy()

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
        search_box = selector.search

      afterEach ->
        search_box = null

      it "should be initially empty", ->
        expect(search_box.full_query()).toBeFalsy()

      it "should fire autocomplete when input changes", ->
        callback = jasmine.createSpy()
        search_box.on "autocomplete", callback
        search_box.$el.keyup()
        expect(callback).toHaveBeenCalled()

      it "should fire focus autocomplete event when pressing down arrow", ->
        callback = jasmine.createSpy()
        search_box.on "focus_autocomplete", callback
        event_stub =
          keyCode: utils.keyCodes.KEY_DOWN
        search_box.on_key_up event_stub
        expect(callback).toHaveBeenCalled()

    describe "autocomplete dropdown", ->
      autocomplete = null

      beforeEach ->
        autocomplete = selector.$(".autocomplete_box")

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
          selector.search.set_query search_term
          view = selector.autocomplete

        it "should be populated", ->
          expect(autocomplete).not.toBeEmpty()

        describe "keyboard behaviour", ->
          it "should focus the next item in the list if the user presses the
             down key", ->
            # focus first elem
            view.focus_item(0)
            spyOn view, "focus_item"
            # you must call delegateEvents after spying on a method that will
            # be called via a callback as specified in Backbone.View events
            # hash. this is to do with the the original method being wrapped in
            # a function and that the event triggers the wrapped function, not
            # the wrapper
            view.delegateEvents()
            # see the search_box key down test for why stubbing here
            event_stub =
              keyCode: utils.keyCodes.KEY_DOWN
            view.on_key_down(event_stub)
            expect(view.focus_item).toHaveBeenCalledWith(1)

          it "should focus the previous item in the list if the user presses
              the up key", ->
            # focus second elem
            view.focus_item(1)
            spyOn view, "focus_item"
            view.delegateEvents()
            # see the search_box key down test for why stubbing here
            event_stub =
              keyCode: utils.keyCodes.KEY_UP
            view.on_key_down(event_stub)
            expect(view.focus_item).toHaveBeenCalledWith(0)

          describe "when the first item in the list is selected", ->
            beforeEach ->
              view.focus_item(0)

            it "should focus the search input if the user presses the up
                key", ->
              event_stub =
                keyCode: utils.keyCodes.KEY_UP
              view.on_key_down(event_stub)
              expect(view.focused).toBeFalsy()
              expect(selector.$(".search").is(":focus")).toBeTruthy()

          describe "when the last item in the list is selected", ->
            beforeEach ->
              view.focus_item(view.items.length - 1)

            it "should focus the first item in the list if the user presses the
                down arrow key", ->
              event_stub =
                keyCode: utils.keyCodes.KEY_DOWN
              view.on_key_down(event_stub)
              expect(view.focused_item).toBe 0

        describe "the view's collection", ->
          it "should contain three users (given the fixtures)", ->
            expect(view.collection.length).toBe 3

          it "should contain three users regardless of the case of the search
              term", ->
            selector.search.set_query search_term.toUpperCase()
            view = selector.autocomplete
            expect(view.collection.length).toBe 3
            selector.search.set_query search_term.toLowerCase()
            view = selector.autocomplete
            expect(view.collection.length).toBe 3

          it "should list all of the user's friends one of whose names begin with
              the search term", ->
            matched_friends = _(fixtures.friends).filter match_search_term
            collection_ids = view.collection.pluck "id"
            for id in _(matched_friends).pluck "id"
              expect(collection_ids).toContain id

          it "should not list any of the user's friends whose names do not
              contain the search term", ->
            match_not_search_term = utils.complement(match_search_term)
            unmatched_friends = _(fixtures.friends).filter match_not_search_term
            collection_ids = view.collection.pluck "id"
            for id in _(unmatched_friends).pluck "id"
              expect(collection_ids).not.toContain id

          it "should match one user exactly when the full name is given", ->
            selector.search.set_query selector.friends.models[0].attributes.name
            view = selector.autocomplete
            expect(view.collection.length).toBe 1
            expect(view.collection.models[0].attributes).toEqual \
              fixtures.friends[0]

        describe "when an item is clicked", ->
          it "should fire the select event with the proper model", ->
            callback = jasmine.createSpy()
            view.on "select", callback
            first_sub_view = view.items[0]
            first_sub_view.$el.click()
            expect(callback).toHaveBeenCalledWith(first_sub_view.model)

        describe "the html", ->
          it "should contain the names of all the matched users", ->
            for user in view.collection.models
              name = user.get "name"
              expect(autocomplete.html()).toContain name

    describe "selected list", ->
      list = null
      selected = null

      beforeEach ->
        list = selector.$('.selected')
        selected = selector.selected

      it "should remove selected items from the autocomplete dropdown", ->
        first_friend = selector.friends.models[0]
        selected.add_model first_friend
        selector.search.set_query first_friend.attributes.name
        expect(selector.autocomplete.collection.models).not.toContain first_friend
