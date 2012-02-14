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

  # Returns the last element of a sequence
  exports.last = (seq) ->
    seq[seq.length-1]

  exports.first = (seq) ->
    seq[0]

  exports