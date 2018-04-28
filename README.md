## What

Filter Hugo posts using multiple tags.

## Warning 

Not tested on sites with a very large number of posts.

## Where 

See Demo, with tags, authors and sections as filters: [https://pointy.netlify.com/filter/](https://pointy.netlify.com/filter/)

Demo with tags only, and using Masonry: [https://pointy.netlify.com/tags/](https://pointy.netlify.com/tags/)

## How 

#### Step 1

Create an empty content file.

```bash
hugo new filterdemo.md
```

Set the layout to use in the frontmatter of `filterdemo.md`:

```markdown
layout: filterdemo
```

Don't forget to set `draft: false`.

#### Step 2

Set up html layout and the js config: 

- Create new layout `layouts/page/filterdemo.html`.

- Initialize HTF, passing an optional config object:

```js
var htfConfig = {
  filters: [{
    name: 'tag',
    prefix: 'tft-',
    buttonClass: 'tft-button',
    allSelector: '#tfSelectAllTags',
    attrName: 'data-tags'
  }],
  showItemClass: "showItemClass",
  filterItemClass: "filterItemClass",
  activeButtonClass: "activeButtonClass"
} 
var htf = new HugoTagsFilter(htfConfig);

```

Tags and section filters are configured by default, but you can use as many filter categories as needed.

  - `filters`
    : array of config for each filter set. Each config object needs:
      - `name`
        : filter identifier
      - `prefix`
        : Each term toggler button needs to be assigned a unique ID. The prefix is used to identify terms belonging to the same filter set, e.g. `tags-post`, `tags-weather`, `tags-random` are tag filters, `sect-post`, `sect-documentation` are section filters.
      - `buttonClass`
        : Class attribute applied to button togglers. Must start with the prefix.
      - `allSelector`
        : Selector for the `Select All X` button.
      - `attrName`
        : Data attribute name to use to identify items.
  - `showItemClass`
    : class to apply to items to signify that they should be visible.
  - `filterItemClass`
    : class applied to items to indicate that it is included in items to be filtered.
  - `activeButtonClass`
    : class to apply to button toggler to signify active status 

#### Step 3

Define a few variables:
  
```html
{{ $pages := where .Site.RegularPages "Type" "in" .Site.Params.mainSections }}
{{ $sections := .Site.Params.mainSections }}
{{ $tags := $.Site.Taxonomies.tags.ByCount }}
```
Define other filters you want to use, e.g. Authors.


Optionally, define an `untagged` "tag" to catch items that have no tags defined.

```html
{{ $.Scratch.Set "untagged" 0 }}
{{ range $pages }}
  {{ with .Params.tags }}{{ else }}{{ $.Scratch.Add "untagged" 1 }}{{ end }}
{{ end }}

```

#### Step 4

For each filter set you want to use, generate buttons (or your preferred element) to use as toggles. For each button:

  - Assign an id beginning with the `prefix` defined in its config. 

  - Assign the class defined as `buttonClass`.

  - Set `onclick="htf.checkFilter()"`, passing as parameters the term and the `prefix`

```html
{{ range $tags }}
  {{ if .Term }}
    <button 
      id="tft-{{.Term | urlize}}" 
      class="tft-button" 
      onclick="htf.checkFilter('{{.Term | urlize}}', 'tft-')">
      <span>{{.Term }}</span>
      <span> ({{.Count}})</span>
    </button>
  {{ end }}
{{ end }}
```

Add a 'Select All x' button as well. 

  - Set `onclick="htf.showAll('x')"`

  - Assign an id matching the configured `allSelector`


```html

<button id="tfSelectAllSections" onclick="htf.showAll('section')">
  All Sections
</button>
<button id="tfSelectAllTags" onclick="htf.showAll('tag')">
  All Tags
</button>
```

#### Step 5

Generate the list of items to filter.

  - Assign the class configured in `filterItemClass`

  - Give data attributes for each filter set, using the `attrName` defined for each set.


```html
{{ range $pages.ByPublishDate.Reverse }}
  <div  class="tf-filter-item" 
        data-tags="{{ with .Params.tags }}{{ range . }}{{ . | urlize }} {{ end }}{{ else }} tfuntagged{{ end }}"
        data-section="{{ .Section }}"
        >
    <h4><a href="{{ .RelPermalink }}">{{ .Title }}</a></h4>
  </div>
{{ end }}
```

#### Step 6

Save and run `hugo server` if not already running. Navigate to `localhost:1313/filterdemo/`


## TODO: 

- Improve documentation 

- Test with taxonomies

- Add function to update tags counts 

- Test with paginations involved

- Possibly add option to choose AND vs OR 

- Add deselect all option 

