# Utility functions
#
# Author: Robert Berry
# Date: 10th February 2012

define ->
  exports = {}

  exports.startsWith = (haystack, needle) ->
    haystack.indexOf(needle) == 0

  exports.complement = (f) ->
    -> not f.apply(f, arguments)

  exports
