# TDEE Plaything

That name will probably/hopefully change, but ultimately, you can see the awe-inspiring result of this feat of immense overengineering at [gatsby.breakfastdinnertea.co.uk](https://gatsby.breakfastdinnertea.co.uk/).

## What's this, then?

Since April (the time of writing is October), I have been using [a spreadsheet I found on reddit](https://www.reddit.com/r/Fitness/comments/4mhvpn/adaptive_tdee_tracking_spreadsheet_v3_rescue/) to track my weight & calorie intake, as well as to keep abreast of what my Total Daily Energy Expenditure should be. There's a larger blog post here somewhere (Spoiler - I won't write it), but the tl;dr is I run a lot and find my weight goes up proportionally to my running. Kinda weird I know, [but not really](https://www.runnersworld.com/nutrition-weight-loss/a20826267/why-do-runners-gain-weight/). This has been the only way that I've managed to sustain weightloss in any sort of manageable way, while [running quite a lot](https://www.strava.com/athletes/2764169).

The sheet is good, like really good, but the Google Sheets instance that I've been using has a graph that is less good. I also have a yearning to code and learn things, that I frankly don't get time or opportunity to regularly do during my day job as a technical lead (I know, right?!).

So this is essentially the answer to those problems. I'm pulling data directly from the Google spreadsheet (public, readable spreadsheets have a simplistic JSON API you can query with no authentication), and then messing on with it a bit to see what comes out.

## What tech have you been playing with?

### TypeScript

The initial instance of this was a [TypeScript wrapper around a fetch-call](packages/gsheet-log-fetcher/src/getAllCheckins.ts) to said API. There's a bit more too it now, but not much. I mostly wanted to see what the hype was about and how TS compared to the strongly and statically typed languages I used and hated earlier in my career. I'm still not a fan, but there's definitely a use-case here for lobbing non-specced JSON around between things.

### Yarn Workspaces

Having seen the buzzword "monorepos" appear in a few places, I wanted the experience of playing about with [packages/\*](packages) myself. I liked the idea of a bucket of stuff I could fiddle about with and reuse/abstract over at will without messing about with NPM modules/Git Submodules/whatever bastardry I wanted to commit in the name of being DRY. In practice it's been ok, as long as I've avoided being too pure (I gave up on trying to make TS behave like they were separate modules, and just get things working used ugly [TS path hacks](https://github.com/SimonS/tdee-plaything/blob/f6356d663b33e24a4a30167ae53523d9c2f4775d/packages/tdee-explorer/tsconfig.json#L7) to give the impression that I have any idea what I'm doing).

I think what I have as a result of that compromise is probably not that useful in terms of exposing individual packages for other people's use, but it's really useful for me to reason about and add to without huge refactorings.

### d3

I've always been in awe of people who can lob together really impressive visualisations, and have wanted to do some more with d3 since [Hanah](https://twitter.com/hanahanderson) ran a dojo on it for us at work a while ago. Using knowledge gained from [Shirley Wu's awesome Front End Masters](https://frontendmasters.com/teachers/shirley-wu/) courses, I've had a play at pushing the aforementioned weight data into a d3 graph and seeing what comes out. Following Shirley's advice about which parts of d3 to use and how to mix them with React, it's been quite a nice experience - leading to some pretty [declarative code](packages/tdee-explorer/src/components/tdee-graph.tsx), albeit way less pretty graphs (but you can blame my lack of "design chops" for that).

### Gatsby

Gatsby is lovely, isn't it? My usecase seems good for it. I add one or two updates a day to the spreadsheet and probably won't need to pull things down over the wire. Most of the leg work is done through a [custom source plugin](packages/tdee-explorer/plugins/gatsby-source-tdee-json-api), with another [slightly nasty hack](packages/tdee-explorer/plugins/gatsby-source-tdee-json-api/gatsby-node.js) to make said plugin play nice with TypeScript.

You may think, "that seems lot a lot of work to download some arbitrary JSON and render in d3" - and you would be absolutely right. But I'm learning here. And it's also a nice foundation for future stuff. I dunno, maybe this becomes part of a larger (_BUZZWORD ALERT_) ["content mesh"](https://www.gatsbyjs.org/blog/2018-10-04-journey-to-the-content-mesh/)?

### Netlify

I hate infrastructure and architecture. I find it all too fiddly. So the promise of Netlify all sounded a little bit too good to be true - but this entire thing runs on it, with almost zero config. Setting it up felt like cheating. Every push to master triggers a rebuild, out of the box. I've also customised the original spreadsheet to have a dropdown menu which can ping a Netlify webhook to trigger a rebuild.

^^^ ALL of that gobbledygook was accomplished in 20 minutes. Total.

## Why are you open sourcing this?

I'm not - I'm coding in the open. I'll add a permissive license so you can copy and paste at will and use the bits you like, but I'm not really putting this out there for adoption or owt. It gives me something to write and reason about. And it lets me scratch an itch.

## What else do you want to do?

I have loads of stuff I WANT to do, but best intentions and all that...

I'd like to learn a bit more about the TDEE side of the spreadsheet, understand how that's calculated, replicate that and maybe graph that over time. If I do that, I can maybe mash that up with Strava running data and get some idea of just what sort of an effect running has on my weight/energy expenditure. I'm 90% sure MyFitnessPal (which I generally use to track nutrition/intake) grossly inflates it, but I'd like to know by just how much.

Maybe when I have most of the Spreadsheet's output replicated, I might look at a different data source and provide my own CRUD here? A simpler spreadsheet/csv, maybe? It'd be nice to have a play with real life service workers, offline experiences, that sort of thing.

There's pretty much no styling or typography or anything here right now. That feels like an opportunity. There are loads of modern abstractions I'd like to play with, both in terms of CSS/CSS-in-JS, as well as things like design systems and component libraries.

And maybe this won't be a single graph going forward - I've had thoughts about it being a personal dashboard (while we're throwing buzzwords around, Imay as well insert a stray Quantified Self), as well as using Gatsby to build a wider personal site. Maybe I could port my current blog here. Or at least the frontend - I know there's a GraphQL Plugin for WordPress which exposes the API to things like Gatsby. Maybe this is a sweet middle-ground?

Either way, this feels like a nice arena to hack together all of that.
