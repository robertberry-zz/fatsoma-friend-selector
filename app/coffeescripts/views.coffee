# Views
#
# Author: Robert Berry
# Created: 9th Feb 2012

define ["models", "templates", "jquery", "underscore", "backbone"], (models, templates) ->
  exports = {}

  class exports.FriendSelector extends Backbone.View
    events:
      "keypress .search": "_render_autocomplete"

    initialize: ->
      @friends = new models.Users @options["friends"]

    search_term: ->
      @$(".search").val()

    _render_autocomplete: ->
      @render_autocomplete()

    render_autocomplete: ->
      term = @search_term().toLowerCase()
      matched = @friends.filter (user) =>
        user.get("name").toLowerCase().indexOf term != -1
      @$(".autocomplete").html new exports.UserAutocomplete(models: matched)

  class exports.UserAutocomplete extends Backbone.View
    template: templates.user_autocomplete

  exports