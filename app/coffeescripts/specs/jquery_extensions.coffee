# Specs for jQuery extensions

require ["jquery", "jquery_extensions"], ($) ->
  describe "setCursorPosition", ->
    input = null

    beforeEach ->
      input = $ '<input type="text" id="test_input" />'
      input.val "looooooooooooooooooooooooooooooool"
      $(document.body).append input

    afterEach ->
      input.remove()

    it "should set the position of the cursor in the text box", ->
      input.setCursorPosition 5
      expect(input.getCursorPosition()).toEqual 5