# Views
#
# Author: Robert Berry
# Created: 9th Feb 2012

define ["models", "templates", "exceptions", "jquery", "underscore", \
    "backbone", "mustache/mustache"], (models, templates, exceptions) ->
  exports = {}

  class exports.MustacheView extends Backbone.View
    render: ->
      if @model
        context = @model.attributes
      else if @collection
        context = {collection: model.attributes for model in @collection.models}
      else
        context = {}
      @$el.html Mustache.render(@template, context)

  class exports.CollectionView extends Backbone.View
    initialize: ->
      collection = @options["collection"]
      collection.bind "add", _.bind(@addModel, @)
      collection.bind "remove", _.bind(@removeModel, @)
      @items = _(collection.models).map (model) =>
        new @item_view model: model

    addModel: (model) ->
      @trigger "add", model
      @items.push new @item_view model: model
      @render()

    removeModel: (model) ->
      @trigger "remove", model
      @items = _.reject @items, (view) ->
        view.model.id == model.id
      @render()

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

    # The current search term
    search_term: ->
      @$(".search").val() || ""

    # Sets the search term and renders the dropdown
    set_search_term: (term) ->
      @$(".search").val term
      @render_autocomplete()

    # Renders the autocomplete dropdown
    render_autocomplete: ->
      if @search_term()
        term = @search_term().toLowerCase()
        matched = @friends.filter (user) =>
          names = user.get("name").split /\s+/
          _(names).any (name) ->
            name.toLowerCase().indexOf(term) == 0
        @autocomplete = new exports.UserAutocomplete
          collection: new models.Users(matched)
        @autocomplete.render()
        @$(".autocomplete").html @autocomplete.el
      else
        @$(".autocomplete").html ""

  class exports.UserAutocompleteItem extends exports.MustacheView
    events:
      "click": "onClick"

    template: templates.user_autocomplete_item

    # When clicked fires an event saying the given user has been selected
    onClick: (event) ->
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

  class exports.SelectedUsers extends exports.MustacheView
    template: templates.selected_users

  exports