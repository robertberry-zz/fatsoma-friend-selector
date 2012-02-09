# Essential initial import - sets up global namespace and adds
# namespacing utilities and other essential functions
#
# Author: Robert Berry <robert.berry@fatsoma.com>
# Date: 28th June 2011

# Our only global variable
window.fatsoma = {}

# Namespacing utility taken from the CoffeeScript FAQ
# (https://github.com/jashkenas/coffee-script/wiki/FAQ)
#
# Usage:
#   fatsoma.namespace "My.Namespace", (exports) ->
#     exports.test = "hi"
#
#   console.log My.Namespace.test #-> "hi"
#
fatsoma.namespace = (target, name, block) ->
  if arguments.length < 3
    [target, name, block] = [(if typeof exports isnt 'undefined' then exports else window), arguments...]
  top = target
  target = target[item] or= {} for item in name.split '.'
  block target, top
