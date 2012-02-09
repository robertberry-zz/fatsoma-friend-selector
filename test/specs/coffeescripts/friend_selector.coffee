describe "FriendSelector", ->
  selector = null
  elems = null

  beforeEach ->
    # create a fake friend selector for testing on
    elems = $('''
              <div id="selector">
                <input type="text" class="search" />
                <div class="autocomplete"></div>
                <div class="selected"></div>
                <input type="submit" />
              </div>
              ''')

    # add to DOM
    $("body").append elems
    selector = new fatsoma.friend_selector.views.FriendSelector(el: $("#selector"))

  afterEach ->
    selector = null
    # remove from DOM
    elems.remove()
    elems = null

  describe "search box", ->
    search_box = null

    beforeEach ->
      search_box = selector.$(".search")

    afterEach ->
      search_box = null

    it "should be initially empty", ->
      expect(search_box.val()).toBeFalsy()

    it "should update the FriendSelector search term when content changes", ->
      for name in ["Rob", "Chris", "Paul", "James", "Aaron"]
        search_box.val name
        expect(search_box.val()).toEqual selector.search_term()

    it "should try to render an autocomplete dropdown when input changes", ->
      spyOn selector, "render_autocomplete"
      # you must call delegateEvents after spying on a method that will be
      # called via a callback as specified in Backbone.View events hash. this
      # is to do with the the original method being wrapped in a function and
      # that the event triggers the wrapped function, not the wrapper
      selector.delegateEvents()
      search_box.keypress()
      expect(selector.render_autocomplete).toHaveBeenCalled()
