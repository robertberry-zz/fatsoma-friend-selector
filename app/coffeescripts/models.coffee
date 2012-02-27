define ["jquery", "underscore", "backbone"], ->
  exports = {}

  class exports.User extends Backbone.Model
    # expects id, type, name, picture

    type_icon: ->
      type = @get 'type'
      "./images/icons/#{type}.png"

  class exports.Users extends Backbone.Collection
    model: exports.User

  exports