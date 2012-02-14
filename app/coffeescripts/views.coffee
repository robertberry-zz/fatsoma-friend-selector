# Views
#
# Author: Robert Berry
# Created: 9th Feb 2012

define ["models", "templates", "exceptions", "jquery", "underscore", \
    "backbone", "mustache/mustache"], (models, templates, exceptions) ->
  exports = {}

  # Extension of Backbone.View to use Mustache as templating engine. Render
  # will work for either models (in which case the attributes are directly
  # available) or collections (in which case the collection is available under
  # the 'collection' attribute in the context). For more fine-grained control
  # of collections in views see CollectionView below.
  class exports.MustacheView extends Backbone.View
    render: ->
      if @model
        context = @model.attributes
      else if @collection
        context = {collection: model.attributes for model in @collection.models}
      else
        context = {}
      @$el.html Mustache.render(@template, context)

  # CollectionView for working with a group of views based on a collection. You
  # must specify the sub view class in the @item_view class property. When the
  # collection changes the view will automatically re-render.
  class exports.CollectionView extends Backbone.View
    initialize: ->
      collection = @options["collection"]
      if not collection
        throw new exceptions.InstantiationError("CollectionView must be " + \
          "initialized with a collection.")
      collection.bind "add", _.bind(@add_model, @)
      collection.bind "remove", _.bind(@remove_model, @)
      @items = _(collection.models).map (model) =>
        new @item_view model: model

    # Adds a model to the view and re-renders
    add_model: (model) ->
      # Hmm not sure I like this. This is basically so if you call add_model
      # directly, rather than adding a model to the collection, it adds it to
      # the collection, which will then re-trigger this method. Maybe some
      # refactoring is in order.
      if not @collection.include model
        @collection.add model
        return
      @trigger "add", model
      @items.push new @item_view model: model
      @render()

    # Removes a model from the view and re-renders
    remove_model: (model) ->
      if @collection.include model
        @collection.remove model
        return
      @trigger "remove", model
      @items = _.reject @items, (view) ->
        view.model.id == model.id
      @render()

    # Re-renders the view and its subviews
    render: ->
      @$el.html ""
      for view in @items
        view.render()
        @$el.append view.el

  # Main view
  class exports.FriendSelector extends exports.MustacheView
    template: templates.friend_selector

    events:
      "keyup .search": "render_autocomplete"

    initialize: ->
      @friends = @options["friends"]
      selected_friends = new models.Users(@options["selected"])
      @selected = new exports.SelectedUsers
        collection: selected_friends
      @selected.render()
      @remaining_friends = new models.Users(@friends.without( \
        selected_friends.models))
      selected_friends.on "add", _.bind(@remaining_friends.remove, \
        @remaining_friends)
      selected_friends.on "remove", _.bind(@remaining_friends.add, \
        @remaining_friends)

    # The current search term
    search_term: ->
      @$(".search").val() || ""

    # Sets the search term and renders the dropdown
    set_search_term: (term) ->
      @$(".search").val term
      @render_autocomplete()

    # Renders the autocomplete dropdown
    # (Maybe this should be moved to a controller?)
    render_autocomplete: ->
      if @search_term()
        terms = @search_term().toLowerCase().split /\s+/
        matched = @remaining_friends.filter (user) =>
          _(terms).all (term) =>
            names = user.get("name").split /\s+/
            _(names).any (name) ->
              name.toLowerCase().indexOf(term) == 0
        @autocomplete = new exports.UserAutocomplete
          collection: new models.Users matched
        @autocomplete.render()
        @autocomplete.on "select", _.bind(@select_user, @)
        @$(".autocomplete").html @autocomplete.el
      else
        @$(".autocomplete").html ""

    select_user: (user) ->
      @selected.add_model user

    render: ->
      super
      @$(".selected").html @selected.el

  class exports.UserAutocompleteItem extends exports.MustacheView
    events:
      "click": "on_click"

    template: templates.user_autocomplete_item

    # When clicked fires an event saying the given user has been selected
    on_click: (event) ->
      @trigger "select", @model

  # Autocomplete dropdown
  class exports.UserAutocomplete extends exports.CollectionView
    item_view: exports.UserAutocompleteItem

    initialize: ->
      super
      select = _.bind(@select, @)
      _(@items).invoke "on", "select", select
      @on "add", (subView) -> subView.on "select", select
      @on "remove", (subView) -> subView.off "select", select

    select: (model) ->
      @trigger "select", model

  class exports.SelectedUsersItem extends exports.MustacheView
    template: templates.selected_users_item

  class exports.SelectedUsers extends exports.CollectionView
    item_view: exports.SelectedUsersItem

  exports