(function() {

  define({
    friend_selector: '<div class="search_box"></div>\n<div class="autocomplete_box"></div>\n<div class="selected"></div>\n<div class="selected_hidden"></div>\n<input type="submit" value="Create Party" />',
    user_autocomplete_item: '{{{highlighted_name}}}',
    selected_users_item: '<div class="selected_user">{{name}}\n  <button class="remove_button">Remove</button>\n</div>',
    selected_hidden_input: '<input type="hidden" name="selected[]" value="{{id}}" />',
    highlighted_name: '<span class="highlight">{{highlighted}}</span>{{rest}}'
  });

}).call(this);
