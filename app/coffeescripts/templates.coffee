
define
  friend_selector: '''
                     <div class="search_box"></div>
                     <div class="autocomplete_box"></div>
                     <div class="selected"></div>
                     <div class="selected_hidden"></div>
                     <input type="submit" value="Create Party" />
                   '''
  user_autocomplete_item: '''
                          <img src="{{picture}}" alt="{{name}}" class="avatar" />
                          {{{highlighted_name}}}
                          <img src="{{type_icon}}" alt="{{type}}" class="type" />
                          '''
  selected_users_item: '''
                       <img src="{{picture}}" alt="{{name}}" class="avatar" />
                       {{name}}
                       <img src="{{type_icon}}" alt="{{type}}" />
                         <button class="remove_button">Remove</button>
                       '''
  selected_hidden_input: '''
                         <input type="hidden" name="selected[]" value="{{id}}" />
                         '''
  highlighted_name: '''
                    <span class="highlight">{{highlighted}}</span>{{rest}}
                    '''