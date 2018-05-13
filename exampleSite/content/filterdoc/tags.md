```js
{
  name: 'tags',
  prefix: 'tag-',
  buttonClass: 'tag-button',
  allSelector: '#selectAllTags',
  attrName: 'data-tags',
  selectedPrefix: 'stags-',
  countPrefix: 'ctags-'
}
```
The configuration above corresponds to the button html below:

```go-html-template
<h4>Tags</h4>
<button class="" id="selectAllTags" onclick="htf.showAll('tags')">
  All Tags
</button>
{{ range $tags }}
  {{ if .Term }}
    <button class="tag-button" id="tag-{{ .Term | replaceRE "[.]" "_" | urlize }}" onclick="htf.checkFilter('{{ .Term | replaceRE "[.]" "_" | urlize }}', 'tag-')">
      <span>{{.Term | humanize | title }}</span>
      <span id="stags-{{ .Term | urlize }}"> -count-</span> | <span id="ctags-{{ .Term | urlize }}"> -count-</span>
    </button>
  {{ end }}
{{ end }}
{{ if gt ( $.Scratch.Get "untagged") 0 }}
<button class="tag-button" id="tag-tfuntagged" onclick="htf.checkFilter('tfuntagged', 'tag-')">
  Untagged <span id="stags-tfuntagged"> -count-</span> | <span id="ctags-tfuntagged"> -count-</span>
</button>
{{ end }}

```