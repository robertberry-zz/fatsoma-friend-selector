# Extensions to base Backbone classes to give missing functionality.
#
# Author: Robert Berry
# Date: 14th February 2012 (Forever alone :()

define ["jquery", "underscore", "backbone", "mustache/mustache"], ->
  exports = {}

  # Extension of Backbone.View to use Mustache as templating engine. Render
  # will work for either models (in which case the attributes are directly
  # available) or collections (in which case the collection is available under
  # the 'collection' attribute in the context). For more fine-grained control
  # of collections in views see CollectionView below.
  class exports.MustacheView extends Backbone.View
    render: ->
      if @model
        context = @model.attributes
      else if @collection
        context = {collection: model.attributes for model in @collection.models}
      else
        context = {}
      @$el.html Mustache.render(@template, context)

  # CollectionView for working with a group of views based on a collection. You
  # must specify the sub view class in the @item_view class property. When the
  # collection changes the view will automatically re-render.
  class exports.CollectionView extends Backbone.View
    initialize: ->
      collection = @options["collection"]
      if not collection
        throw new exceptions.InstantiationError("CollectionView must be " + \
          "initialized with a collection.")
      collection.bind "add", _.bind(@add_model, @)
      collection.bind "remove", _.bind(@remove_model, @)
      @items = _(collection.models).map (model) =>
        new @item_view model: model

    # Adds a model to the view and re-renders
    add_model: (model) ->
      # Hmm not sure I like this. This is basically so if you call add_model
      # directly, rather than adding a model to the collection, it adds it to
      # the collection, which will then re-trigger this method. Maybe some
      # refactoring is in order.
      if not @collection.include model
        @collection.add model
        return
      @trigger "add", model
      @items.push new @item_view model: model
      @render()

    # Removes a model from the view and re-renders
    remove_model: (model) ->
      if @collection.include model
        @collection.remove model
        return
      @trigger "remove", model
      @items = _.reject @items, (view) ->
        view.model.id == model.id
      @render()

    # Re-renders the view and its subviews
    render: ->
      @$el.html ""
      for view in @items
        view.render()
        @$el.append view.el

  exports