(function() {

  define({
    friend_selector: '<div class="search_box"></div>\n<div class="autocomplete_box"></div>\n<div class="selected"></div>\n<div class="selected_hidden"></div>\n<input type="submit" value="Create Party" />',
    user_autocomplete_item: '<img src="{{picture}}" alt="{{name}}" class="avatar" />\n{{{highlighted_name}}}\n<img src="{{type_icon}}" alt="{{type}}" class="type" />',
    selected_users_item: '<img src="{{picture}}" alt="{{name}}" class="avatar" />\n{{name}}\n<img src="{{type_icon}}" alt="{{type}}" class="type" />\n  <button class="remove_button">Remove</button>',
    selected_hidden_input: '<input type="hidden" name="selected[]" value="{{id}}" />',
    highlighted_name: '<span class="highlight">{{highlighted}}</span>{{rest}}'
  });

}).call(this);
