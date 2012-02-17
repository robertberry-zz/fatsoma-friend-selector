(function() {

  require(["jquery_extensions"], function() {
    return describe("setCursorPosition", function() {
      var input;
      input = null;
      beforeEach(function() {
        input = $('<input type="text" id="test_input" />');
        input.val("looooooooooooooooooooooooooooooool");
        return $(document.body).append(input);
      });
      afterEach(function() {
        return input.remove();
      });
      return it("should set the position of the cursor in the text box", function() {
        input.setCursorPosition(5);
        return expect(input.getCursorPosition()).toEqual(5);
      });
    });
  });

}).call(this);
