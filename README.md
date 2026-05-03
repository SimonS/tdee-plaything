# BDT Playground

A place for me to play around without having to worry about multiple repositories and versioning. If I get the urge to play with something new technically (or something not that new - WordPress, I'm looking at you 👀), it lives here until I get bored and delete it.

I try to build using decent (not best) practices - testing, not storing credentials, etc. Any artefacts it produces generally live at [playground.breakfastdinnertea.co.uk](https://playground.breakfastdinnertea.co.uk/).

## Features/technology I've been playing with

* TypeScript - the predominant language I use.
* Wordpress - the main intermediary store for most of this data. [bdt-customisations](https://github.com/SimonS/tdee-plaything/tree/master/packages/bdt-customisations) is where the tweaks I've made live.
* GraphQL - the main method of exposing wordpress data to the outside world.
* AWS CDK - for orchestrating quick/dirty serverless functions. The CDK CLI is a devDependency of `bdt-cdk`; run it via `pnpm --filter @tdee/bdt-cdk exec cdk <command>` (e.g. `synth`, `deploy`).
* AstroJS - powerful little static site generator to publish the main website.
