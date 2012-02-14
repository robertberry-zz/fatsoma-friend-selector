# Some generic exceptions

define ->
  exports = {}

  # Base exception class
  class exports.Exception extends Error
    initialize: (@message) ->

  # Error thrown when function/method called with a bad argument
  class exports.InvalidArgumentError extends exports.Exception

  # Error thrown when a a class is badly set up
  class exports.ClassDefinitionError extends exports.Exception

  exports
