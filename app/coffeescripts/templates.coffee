
define
  friend_selector: '''
                     <div class="search_box"></div>
                     <div class="autocomplete_box"></div>
                     <div class="selected"></div>
                     <div class="selected_hidden"></div>
                     <input type="submit" value="Create Party" />
                   '''
  user_autocomplete_item: '''
                          {{{highlighted_name}}}
                          '''
  selected_users_item: '''
                       {{name}}
                         <button class="remove_button">Remove</button>
                       '''
  selected_hidden_input: '''
                         <input type="hidden" name="selected[]" value="{{id}}" />
                         '''
  highlighted_name: '''
                    <span class="highlight">{{highlighted}}</span>{{rest}}
                    '''