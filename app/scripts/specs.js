(function() {

  require(["specs/utils", "specs/backbone_extensions"], function() {});

  require(["views", "utils", "models", "exceptions", "fixtures"], function(views, utils, models, exceptions, fixtures) {
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
          toBeEmpty: function() {
            var contents;
            contents = $(this.actual).html();
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
          return search_box = selector.search;
        });
        afterEach(function() {
          return search_box = null;
        });
        it("should be initially empty", function() {
          return expect(search_box.full_query()).toBeFalsy();
        });
        it("should fire autocomplete when input changes", function() {
          var callback;
          callback = jasmine.createSpy();
          search_box.on("autocomplete", callback);
          search_box.$el.keyup();
          return expect(callback).toHaveBeenCalled();
        });
        return it("should fire focus autocomplete event when pressing down arrow", function() {
          var callback, event_stub;
          callback = jasmine.createSpy();
          search_box.on("focus_autocomplete", callback);
          event_stub = {
            keyCode: utils.keyCodes.KEY_DOWN
          };
          search_box.on_key_up(event_stub);
          return expect(callback).toHaveBeenCalled();
        });
      });
      describe("autocomplete dropdown", function() {
        var autocomplete;
        autocomplete = null;
        beforeEach(function() {
          return autocomplete = selector.$(".autocomplete_box");
        });
        it("should be initially empty", function() {
          return expect(autocomplete.children(".autocomplete").html()).toBeFalsy();
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
            selector.search.set_query(search_term);
            return view = selector.autocomplete;
          });
          it("should be populated", function() {
            return expect(autocomplete).not.toBeEmpty();
          });
          describe("keyboard behaviour", function() {
            it("should focus the next item in the list if the user presses the             down key", function() {
              var event_stub;
              view.focus_item(0);
              spyOn(view, "focus_item");
              view.delegateEvents();
              event_stub = {
                keyCode: utils.keyCodes.KEY_DOWN
              };
              view.on_key_down(event_stub);
              return expect(view.focus_item).toHaveBeenCalledWith(1);
            });
            it("should focus the previous item in the list if the user presses              the up key", function() {
              var event_stub;
              view.focus_item(1);
              spyOn(view, "focus_item");
              view.delegateEvents();
              event_stub = {
                keyCode: utils.keyCodes.KEY_UP
              };
              view.on_key_down(event_stub);
              return expect(view.focus_item).toHaveBeenCalledWith(0);
            });
            describe("when the first item in the list is selected", function() {
              beforeEach(function() {
                return view.focus_item(0);
              });
              return it("should focus the search input if the user presses the up                key", function() {
                var callback, event_stub;
                callback = jasmine.createSpy();
                view.on("focus_input", callback);
                event_stub = {
                  keyCode: utils.keyCodes.KEY_UP
                };
                view.on_key_down(event_stub);
                expect(view.focused).toBeFalsy();
                return expect(callback).toHaveBeenCalled();
              });
            });
            return describe("when the last item in the list is selected", function() {
              beforeEach(function() {
                return view.focus_item(view.items.length - 1);
              });
              return it("should focus the first item in the list if the user presses the                down arrow key", function() {
                var event_stub;
                event_stub = {
                  keyCode: utils.keyCodes.KEY_DOWN
                };
                view.on_key_down(event_stub);
                return expect(view.focused_item).toBe(0);
              });
            });
          });
          describe("the view's collection", function() {
            it("should contain three users (given the fixtures)", function() {
              return expect(view.collection.length).toBe(3);
            });
            it("should contain three users regardless of the case of the search              term", function() {
              selector.search.set_query(search_term.toUpperCase());
              view = selector.autocomplete;
              expect(view.collection.length).toBe(3);
              selector.search.set_query(search_term.toLowerCase());
              view = selector.autocomplete;
              return expect(view.collection.length).toBe(3);
            });
            it("should list all of the user's friends one of whose names begin with              the search term", function() {
              var collection_ids, id, matched_friends, _i, _len, _ref, _results;
              matched_friends = _(fixtures.friends).filter(match_search_term);
              collection_ids = view.collection.pluck("id");
              _ref = _(matched_friends).pluck("id");
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                id = _ref[_i];
                _results.push(expect(collection_ids).toContain(id));
              }
              return _results;
            });
            it("should not list any of the user's friends whose names do not              contain the search term", function() {
              var collection_ids, id, match_not_search_term, unmatched_friends, _i, _len, _ref, _results;
              match_not_search_term = utils.complement(match_search_term);
              unmatched_friends = _(fixtures.friends).filter(match_not_search_term);
              collection_ids = view.collection.pluck("id");
              _ref = _(unmatched_friends).pluck("id");
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                id = _ref[_i];
                _results.push(expect(collection_ids).not.toContain(id));
              }
              return _results;
            });
            return it("should match one user exactly when the full name is given", function() {
              selector.search.set_query(selector.friends.models[0].attributes.name);
              view = selector.autocomplete;
              expect(view.collection.length).toBe(1);
              return expect(view.collection.models[0].attributes).toEqual(fixtures.friends[0]);
            });
          });
          describe("when an item is clicked", function() {
            return it("should fire the select event with the proper model", function() {
              var callback, first_sub_view;
              callback = jasmine.createSpy();
              view.on("select", callback);
              first_sub_view = view.items[0];
              first_sub_view.$el.click();
              return expect(callback).toHaveBeenCalledWith(first_sub_view.model);
            });
          });
          return describe("the html", function() {
            return it("should contain the names of all the matched users", function() {
              var name, user, _i, _len, _ref, _results;
              _ref = view.collection.models;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                user = _ref[_i];
                name = user.get("name");
                _results.push(expect(autocomplete.html()).toContain(name));
              }
              return _results;
            });
          });
        });
      });
      return describe("selected list", function() {
        var list, selected;
        list = null;
        selected = null;
        beforeEach(function() {
          list = selector.$('.selected');
          return selected = selector.selected;
        });
        it("should remove selected items from the autocomplete dropdown", function() {
          var first_friend;
          first_friend = selector.friends.models[0];
          selected.collection.add(first_friend);
          selector.search.set_query(first_friend.attributes.name);
          return expect(selector.autocomplete.collection.models).not.toContain(first_friend);
        });
        return describe("when I press remove a selected friend", function() {
          var first_friend;
          first_friend = null;
          beforeEach(function() {
            first_friend = selector.friends.models[0];
            selected.collection.add(first_friend);
            return selected.items[0].remove();
          });
          it("the friend should not appear in the selected friends", function() {
            return expect(selected.collection.models).toNotContain(first_friend);
          });
          return it("the friend should appear in the autocomplete when I search for        their name", function() {
            selector.search.set_query(first_friend.attributes.name);
            return expect(selector.autocomplete.collection.models).toContain(first_friend);
          });
        });
      });
    });
  });

}).call(this);
