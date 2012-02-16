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
    $(document).on 'blur', '*', ->
      document.activeElement = null
    $(document).on 'focus', '*', ->
      document.activeElement = @

  # I found a bug in jQuery.contains where it's returning true more often than
  # it should. This is a workaround till they fix it
  exports.contains = (elem1, elem2) ->
    return no if elem1 == elem2
    try
      $(elem1)[0].contains($(elem2)[0])
    catch error
      no

  # Allow you to use Backbone.Events as a native CoffeeScript class
  class Events
  _.extend(Events::, Backbone.Events)

  class exports.ElementGroup extends Events
    constructor: (items) ->
      @items = _(items).map (item) -> $(item)

    has: (el) ->
      _(@items).any (item) ->
        item.is(el) || exports.contains(item, el)

  # Allows you to keep track of the focus of a group of elements (and their
  # children). Takes a list of elements and fires 'focus' events when any
  # element in the group attains focus and 'blur' events when all elements in
  # the group lose focus.
  class exports.FocusGroup extends exports.ElementGroup
    constructor: (items) ->
      super items
      refresh = _.bind(@_refresh_focus, @)
      $(document).on "focus", "*", refresh
      _(@items).invoke "on", "blur", =>
        # for some reason on blur the body is momentarily the activeElement,
        # which would cause this to always think it's been deselected. So I
        # have to use a timeout here to compensate.
        clearTimeout(@checkBlur) if @checkBlur
        @checkBlur = setTimeout(refresh, 100)
      @_refresh_focus()

    _refresh_focus: ->
      focused = @_has_focus()
      if @has_focus and not focused
        @trigger "blur"
      if not @has_focus and focused
        @trigger "focus"
      @has_focus = focused

    _has_focus: ->
      @has $(document.activeElement)

  exports