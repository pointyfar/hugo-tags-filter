```js
{
  name: 'authors',
  prefix: 'auth-',
  buttonClass: 'auth-button',
  allSelector: '#selectAllAuthors',
  attrName: 'data-authors',
  selectedPrefix: 'sauth-',
  countPrefix: 'cauth-'
}
```
The configuration above corresponds to the button html below:

```go-html-template
<h4>Authors</h4>
<button id="selectAllAuthors" onclick="htf.showAll('authors')">
  All Authors
</button>
{{ range $.Scratch.Get "authors" }}
  <button class="auth-button" id="auth-{{ . | replaceRE "[.]" "_" | urlize }}" onclick="htf.checkFilter('{{ . | replaceRE "[.]" "_" | urlize }}', 'auth-')">
    {{ . }} <span id="sauth-{{ . | replaceRE "[.]" "_" | urlize }}"> -count-</span> | <span id="cauth-{{ . | replaceRE "[.]" "_" | urlize }}"> -count-</span>
    
  </button>
{{ end }}
{{ if gt ( $.Scratch.Get "noAuthors") 0 }}
<button class="auth-button" id="auth-no-author" onclick="htf.checkFilter('no-author', 'auth-')">
  No Author <span id="sauth-no-author"> -count-</span> | <span id="cauth-no-author"> -count-</span>
</button>
{{ end }}
```