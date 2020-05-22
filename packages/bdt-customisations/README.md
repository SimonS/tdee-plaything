# BDT Customisations

A little self-rolled WP plugin to customise my rubbish blog in a non-themey way.

## Post Kinds -> WPGraphQL

- Exposes the [Post Kinds Plugin](https://wordpress.org/plugins/indieweb-post-kinds/) taxonomy to the GraphQL API
- Takes film watches/reviews I have syndicated from Letterboxd (using a weird IFTTT recipe/webhook) and exposes them through a fragile API. An example GraphQL query might look like:

```
{
  posts(where: {tag: "film"}) {
    edges {
      node {
        watchOf {
          name
          rating
          review
          url
        }
      }
    }
  }
}
```

Yes, it's like a convoluted Rube Goldberg machine, but it's MY convoluted Rube Goldberg machine 😁
