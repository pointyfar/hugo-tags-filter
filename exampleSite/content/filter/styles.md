This demo uses the following styles (in addition to [bare.css](http://barecss.com/))

```css
/*** Important ***/
.tf-filter-item {
  display: none;
}

button.active {
  background-color: #ddd;
}

button.disable-button {
  border-style: dashed;
}

.show-item {
  display: inline-block;
  /* or whatever display style is appropriate 
   * for tf-filter-item when it is showing;
   */
}

/*** Aesthetics ***/

.tf-items-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.tf-item {
  width: 250px;
  margin: 8px;
  background: #fff;
  padding: 2rem;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, .2);
  border-radius: 2px;
  margin-bottom: 2rem
}

pre code {
  overflow-x: auto;
}
```