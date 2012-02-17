# Extensions to base Backbone classes to give missing functionality.
#
# Author: Robert Berry
# Date: 14th February 2012 (Forever alone :()

define ["utils", "jquery", "underscore", "backbone", "mustache/mustache"], \
    (utils) ->
  exports = {}

  # Creates a template context from a model, giving you both access to the
  # attributes directly (rather than through the .attributes property, as
  # you will mostly be just accessing attributes) and also method
  # names. Property names override method names.
  create_context = (view, model) ->
    context = {}
    view_methods = utils.methods view
    model_methods = utils.methods model
    _.extend(context, view_methods)
    _.extend(context, model_methods)
    _.extend(context, model.attributes)
    context

  # Extension of Backbone.View to use Mustache as templating engine. Render
  # will work for either models (in which case the attributes are directly
  # available) or collections (in which case the collection is available under
  # the 'collection' attribute in the context). For more fine-grained control
  # of collections in views see CollectionView below.
  class exports.MustacheView extends Backbone.View
    render: ->
      if @model
        context = new create_context(@, @model)
      else if @collection
        context = {collection: create_context(@, model) for model in \
          @collection.models}
      else
        context = {}
      @$el.html Mustache.render(@template, context)

  # CollectionView for working with a group of views based on a collection. You
  # must specify the sub view class in the @item_view class property. When the
  # collection changes the view will automatically re-render.
  # Fires 'refresh' when the sub views change with a list of them.
  class exports.CollectionView extends Backbone.View
    initialize: ->
      collection = @options["collection"]
      if not collection
        throw new exceptions.InstantiationError("CollectionView must be " + \
          "initialized with a collection.")
      collection.bind "add", _.bind(@render, @)
      collection.bind "remove", _.bind(@render, @)
      @items = {}

    # Re-renders the view and its subviews
    render: ->
      _(@items).invoke "off"
      _(@items).invoke "remove"
      @$el.html ""
      @items = @collection.map (model) =>
        new @item_view model: model
      @trigger "refresh", @items
      for view in @items
        view.render()
        @$el.append view.el

  exports