# Main - this is so I can test how the script actually looks rather than just
# using automated tests.
#
# Author: Robert Berry
# Created: 10th February 2012

define ["views", "fixtures", "models", "jquery"], (views, fixtures, models) ->
  selector = new views.FriendSelector
    el: $("#selector")
    friends: new models.Users fixtures.friends
  selector.render()


