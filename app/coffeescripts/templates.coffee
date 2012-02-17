
define
  friend_selector: '''
                     <div class="search_box"></div>
                     <div class="autocomplete_box"></div>
                     <div class="selected"></div>
                     <input type="submit" value="Create Party" />
                   '''
  user_autocomplete_item: '''
                          {{name}}
                          '''
  selected_users_item: '''
                       <div class="selected_user">{{name}}
                         <span class="remove_button">Remove</span>
                       </div>
                       '''
