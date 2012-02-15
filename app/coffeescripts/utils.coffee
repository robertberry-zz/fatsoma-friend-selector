# Utility functions
#
# Author: Robert Berry
# Date: 10th February 2012

define ->
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

  exports