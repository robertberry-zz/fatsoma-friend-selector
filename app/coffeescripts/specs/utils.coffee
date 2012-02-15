# Specs for utils file
require ["utils", "jquery", "underscore", "backbone"], (utils) ->
  describe "ElementGroup", ->
    elem_group = null
    elems = null
    other_elems = null
    all_elems = null

    beforeEach ->
      elems = [1..5].map (n) ->
        $ "<div id='div_#{n}'></div>"
      other_elems = [6..10].map (n) ->
        $ "<div id='div_#{n}'></div>"
      elem_group = new utils.ElementGroup(elems)
      all_elems = elems.concat other_elems
      _(all_elems).each (elem) ->
        $(document.body).append elem

    afterEach ->
      _(all_elems).each (elem) ->
        elem.remove()

    it "should know what elements it contains", ->
      for elem in elems
        expect(elem_group.has(elem)).toBeTruthy()

    it "should know what elements it does not contain", ->
      for elem in other_elems
        expect(elem_group.has(elem)).toBeFalsy()

  describe "FocusGroup", ->
    focus_group = null
    inputs = null
    some_other_input = null

    beforeEach ->
      inputs = [1..5].map (n) ->
        $ "<input type='text' id='input_#{n}' />"
      some_other_input = $ '<input type="text" id="not_included">'
      focus_group = new utils.FocusGroup inputs

    describe "when it has not got focus", ->
      it "should have focus if one of its elements gets focus", ->
        inputs[0].focus()
        expect(focus_group.has_focus).toBeTruthy()

      it "should fire a focus event if one of its elements gets focus", ->
        callback = jasmine.createSpy()
        focus_group.on "focus", callback
        inputs[0].focus()
        expect(callback).toHaveBeenCalled()

    describe "when it has focus", ->
      beforeEach ->
        inputs[0].focus()

      it "should still have focus if another of its elements gets focus", ->
        inputs[1].focus()
        expect(focus_group.has_focus).toBeTruthy()

      it "should not fire a focus event if another of its element gets focus", ->
        callback = jasmine.createSpy()
        focus_group.on "focus", callback
        inputs[1].focus()
        expect(callback).not.toHaveBeenCalled()

      it "should fire a blur event if all of its elements lose focus", ->
        callback = jasmine.createSpy()
        focus_group.on "blur", callback
        some_other_input.focus()
        inputs[0].blur()
        expect(callback).toHaveBeenCalled()
