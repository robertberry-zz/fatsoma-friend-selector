(function() {

  define({
    friend_selector: '<div class="search_box"></div>\n<div class="autocomplete_box"></div>\n<div class="selected"></div>\n<input type="submit" value="Create Party" />',
    user_autocomplete_item: '{{name}}',
    selected_users_item: '<div class="selected_user">{{name}}\n  <span class="remove_button">Remove</span>\n</div>'
  });

}).call(this);
