define ["jquery", "underscore", "backbone"], ->
  exports = {}

  class exports.User extends Backbone.Model
    # expects id, type, name, picture

  class exports.Users extends Backbone.Collection
    model: exports.User

  exports