# Views
#
# Author: Robert Berry
# Created: 9th Feb 2012

define ["models", "templates", "jquery", "underscore",
  "backbone", "mustache/mustache"], (models, templates) ->
  exports = {}

  class MustacheView extends Backbone.View
    render: ->
      $(@el).html Mustache.render(@template, @model || {})

  class exports.FriendSelector extends MustacheView
    template: templates.friend_selector

    events:
      "keypress .search": "render_autocomplete"

    initialize: ->
      @friends = @options["friends"]

    search_term: ->
      @$(".search").val() || ""

    set_search_term: (term) ->
      @$(".search").val term
      @render_autocomplete()

    render_autocomplete: ->
      if @search_term()
        term = @search_term().toLowerCase()
        matched = @friends.filter (user) =>
          console.debug user.get("name")
          user.get("name").toLowerCase().indexOf term != -1
        @autocomplete = new exports.UserAutocomplete(collection: matched)
        @autocomplete.render()
        @$(".autocomplete").html @autocomplete.el
      else
        @$(".autocomplete").html ""

  class exports.UserAutocomplete extends MustacheView
    template: templates.user_autocomplete

  exports