# Views
#
# Author: Robert Berry
# Created: 9th Feb 2012

define ["models", "templates", "exceptions", "backbone_extensions", "utils"], \
    (models, templates, exceptions, extensions, utils) ->
  exports = {}

  # Main view
  class exports.FriendSelector extends extensions.MustacheView
    template: templates.friend_selector

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
      @search = new exports.SearchInput
      @search.render()
      @autocomplete = new exports.UserAutocomplete
        collection: new models.Users
        user_pool: @remaining_friends
      @autocomplete.on "select", _.bind(@select_user, @)
      @autocomplete.on "focus_search", =>
        @search.$el.focus()
      @search.on "autocomplete", _.bind(@autocomplete.filter, @autocomplete)
      #@search.on "focus_autocomplete", _.bind(@autocomplete.focus, @autocomplete)
      #@search.on "hide_autocomplete", _.bind(@autocomplete.hide, @autocomplete)
      #@search.on "show_autocomplete", _.bind(@autocomplete.show, @autocomplete)

    # Selects the given user, resets the search query
    select_user: (user) ->
      @selected.add_model user
      @search.set_query ""

    render: ->
      super
      @$(".selected").html @selected.el
      @$(".search_box").html @search.el
      @$(".autocomplete_box").html @autocomplete.el
      # only render here so it's inserted before floated
      @autocomplete.render()

  class exports.SearchInput extends Backbone.View
    tagName: "input",

    attributes:
      type: "text"
      class: "search"

    events:
      "keyup": "on_key_up"
      "focus": -> @trigger "show_autocomplete"
      "blur": -> @trigger "hide_autocomplete"

    # Key presses either fire re-rendering of the autocomplete, or if it's the
    # down key focuses the first element of the autocomplete
    on_key_up: (event) ->
      if event.keyCode == utils.keyCodes.KEY_DOWN
        @trigger "focus_autocomplete"
      else
        @trigger "autocomplete", @terms()

    # Returns the full query as entered by the user
    full_query: ->
      @$el.val() || ""

    # Sets the query
    set_query: (query) ->
      @$el.val query
      @trigger "autocomplete", @terms()

    # Returns the search terms (separate words)
    terms: ->
      @full_query().toLowerCase().split /\s+/

  class exports.UserAutocompleteItem extends extensions.MustacheView
    events:
      "click": "on_click"

    template: templates.user_autocomplete_item

    # When clicked fires an event saying the given user has been selected
    on_click: (event) ->
      @trigger "select", @model

    focus: ->
      @$el.addClass "focused"

    unfocus: ->
      @$el.removeClass "focused"

  # Autocomplete dropdown
  class exports.UserAutocomplete extends extensions.CollectionView
    item_view: exports.UserAutocompleteItem

    attributes:
      class: "autocomplete"

    events:
      "keydown": "on_key_down"

    # should specify a 'user_pool' from which the users are taken to populate
    # the dropdown (maybe this behaviour should be moved to a controller?)
    initialize: ->
      super
      @user_pool = @options["user_pool"]
      select = _.bind(@select, @)
      _(@items).invoke "on", "select", select
      @on "add", (subView) -> subView.on "select", select
      @on "remove", (subView) -> subView.off "select", select

    focused: no

    focused_item: null

    on_key_down: (event) ->
      if event.keyCode == utils.keyCodes.KEY_UP
        @prev()
      else if event.keyCode == utils.keyCodes.KEY_DOWN
        @next()

    # Focuses next item in list
    prev: ->
      if @focused_item == 0
        @trigger "focus_input"
      else
        @focus_item(@focused_item - 1)

    # Focuses previous item in list
    next: ->
      if @focused_item == @items.length - 1
        @focus_item 0
      else
        @focus_item(@focused_item + 1)

    select: (model) ->
      @trigger "select", model

    focus: ->
      @focus_item 0

    focus_item: (n) ->
      if n >= @items.length
        throw new exceptions.InvalidArgumentError("Attempting to focus item " +
          "#{n} but autocomplete only has #{@items.length} items.")
      if n < 0
        throw new exceptions.InvalidArgumentError("Attempting to focus item " +
          "#{n}.")
      unless @focused_item == n
        if @focused_item
          @items[@focused_item].unfocus()
        @items[n].focus()
        @focused_item = n

    float: ->
      if not @floated
        {top, left} = @$el.offset()
        @$el.css "position", "absolute"
        @$el.css "top", top
        @$el.css "left", left
        @floated = yes

    # filters the shown users from the user pool given the search terms
    filter: (terms) ->
      if terms && terms.length > 0 && _.any terms
        query = (user) =>
          _(terms).all (term) =>
            names = user.get("name").split /\s+/
            _(names).any (name) ->
              name.toLowerCase().indexOf(term) == 0
        @collection.remove @collection.models
        @collection.add @user_pool.filter query
        @show()
      else
        @hide()

    hide: ->
      @$el.hide()

    show: ->
      @$el.show()

    render: ->
      super
      @float()

  class exports.SelectedUsersItem extends extensions.MustacheView
    template: templates.selected_users_item

  class exports.SelectedUsers extends extensions.CollectionView
    item_view: exports.SelectedUsersItem

  exports