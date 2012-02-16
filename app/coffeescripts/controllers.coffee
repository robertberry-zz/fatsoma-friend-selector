

define ["jquery", "underscore", "backbone"], ->
  exports = {}

  # Base controller class - just a stub for now
  class Controller extends Backbone.Events
    # pass

  class ElementGroup extends Backbone.Events
    initialize: (items) ->
      @items = _.map $, items

    has: (el) ->
      _(@items).any (item) ->
        item == el || $.contains(item, el)

  class FocusGroup extends ElementGroup
    initialize: (items) ->
      @items = _.map $, items
      _(@items).invoke "focus", _.bind(@focus, @)
      _(@items).invoke "blur", _.bind(@blur, @)

    focus: ->
      @trigger "focus"

    blur: ->
      unless @has $(document.activeElement)
        @trigger "blur"

  exports