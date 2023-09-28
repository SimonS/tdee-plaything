# BDT Customisations

A little self-rolled WP plugin to customise my rubbish blog in a non-themey way.

## Custom Post Types -> GraphQL

- defines custom types for Weight, Film Watches, and Podcast Listens.
  - an IFTTT hook pushes weight data in from Withings API
  - Pulls in Film watches are using letterboxd's RSS feed, before furnishing it with extra metadata using TMDB
  - a Lambda function in bdt-cdk sends in the most recent podcast listens. The plugin downloads data about the podcast feed using its feed URL.

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

## PHPUnit Tests

The lowest friction route to running the PHPUnit tests is in the [local by Flywheel](https://localwp.com/) shell. Go to the plugin folder in a test instance and run:

```
composer update
bash bin/install-wp-tests.sh wordpress_test root root localhost latest true
```

After that you should have a working environment. Run `phpunit` to execute.
