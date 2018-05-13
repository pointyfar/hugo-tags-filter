```js
{
  name: 'section',
  prefix: 'sect-',
  buttonClass: 'sect-button',
  allSelector: '#selectAllSections',
  attrName: 'data-section',
  selectedPrefix: 'ssect-',
  countPrefix: 'csect-'
}
```
The configuration above corresponds to the button html below:

```go-html-template
<h4>Sections</h4>
<button id="selectAllSections" onclick="htf.showAll('section')">
  All Sections
</button>
{{ range $sections }}
  <button class="sect-button" id="sect-{{ . | urlize }}" onclick="htf.checkFilter('{{ . | urlize }}', 'sect-')">
    {{ . | title }} <span id="ssect-{{ . | urlize }}"> -count-</span> | <span id="csect-{{ . | urlize }}"> -count-</span>
  </button>
{{ end }}
```