includes = [
  "jquery",
  "underscore",
  "backbone",
  "views",
  "models"
]

define includes, ($, _, Backbone, views, models) ->
  # return a function that will create the selector given an array of models
  (friends) ->
    selector = new views.FriendSelector
      el: $("#selector")
      friends: new models.Users friends
    selector.render()
    selector
