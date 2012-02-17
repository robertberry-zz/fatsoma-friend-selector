# Views
#
# Author: Robert Berry
# Created: 9th Feb 2012

define ["models", "templates", "exceptions", "backbone_extensions", "utils", \
    "jquery_extensions"], (models, templates, exceptions, extensions, utils) ->
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
      @autocomplete.on "focus_input", =>
        input = @search.$el
        input.get(0).focus()
        # move cursor to end
        input.setCursorPosition(input.val().length)
      @search.on "autocomplete", _.bind(@autocomplete.filter, @autocomplete)
      @search.on "focus_autocomplete", =>
        # might not be any autocomplete items to focus
        try
          @autocomplete.focus()
      @search_focus_group = new utils.FocusGroup [@search.el, @autocomplete.el]
      @search_focus_group.on "focus", _.bind(@autocomplete.show, @autocomplete)
      @search_focus_group.on "blur", _.bind(@autocomplete.hide, @autocomplete)
      @selected_hidden = new exports.SelectedHiddenInputArray
        collection: selected_friends
      @selected_hidden.render()

    # Selects the given user, resets the search query
    select_user: (user) ->
      @selected.collection.add user
      @search.set_query ""

    render: ->
      super
      @$(".selected").html @selected.el
      @$(".search_box").html @search.el
      @$(".autocomplete_box").html @autocomplete.el
      @$(".selected_hidden").html @selected_hidden.el
      # only render here so it's inserted before floated
      @autocomplete.render()

  # Friend search text box
  class exports.SearchInput extends Backbone.View
    tagName: "input",

    attributes:
      type: "text"
      class: "search"
      tabindex: 0

    events:
      "keyup": "on_key_up"
      "keydown": "on_key_down"

    last_search: null

    # If the user presses the down key focus the autocomplete
    on_key_down: (event) ->
      if event.keyCode == utils.keyCodes.KEY_DOWN
        @trigger "focus_autocomplete"

    # When input changes re-render autocomplete
    on_key_up: (event) ->
      if @full_query() != @last_search
        @last_search = @full_query()
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

  # User in the autocomplete dropdown
  class exports.UserAutocompleteItem extends extensions.MustacheView
    tagName: "li"

    template: templates.user_autocomplete_item

    attributes:
      tabindex: 0

    events:
      "click": "on_click"
      "mouseover": "on_mouse_over"
      "mouseout": "unfocus"

    # When clicked fires an event saying the given user has been selected
    on_click: (event) ->
      @trigger "select", @model
      false

    on_mouse_over: ->
      @trigger "focus", @model

    focus: ->
      @$el.focus()

    unfocus: ->
      # pass

    highlight: (terms) ->
      @terms = terms
      @render()

    highlighted_name: ->
      name = @model.attributes.name
      if not @terms
        return name
      # for each name in the name, find the highlighted portion
      names = name.split /\s+/
      names = _(names).map (name) =>
        lower_name = name.toLowerCase()
        matched_terms = _(@terms).filter (term) ->
          lower_name.indexOf(term.toLowerCase()) == 0
        if matched_terms.length > 0
          longest_match = _(matched_terms).max (term) -> term.length
          context =
            highlighted: name.substr 0, longest_match.length
            rest: name.substr longest_match.length
          return Mustache.render templates.highlighted_name, context
        else
          # not matched
          return name

      return names.join " "

  # User autocomplete dropdown
  class exports.UserAutocomplete extends extensions.CollectionView
    item_view: exports.UserAutocompleteItem

    tagName: "ul"

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
      focus_model = _.bind(@focus_model, @)
      @on "refresh", (items) =>
        _(items).invoke "on", "select", select
        _(items).invoke "on", "focus", focus_model
        if @terms
          _(items).invoke "highlight", @terms

    focused: no

    focused_item: null

    # focuses the given model in the dropdown. throws an error if the model is
    # not in the collection
    focus_model: (model) ->
      unless @collection.include model
        throw "Model not in collection."
      n = @collection.indexOf model
      @focus_item(n) if n != -1

    on_key_down: (event) ->
      if event.keyCode == utils.keyCodes.KEY_UP
        @prev()
      else if event.keyCode == utils.keyCodes.KEY_DOWN
        @next()
      else if event.keyCode in [utils.keyCodes.KEY_ENTER, \
          utils.keyCodes.KEY_SPACE]
        @items[@focused_item].$el.click()

    # unfocuses the dropdown
    unfocus: ->
      @focused_item = null
      @focused = no

    # Focuses next item in list
    prev: ->
      if @focused_item == 0
        @trigger "focus_input"
        @unfocus()
      else
        @focus_item(@focused_item - 1)

    # Focuses previous item in list
    next: ->
      if @focused_item == @items.length - 1
        @focus_item 0
      else
        @focus_item(@focused_item + 1)

    # selects the given model, telling observers that it was chosen and
    # focusing the input
    select: (model) ->
      @unfocus()
      @trigger "select", model
      # return user to the input
      @trigger "focus_input"

    # focuses first item in list
    focus: ->
      @focus_item 0

    # focuses the given item in the list by numeric index. throws an error if
    # the item does not exist
    focus_item: (n) ->
      if n >= @items.length
        throw "Attempting to focus item #{n} but autocomplete only " + \
          "has #{@items.length} items."
      if n < 0
        throw "Attempting to focus item #{n}."
      unless @focused_item == n
        if @focused_item
          @items[@focused_item].unfocus()
        @items[n].focus()
        @focused_item = n

    # css fix to make the list float below the text box (is done with absolute
    # positioning; javascript needs to calculate the top and left valuesx)
    float: ->
      if not @floated
        {top, left} = @$el.offset()
        @$el.css "position", "absolute"
        @$el.css "top", top
        @$el.css "left", left
        @floated = yes

    # filters the shown users from the user pool given the search terms
    filter: (terms) ->
      @terms = terms
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
        @collection.remove @collection.models
        @hide()

    # hides the dropdown
    hide: ->
      @$el.hide()

    # shows the dropdown
    show: ->
      return if @collection.models.length == 0
      @$el.show()

    render: ->
      super
      @float()
      @hide() if @collection.models.length == 0

  class exports.SelectedUsersItem extends extensions.MustacheView
    template: templates.selected_users_item

    events:
      "click .remove_button": "remove"

    remove: ->
      @trigger "remove_item", @model

  class exports.SelectedUsers extends extensions.CollectionView
    item_view: exports.SelectedUsersItem

    initialize: ->
      super
      remove = _.bind(@remove_item, @)
      @on "refresh", (items) ->
        _(items).invoke "on", "remove_item", remove

    remove_item: (model) ->
      @collection.remove model

  class exports.SelectedHiddenInput extends extensions.MustacheView
    template: templates.selected_hidden_input

  # Given a collection maintains a list of hidden inputs in an invisible div.
  class exports.SelectedHiddenInputArray extends extensions.CollectionView
    item_view: exports.SelectedHiddenInput

    attributes:
      style: "display:none"

  exports