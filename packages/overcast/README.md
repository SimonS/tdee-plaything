# Overcast Functions

I use overcast.fm to listen to podcasts. I'd like to publish them to my playground, for all to marvel at how much time I spend with earbuds in.

I intend to write a couple of functions to download and then parse the XML from overcast, before pinging new listens to my wordpress site. I shall then hook them up in my separate infra repo (I keep it private because I know that eventually I'll accidentally publish a secret), to a couple of AWS Lambda functions to run daily (I think there are low effort events to run functions both on a schedule and based on new S3 content. Failing that I can always use step-functions, I'm no stranger to overengineering).

And then from there I should be able to implement logic VERY similar to the [film fetcher logic](https://github.com/SimonS/tdee-plaything/tree/master/packages/film-fetcher), and publish it on the playground.

## More README-Driven-Development

- [ ] implement XML file downloader
- [ ] hook downloader up to a lambda
- [ ] run downloader daily
- [ ] implement listen poster
  - [ ] get new listens
  - [ ] send new listens to BDT
- [ ] hook poster up to a lambda
- [ ] adjust wordpress schema/listener to store podcasts
- [ ] run poster on s3 file update
- [ ] implement overcast fetcher
- [ ] create podcasts page in astro
