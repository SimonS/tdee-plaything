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

- Takes said film watches and aggregates them with TMDB. Could I have used existing GraphQL/Gatsby TMDB query engines and leveraged the power of GraphQL to build relationships? Yes, but I started going down some pretty dark rabbit holes and solving problems of this stupid architecture's making. It would also have been hard to make deliberately efficient/fast. This one ideally only makes those requests once per film per year.

Yes, it's like a convoluted Rube Goldberg machine, but it's MY convoluted Rube Goldberg machine 😁

## Building

To build, run `yarn build`. And then upload to WP blog manually.