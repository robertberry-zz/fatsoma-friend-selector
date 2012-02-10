(function() {

  require(["views", "utils", "models", "fixtures", "jquery"], function(views, utils, models, fixtures) {
    return describe("FriendSelector", function() {
      var elem, friends, selector;
      selector = null;
      elem = null;
      friends = null;
      beforeEach(function() {
        elem = $('<div id="selector"></div>');
        $("body").append(elem);
        friends = new models.Users(fixtures.friends);
        selector = new views.FriendSelector({
          el: $("#selector"),
          friends: friends
        });
        selector.render();
        return this.addMatchers({
          toBeVisible: function(elem) {
            return $(elem).is(":visible");
          },
          toBeEmpty: function(elem) {
            var contents;
            contents = $(elem).html();
            return !contents || contents.trim() === "";
          }
        });
      });
      afterEach(function() {
        elem.remove();
        return elem = null;
      });
      describe("search box", function() {
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
        return it("should render the autocomplete dropdown when input changes", function() {
          spyOn(selector, "render_autocomplete");
          selector.delegateEvents();
          search_box.keypress();
          return expect(selector.render_autocomplete).toHaveBeenCalled();
        });
      });
      return describe("autocomplete dropdown", function() {
        var autocomplete;
        autocomplete = null;
        beforeEach(function() {
          return autocomplete = selector.$(".autocomplete");
        });
        it("should be initially empty", function() {
          return expect(autocomplete).toBeEmpty();
        });
        return describe("when a user enters a valid search term", function() {
          var match_search_term, search_term, view;
          view = null;
          search_term = "Ro";
          match_search_term = function(friend) {
            var names;
            names = friend.name.split(/\s+/);
            return _(names).any(function(name) {
              return utils.startsWith(name, search_term);
            });
          };
          beforeEach(function() {
            selector.set_search_term(search_term);
            return view = selector.autocomplete;
          });
          it("should be populated", function() {
            console.debug(autocomplete);
            return expect(autocomplete).not.toBeEmpty();
          });
          it("should list all of the user's friends one of whose names begins with            the search term", function() {
            var matched_friends, user, _i, _len, _results;
            matched_friends = _(fixtures.friends).filter(match_search_term);
            _results = [];
            for (_i = 0, _len = matched_friends.length; _i < _len; _i++) {
              user = matched_friends[_i];
              _results.push(expect(view.collection.get(user.id)).toBeTruthy());
            }
            return _results;
          });
          return it("should not list any of the user's friends whose names do not            contain the search term", function() {
            var match_not_search_term, unmatched_friends, user, _i, _len, _results;
            match_not_search_term = utils.complement(match_search_term);
            unmatched_friends = _(fixtures.friends).filter(match_not_search_term);
            _results = [];
            for (_i = 0, _len = unmatched_friends.length; _i < _len; _i++) {
              user = unmatched_friends[_i];
              _results.push(expect(view.collection.get(user.id)).toBeFalsy());
            }
            return _results;
          });
        });
      });
    });
  });

}).call(this);
