(function() {

  define({
    friend_selector: '<input type="text" class="search" />\n<div class="autocomplete"></div>\n<div class="selected"></div>\n<input type="submit" value="Create Party" />',
    user_autocomplete: '{{#collection}}\n    <p>{{name}}</p>\n{{/collection}}',
    user_autocomplete_item: '<p>DONGS</p>',
    selected_users: '{{#collection}}\n  <p>{{name}}</p>\n{{/collection}}'
  });

}).call(this);
