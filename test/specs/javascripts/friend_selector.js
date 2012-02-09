(function() {

  describe("FriendSelector", function() {
    var elems, selector;
    selector = null;
    elems = null;
    beforeEach(function() {
      elems = $('<div id="selector">\n  <input type="text" class="search" />\n  <div class="autocomplete"></div>\n  <div class="selected"></div>\n  <input type="submit" />\n</div>');
      $("body").append(elems);
      return selector = new fatsoma.friend_selector.views.FriendSelector({
        el: $("#selector")
      });
    });
    afterEach(function() {
      selector = null;
      elems.remove();
      return elems = null;
    });
    return describe("search box", function() {
      var search_box;
      search_box = null;
      beforeEach(function() {
        return search_box = selector.$(".search");
      });
      afterEach(function() {
        return search_box = null;
      });
      it("should be initially empty", function() {
        return expect(search_box.val()).toBeFalsy();
      });
      it("should update the FriendSelector search term when content changes", function() {
        var name, _i, _len, _ref, _results;
        _ref = ["Rob", "Chris", "Paul", "James", "Aaron"];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          search_box.val(name);
          _results.push(expect(search_box.val()).toEqual(selector.search_term()));
        }
        return _results;
      });
      return it("should try to render an autocomplete dropdown when input changes", function() {
        spyOn(selector, "render_autocomplete");
        selector.delegateEvents();
        search_box.keypress();
        return expect(selector.render_autocomplete).toHaveBeenCalled();
      });
    });
  });

}).call(this);
