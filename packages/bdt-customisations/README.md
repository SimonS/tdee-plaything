# BDT Customisations

A little self-rolled WP plugin to customise my rubbish blog in a non-themey way.

## Custom Post Types -> GraphQL

- defines custom types for both Weight and Film Watches.
  - Weight is pushed in by an IFTTT hook from Withings API
  - Film watches are pulled in from letterboxd's RSS feed, before being furnished with some extra metadata using TMDB

An example film query might look like:

```graphql
{
  films(where: { orderby: { field: DATE_WATCHED, order: DESC } }) {
    nodes {
      watchedDate
      filmTitle
      year
      rating
      reviewLink
      content(format: RAW)
      meta {
        image
        runtime
        original_language
      }
    }
  }
}
```

## Building

To build, run `yarn build`. And then upload to WP blog manually.
