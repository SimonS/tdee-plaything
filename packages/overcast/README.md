# Overcast Functions

I use overcast.fm to listen to podcasts. I'd like to publish them to my playground, for all to marvel at how much time I spend with earbuds in.

~~I intend to write a couple of functions to download and then parse the XML from overcast, before pinging new listens to my wordpress site. I shall then hook them up in my separate infra repo (I keep it private because I know that eventually I'll accidentally publish a secret), to a couple of AWS Lambda functions to run daily (I think there are low effort events to run functions both on a schedule and based on new S3 content. Failing that I can always use step-functions, I'm no stranger to overengineering).~~

I've pivoted from all of the above. Single lambda. Going to download file from overcast and send new listens to my blog. There's no real value in decoupling those actions right now, and with that, it should all be triggerable with a single event.

And then from there I should be able to implement logic VERY similar to the [film fetcher logic](https://github.com/SimonS/tdee-plaything/tree/master/packages/film-fetcher), and publish it on the playground.

## More README-Driven-Development

- [x] implement XML file downloader
- [x] hook downloader up to a lambda
  - [x] still need to write some tests for lambda
  - [x] figure out how to send overcast credentials in
- [x] implement listen poster
  - [x] get new listens
  - [x] adjust wordpress schema/listener to store podcasts
  - [x] send new listens to BDT
    - [x] guard against duplicates
    - [x] may need an extra request to fetch podcast metadata/artwork
- [x] run poster daily
- [x] implement overcast fetcher
  - [x] WordPress bits
    - [x] Need to fix admin, get some titles in there so can debug
    - [x] Implement graphql schema
  - [x] Astro side
    - [x] basic fetcher/graphql query
- [ ] create podcasts page in astro
Deferred for now:
  - [ ] ~~should I wire CDK into GH actions?~~ - for now, no. It's unnecessary complexity.
  - [ ] ~~should we optimise images?~~ - leaving this one as bigger piece of up-next work
