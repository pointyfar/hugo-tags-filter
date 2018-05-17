Grab `hugotagsfilter-...js` and put it somewhere in your `static` directory. 

In your `filterdemo.html` file:

```html
<script src="{{ "vendor/htf/hugotagsfilter-...js" | relURL}}"></script>
```

Initialize HTF, passing an optional config object. This demo uses the following:

```js
var htfConfig = {
  filters: [
    {
      name: 'section',
      prefix: 'sect-',
      buttonClass: 'sect-button',
      allSelector: '#selectAllSections',
      attrName: 'data-section',
      selectedPrefix: 'ssect-',
      countPrefix: 'csect-'
    },
    {
      name: 'tags',
      prefix: 'tag-',
      buttonClass: 'tag-button',
      allSelector: '#selectAllTags',
      attrName: 'data-tags',
      selectedPrefix: 'stags-',
      countPrefix: 'ctags-'
    },
    {
      name: 'authors',
      prefix: 'auth-',
      buttonClass: 'auth-button',
      allSelector: '#selectAllAuthors',
      attrName: 'data-authors',
      selectedPrefix: 'sauth-',
      countPrefix: 'cauth-'
    }
  ],
  showItemClass: "show-item",
  filterItemClass: "tf-filter-item",
  activeButtonClass: "active",
  counterSelector: "selectedItemCount",
  populateCount: true,
  setDisabledButtonClass: "disable-button"
} 
var htf = new HugoTagsFilter(htfConfig);
```

- `filters` : array of config for each filter set. Each config object needs:
    - `name` : filter identifier
    - `prefix` : Each term toggler button needs to be assigned a unique ID. The prefix is used to identify terms belonging to the same filter set, e.g. `tags-post`, `tags-weather`, `tags-random` are tag filters, `sect-post`, `sect-documentation` are section filters.
    - `buttonClass` : Class attribute applied to button togglers. Must start with the prefix.
    - `allSelector` : Selector for the `Select All X` button.
    - `attrName` : Data attribute name to use to identify items.
    - `selectedPrefix` : Specify prefix to use to identify the element containing a count of items selected by the tag.
    - `countPrefix` : Specify prefix to use to identify the element containing a count of all items with tag.
- `showItemClass` : class to apply to items to signify that they should be visible.
- `filterItemClass` : class applied to items to indicate that it is included in items to be filtered.
- `activeButtonClass` : class to apply to button toggler to signify active status 
- `counterSelector`: optional selector for element to display count of items displayed.
- `populateCount`: set to true if you want to keep a counter of tags and items associated. Must define `selectedPrefix` or `countPrefix` on each filter item.
- `setDisabledButtonClass`: Specify a class name to denote disabled button, e.g. when there are no items displayed that have the button's tag.
  
  
You can use as many filter categories as needed.
  
Tags and section filters are configured by default. If no config object is passed in initialising HTF, the following will be used: 

```js
var defaultFilters = [
  {
    name: 'tag',
    prefix: 'tft-',
    buttonClass: 'tft-button',
    allSelector: '#tfSelectAllTags',
    attrName: 'data-tags'
  },
  {
    name: 'section',
    prefix: 'tfs-',
    buttonClass: 'tfs-button',
    allSelector: '#tfSelectAllSections',
    attrName: 'data-section'
  }
]
```
