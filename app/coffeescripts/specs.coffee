require ["views", "utils", "models", "fixtures", "jquery"], \
    (views, utils, models, fixtures) ->
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
