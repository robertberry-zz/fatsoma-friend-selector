namespace = fatsoma.namespace

namespace "fatsoma.friend_selector.views", (exports) ->
  models = fatsoma.friend_selector.models

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
    #