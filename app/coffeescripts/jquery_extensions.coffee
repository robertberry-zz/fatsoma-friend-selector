# Extension functions to jQuery

require ["jquery"], ->
  # Sets cursor position in a text box. Code adapted from:
  # http://stackoverflow.com/questions/499126/jquery-
  # set-cursor-position-in-text-area
  $.fn.setCursorPosition = (pos) ->
    elem = $(@).get 0
    if elem.setSelectionRange
      elem.setSelectionRange pos, pos
    else if elem.createTextRange
      range = elem.createTextRange()
      range.collapse true
      range.moveEnd 'character', pos
      range.moveStart 'character', pos
      range.select()

  # Get cursor position in a text box. Code adapted from:
  # http://stackoverflow.com/questions/263743/how-to-get-cursor-
  # position-in-textarea
  $.fn.getCursorPosition = (pos) ->
    elem = $(@).get 0
    if elem.selectionStart
      return elem.selectionStart
    else if document.selection
      elem.focus()

      r = document.selection.createRange()
      return 0 if r == null

      re = el.createTextRange()
      rc = re.duplicate()

      re.moveToBookmark r.getBookmark()
      rc.setEndPoint 'EndToStart', re

      return rc.text.length
    else
      return 0
