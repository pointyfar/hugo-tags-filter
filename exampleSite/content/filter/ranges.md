`$pages` and `$sections` should be fairly straight-forward. 

```go-html-template
{{ $pages := where .Site.RegularPages "Type" "in" .Site.Params.mainSections }}

{{ $sections := .Site.Params.mainSections }}
```

I don't have `authors` configured in my `config.toml`, only on the front matter of the content, which is why I have to get all authors declared for all content. You may need to do this differently depending on your own setup.

```go-html-template
{{ $.Scratch.Set "authors" (slice ) }}
{{ range where .Site.RegularPages "Type" "in" .Site.Params.mainSections }}
  {{ with .Params.author }}
    {{ if eq ( printf "%T" . ) "string"  }}
      {{ if ( not ( in ($.Scratch.Get "authors") . ) ) }}
        {{ $.Scratch.Add "authors" . }}
      {{ end }}
    {{ else if ( printf "%T" . ) "[]string" }}
      {{ range . }}
        {{ if ( not ( in ($.Scratch.Get "authors") . ) ) }}
          {{ $.Scratch.Add "authors" . }}
        {{ end }}
      {{ end }}
    {{ end }}
  {{ end }}
{{ end }}
```

Counting and tracking `untagged` is not required. 

```go-html-template
{{ $tags := $.Site.Taxonomies.tags.ByCount }}

{{ $.Scratch.Set "untagged" 0 }}
{{ range $pages }}
  {{ with .Params.tags }}{{ else }}{{ $.Scratch.Add "untagged" 1 }}{{ end }}
{{ end }}

```