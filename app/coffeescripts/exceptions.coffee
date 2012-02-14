# Some generic exceptions

define ->
  exports = {}

  # Base exception class
  class exports.Exception extends Error
    initialize: (@message) ->

  # Error thrown when function/method called with a bad argument
  class exports.InvalidArgumentError extends exports.Exception

  # Error thrown when a class is badly set up
  class exports.ClassDefinitionError extends exports.Exception

  # Error thrown when trying to create an object with bad parameters
  class exports.InstantiationError extends exports.Exception

  exports
