# Views
#
# Author: Robert Berry
# Created: 9th Feb 2012

define ["models", "templates", "jquery", "underscore", "backbone", \
    "mustache/mustache"], (models, templates) ->
  exports = {}

  class MustacheView extends Backbone.View
    render: ->
      if @model
        context = @model
      else if @collection
        context = {collection: @collection}
      else
        context = {}
      $(@el).html Mustache.render(@template, @model)

  # Main view
  class exports.FriendSelector extends MustacheView
    template: templates.friend_selector

    events:
      "keypress .search": "render_autocomplete"

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

  # Autocomplete dropdown
  class exports.UserAutocomplete extends MustacheView
    template: templates.user_autocomplete

  exports