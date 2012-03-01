(function() {

  require(["jquery"], function($) {
    $.fn.setCursorPosition = function(pos) {
      var elem, range;
      elem = $(this).get(0);
      if (elem.setSelectionRange) {
        return elem.setSelectionRange(pos, pos);
      } else if (elem.createTextRange) {
        range = elem.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        return range.select();
      }
    };
    return $.fn.getCursorPosition = function(pos) {
      var elem, r, rc, re;
      elem = $(this).get(0);
      if (elem.selectionStart) {
        return elem.selectionStart;
      } else if (document.selection) {
        elem.focus();
        r = document.selection.createRange();
        if (r === null) return 0;
        re = el.createTextRange();
        rc = re.duplicate();
        re.moveToBookmark(r.getBookmark());
        rc.setEndPoint('EndToStart', re);
        return rc.text.length;
      } else {
        return 0;
      }
    };
  });

}).call(this);
