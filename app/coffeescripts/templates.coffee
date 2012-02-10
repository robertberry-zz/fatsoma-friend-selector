
define
  friend_selector: '''
                     <input type="text" class="search" />
                     <div class="autocomplete"></div>
                     <div class="selected"></div>
                     <input type="submit" />
                   '''
  user_autocomplete: '''
                     {{#collection}}
                        <p>{{name}}</p>
                     {{/collection}}
                     '''
  user_autocomplete_item: '''
                          <p>DONGS</p>
                          '''
