(function() {

  require(["utils", "jquery", "underscore", "backbone"], function(utils) {
    describe("contains", function() {
      var elem1, elem2;
      elem1 = null;
      elem2 = null;
      beforeEach(function() {
        elem1 = $("<div></div>");
        return elem2 = $("<p></p>");
      });
      describe("when elem1 contains elem2", function() {
        beforeEach(function() {
          return elem1.append(elem2);
        });
        return it("should report elem1 contains elem2", function() {
          return expect(utils.contains(elem1, elem2)).toBeTruthy();
        });
      });
      return describe("when elem1 does not contain elem2", function() {
        return it("should not report elem1 contains elem2", function() {
          return expect(utils.contains(elem1, elem2)).toBeFalsy();
        });
      });
    });
    describe("ElementGroup", function() {
      var all_elems, elem_group, elems, other_elems;
      elem_group = null;
      elems = null;
      other_elems = null;
      all_elems = null;
      beforeEach(function() {
        elems = [1, 2, 3, 4, 5].map(function(n) {
          return $("<div id='div_" + n + "'></div>");
        });
        other_elems = [6, 7, 8, 9, 10].map(function(n) {
          return $("<div id='div_" + n + "'></div>");
        });
        elem_group = new utils.ElementGroup(elems);
        all_elems = elems.concat(other_elems);
        return _(all_elems).each(function(elem) {
          return $(document.body).append(elem);
        });
      });
      afterEach(function() {
        return _(all_elems).each(function(elem) {
          return elem.remove();
        });
      });
      it("should know what elements it contains", function() {
        var elem, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = elems.length; _i < _len; _i++) {
          elem = elems[_i];
          _results.push(expect(elem_group.has(elem)).toBeTruthy());
        }
        return _results;
      });
      return it("should know what elements it does not contain", function() {
        var elem, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = other_elems.length; _i < _len; _i++) {
          elem = other_elems[_i];
          _results.push(expect(elem_group.has(elem)).toBeFalsy());
        }
        return _results;
      });
    });
    return describe("FocusGroup", function() {
      var focus_group, inputs, some_other_input;
      focus_group = null;
      inputs = null;
      some_other_input = null;
      beforeEach(function() {
        inputs = [1, 2, 3, 4, 5].map(function(n) {
          return $("<input type='text' id='input_" + n + "' />");
        });
        some_other_input = $('<input type="text" id="not_included">');
        return focus_group = new utils.FocusGroup(inputs);
      });
      describe("when it has not got focus", function() {
        it("should have focus if one of its elements gets focus", function() {
          inputs[0].focus();
          return expect(focus_group.has_focus).toBeTruthy();
        });
        return it("should fire a focus event if one of its elements gets focus", function() {
          var callback;
          callback = jasmine.createSpy();
          focus_group.on("focus", callback);
          inputs[0].focus();
          return expect(callback).toHaveBeenCalled();
        });
      });
      return describe("when it has focus", function() {
        beforeEach(function() {
          return inputs[0].focus();
        });
        it("should still have focus if another of its elements gets focus", function() {
          inputs[1].focus();
          return expect(focus_group.has_focus).toBeTruthy();
        });
        it("should not fire a focus event if another of its element gets focus", function() {
          var callback;
          callback = jasmine.createSpy();
          focus_group.on("focus", callback);
          inputs[1].focus();
          return expect(callback).not.toHaveBeenCalled();
        });
        return it("should fire a blur event if all of its elements lose focus", function() {
          var callback;
          callback = jasmine.createSpy();
          focus_group.on("blur", callback);
          some_other_input.focus();
          inputs[0].blur();
          return expect(callback).toHaveBeenCalled();
        });
      });
    });
  });

}).call(this);
