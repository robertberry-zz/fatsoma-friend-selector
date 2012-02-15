# Utility functions
#
# Author: Robert Berry
# Date: 10th February 2012

define ["jquery", "underscore", "backbone"], ->
  exports = {}

  # Returns whether the given haystack sequence starts with the given needle
  # sequence
  exports.startsWith = (haystack, needle) ->
    haystack.indexOf(needle) == 0

  # Returns the complement of a function (its opposite)
  exports.complement = (f) ->
    -> not f.apply(f, arguments)

  # Some common key codes
  exports.keyCodes =
    KEY_BACKSPACE: 8
    KEY_TAB: 9
    KEY_ENTER: 13
    KEY_SHIFT: 16
    KEY_CTRL: 17
    KEY_ALT: 18
    KEY_ESCAPE: 27
    KEY_DELETE: 46
    KEY_LEFT: 37
    KEY_UP: 38
    KEY_RIGHT: 39
    KEY_DOWN: 40

  # add support for activeElement to browsers that lack it
  try
    document.activeElement
  catch error
    $('*').live 'blur', ->
      document.activeElement = null
    $('*').live 'focus', ->
      document.activeElement = @

  # Allow you to use Backbone.Events as a native CoffeeScript class
  class Events
  _.extend(Events::, Backbone.Events)

  class exports.ElementGroup extends Events
    constructor: (@items) ->

    has: (el) ->
      _(@items).any (item) ->
        item == el

  class exports.FocusGroup extends exports.ElementGroup
    constructor: (items) ->
      super items
      _(@items).invoke "focus", =>
        # may already have had focus with another element
        @focus() unless @has_focus
      _(@items).invoke "blur", =>
        # newly focused element may be in group
        @blur() unless @_has_focus()
      @has_focus = @_has_focus()

    focus: ->
      @has_focus = yes
      @trigger "focus"

    _has_focus: ->
      @has $(document.activeElement)

    blur: ->
      @has_focus = no
      @trigger "blur"

  exports