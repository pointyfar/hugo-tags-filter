## What

Filter Hugo posts using multiple tags.

## Warning 

Not tested on sites with a very large number of posts.

## Where 

See Demo, with tags, authors and sections as filters: [https://pointy.netlify.com/filter/](https://pointy.netlify.com/filter/)

Demo with tags only, and using Masonry: [https://pointy.netlify.com/tags/](https://pointy.netlify.com/tags/)

## How to use

Documentation here: [https://pointy.netlify.com/filter/](https://pointy.netlify.com/filter/)

### Demo Hugo Site

This repo comes with a demo Hugo site at `exampleSite`. The relevant code is in `exampleSite/layouts/page/filter.html`

```
git clone https://github.com/pointyfar/hugo-tags-filter.git
cd hugo-tags-filter/exampleSite
hugo server 
```

Navigate to 

- `localhost:1313/filter/` for demo 
- `localhost:1313/filterdoc/` for demo + documentation

## TODO: 

- [ ] Improve documentation
- [x] Add function to update tags counts 
  - Scenario: Author1 has only 1 post, tagged `red`. Selecting Author2 filter should show tag `red` as 0 or disabled.
- [ ] Possibly add option to choose AND vs OR 
  - Currently (OR within a filter set) + (AND between filter sets) 
- [ ] Add deselect all option 

