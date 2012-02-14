# Views
#
# Author: Robert Berry
# Created: 9th Feb 2012

define ["models", "templates", "exceptions", "backbone_extensions"], \
    (models, templates, exceptions, extensions) ->
  exports = {}

  # Main view
  class exports.FriendSelector extends extensions.MustacheView
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
      @render_autocomplete()

    render: ->
      super
      @$(".selected").html @selected.el

  class exports.UserAutocompleteItem extends extensions.MustacheView
    events:
      "click": "on_click"

    template: templates.user_autocomplete_item

    # When clicked fires an event saying the given user has been selected
    on_click: (event) ->
      @trigger "select", @model

  # Autocomplete dropdown
  class exports.UserAutocomplete extends extensions.CollectionView
    item_view: exports.UserAutocompleteItem

    initialize: ->
      super
      select = _.bind(@select, @)
      _(@items).invoke "on", "select", select
      @on "add", (subView) -> subView.on "select", select
      @on "remove", (subView) -> subView.off "select", select

    select: (model) ->
      @trigger "select", model

  class exports.SelectedUsersItem extends extensions.MustacheView
    template: templates.selected_users_item

  class exports.SelectedUsers extends extensions.CollectionView
    item_view: exports.SelectedUsersItem

  exports