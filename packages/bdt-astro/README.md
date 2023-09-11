# astro.bdt

The playground is wholly run on astro now. I deleted Gatsby.

I find the mental-model of something simpler like astro easier to understand (it could have also been eleventy, but the allure of the new and all that) - moreso when I've put the site down for a while. Gatsby leaves me constantly feeling like I'm migrating to the next version without ever having a moment to build anything new, and then the integrations with third parties (the internal graphql api etc) are hard to grok after the fact. It's a bit like regexes - legible after the first draft, but leave it a month and it's all a foreign language to me at first glance.

## Build optimisation checklist
- [ ] for each data type, change getStaticPaths to return all data, rather than just pagination data
    - [ ] Podcasts
    - [ ] Films
    - [ ] Lifelog
- [ ] remove singular get<T>s calls
- [ ] ensure there are some rudimentary tests for now public exported functions for getAll<T>() calls
    - [ ] Podcasts
    - [ ] Films
    - [ ] Lifelog
- [ ] change pagination component to work with new format
- [ ] memoise relevant getAll<T>() calls (they won't be expected to change between builds)
