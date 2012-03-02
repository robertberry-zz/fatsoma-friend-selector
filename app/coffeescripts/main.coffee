# Main - this is so I can test how the script actually looks rather than just
# using automated tests.
#
# Author: Robert Berry
# Created: 10th February 2012

# Bootstrap non-AMD-compliant modules (see
# http://backbonetutorials.com/organizing-backbone-using-modules/)
includes = [
  "order!lib/jquery",
  "order!lib/underscore",
  "order!lib/backbone",
  "app"
]

require includes, (_, _, _, app) ->
  selector = app.from_ajax "./friend-list"
