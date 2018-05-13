```go-html-template
<div><h2><span id="selectedItemCount"></span> Items</h2></div>
<div class="tf-items-container">      
{{ range $pages.ByPublishDate.Reverse }}
  <div  class="tf-filter-item tf-item" 
        data-tags="{{ with .Params.tags }}{{ range . }}{{ . | replaceRE "[.]" "_" | urlize }} {{ end }}{{ else }} tfuntagged{{ end }}"
        data-section="{{ .Section }}"
        
        data-authors="{{ with .Params.author }}{{ if eq ( printf "%T" . ) "string" }}{{ . | replaceRE "[.]" "_" | urlize }}{{ else if eq ( printf "%T" . ) "[]string" }}{{ range . }}{{ . | replaceRE "[.]" "_" | urlize }} {{end}}{{end}}{{else}}no-author{{end}}"
        
        >
    <h6>{{.Section}}</h6>
    <h5>{{ with .Params.author }}{{ if eq ( printf "%T" . ) "string" }}{{.|humanize|title}}{{ else if eq ( printf "%T" . ) "[]string" }}{{ range . }}{{.|humanize|title}} {{end}}{{end}}{{else}}No Author{{end}}</h5>
    
    <h4><a href="{{ .RelPermalink }}">{{ .Title }}</a></h4>
    
    <div>{{ with .Params.tags }}{{ range . }}<tag>{{ . | humanize | title }}</tag> {{ end }}{{ else }}<tag>untagged</tag>{{ end }}</div>
    
  </div>
{{ end }}
</div>

```