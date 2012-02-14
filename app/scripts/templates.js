(function() {

  define({
    friend_selector: '<input type="text" class="search" />\n<div class="autocomplete"></div>\n<div class="selected"></div>\n<input type="submit" value="Create Party" />',
    user_autocomplete: '<p>Not used ... or is it?!</p>',
    user_autocomplete_item: '<p>{{name}}</p>',
    selected_users: '{{#collection}}\n  <p>{{name}}</p>\n{{/collection}}'
  });

}).call(this);
