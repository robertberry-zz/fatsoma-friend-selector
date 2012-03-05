# Main - this is so I can test how the script actually looks rather than just
# using automated tests.
#
# Author: Robert Berry
# Created: 10th February 2012

require.config
  paths:
    jquery: "libs/jquery/jquery-min"
    underscore: "libs/underscore/underscore-min"
    backbone: "libs/backbone/backbone-min"

includes = [
  "app",
  "fixtures"
]

require includes, (app, fixtures) ->
  selector = app.from_fixtures fixtures.friends
