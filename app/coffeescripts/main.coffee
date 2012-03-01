# Main - this is so I can test how the script actually looks rather than just
# using automated tests.
#
# Author: Robert Berry
# Created: 10th February 2012

# Bootstrap non-AMD-compliant modules (see
# http://backbonetutorials.com/organizing-backbone-using-modules/)
require ["order!lib/jquery", "order!lib/underscore", "order!lib/backbone"], ->
  require ["jquery", "underscore", "backbone", "views", "fixtures", "models"], \
      ($, _, Backbone, views, fixtures, models) ->
    selector = new views.FriendSelector
      el: $("#selector")
      friends: new models.Users fixtures.friends
    selector.render()

