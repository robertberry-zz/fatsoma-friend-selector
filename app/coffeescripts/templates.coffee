
define
  friend_selector: '''
                     <input type="text" class="search" />
                     <div class="autocomplete"></div>
                     <div class="selected"></div>
                     <input type="submit" value="Create Party" />
                   '''
  user_autocomplete: '''
                     <p>Not used ... or is it?!</p>
                     '''
  user_autocomplete_item: '''
                          <p>{{name}}</p>
                          '''
  selected_users: '''
                  {{#collection}}
                    <p>{{name}}</p>
                  {{/collection}}
                  '''
