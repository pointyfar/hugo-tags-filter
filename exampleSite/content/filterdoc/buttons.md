For each filter set you want to use, generate buttons (or your preferred element) to use as toggles. For each button:

- Assign an id beginning with the `prefix` defined in its config. 

- Assign the class defined as `buttonClass`.

- Set `onclick="htf.checkFilter()"`, passing as parameters the term and the `prefix`

- Add a 'Select All x' button as well. 
  - Set `onclick="htf.showAll('x')"`
  - Assign an id matching the configured `allSelector`
  
- If you want to keep a counter of 
  - all items with that filter 
  - all selected items with that filter 
  
  you also need to add a containing element inside the button (see examples)
  
  ```go-html-template
  <span id="ssect-{{ . | urlize }}"> -count-</span>
  ```

