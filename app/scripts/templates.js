(function() {

  define({
    friend_selector: '<div class="search_box"></div>\n<div class="autocomplete_box"></div>\n<div class="selected"></div>\n<input type="submit" value="Create Party" />',
    user_autocomplete_item: '<p>{{name}}</p>',
    selected_users_item: '<p>{{name}}\n  <span class="remove-button">Remove</span>\n</p>'
  });

}).call(this);
