# Main
#
# Author: Robert Berry
# Created: 10th February 2012

define ["views", "jquery"], (views) ->
  jQuery ($) ->
    request = $.ajax
      url: "../test/fixtures/friends.json"
      type: "GET"
      dataType: "json"

    request.done (data) ->
      selector = new views.FriendSelector("#selector", data)

    request.fail (jqXHR, textStatus) ->
      alert("Unable to load test fixtures: " + testStatus);

