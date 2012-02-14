(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  require(["views", "utils", "models", "exceptions", "fixtures", "jquery", "underscore", "backbone"], function(views, utils, models, exceptions, fixtures) {
    describe("CollectionView", function() {
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

        })(views.MustacheView);
        CollectionViewStub = (function(_super) {

          __extends(CollectionViewStub, _super);

          function CollectionViewStub() {
            CollectionViewStub.__super__.constructor.apply(this, arguments);
          }

          CollectionViewStub.prototype.item_view = CollectionViewItemStub;

          return CollectionViewStub;

        })(views.CollectionView);
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
      describe("sub view rendering", function() {
        var view;
        view = null;
        beforeEach(function() {
          return view = new CollectionViewStub({
            collection: new CollectionStub(model_attributes)
          });
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
          return expect(utils.last(view.items).model.attributes).toEqual(fixtures.extra_test_model);
        });
        return it("should remove the sub view when an item is removed from the          collection", function() {
          view.collection.remove(view.collection.models[0]);
          expect(view.items.length).toBe(model_attributes.length - 1);
          return expect(utils.first(view.items).model.attributes).toEqual(model_attributes[1]);
        });
      });
      return it("should contain the root elements of all its sub views", function() {
        var sub_view, _i, _len, _ref, _results;
        view.render();
        _ref = view.items;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sub_view = _ref[_i];
          _results.push(expect($(view.el).contains(sub_view.el)).toBeTruthy());
        }
        return _results;
      });
    });
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
          toBeVisible: function() {
            return $(this.actual).is(":visible");
          },
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
          search_box.keyup();
          return expect(selector.render_autocomplete).toHaveBeenCalled();
        });
      });
      describe("autocomplete dropdown", function() {
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
            return expect(autocomplete).not.toBeEmpty();
          });
          describe("the view's collection", function() {
            it("should contain three users (given the fixtures)", function() {
              return expect(view.collection.length).toBe(3);
            });
            it("should contain three users regardless of the case of the search              term", function() {
              selector.set_search_term(search_term.toUpperCase());
              view = selector.autocomplete;
              expect(view.collection.length).toBe(3);
              selector.set_search_term(search_term.toLowerCase());
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
            return it("should not list any of the user's friends whose names do not              contain the search term", function() {
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
        var list;
        list = null;
        beforeEach(function() {
          return list = selector.$('.selected');
        });
        return afterEach(function() {
          return list = null;
        });
      });
    });
  });

}).call(this);
