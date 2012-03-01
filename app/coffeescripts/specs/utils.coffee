# Specs for utils file

require ["utils", "jquery", "underscore", "backbone"], (utils, $, _, Backbone) ->
  describe "contains", ->
    elem1 = null
    elem2 = null

    beforeEach ->
      elem1 = $ "<div></div>"
      elem2 = $ "<p></p>"

    describe "when elem1 contains elem2", ->
      beforeEach ->
        elem1.append elem2

      it "should report elem1 contains elem2", ->
        expect(utils.contains(elem1, elem2)).toBeTruthy()

    describe "when elem1 does not contain elem2", ->
      it "should not report elem1 contains elem2", ->
        expect(utils.contains(elem1, elem2)).toBeFalsy()

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
