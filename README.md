# TDEE Plaything

(name will probably/hopefully change)

## What's this, then?

Since April (the time of writing is October), I have been using [a spreadsheet I found on reddit](https://www.reddit.com/r/Fitness/comments/4mhvpn/adaptive_tdee_tracking_spreadsheet_v3_rescue/) to track my weight loss, calorie intake and keep abreast of what my Total Daily Energy Expenditure should be. There's a blog post here somewhere, but the tl;dr is I run a lot and find my weight goes up proportionally to my running. Kinda weird I know, [but not really](https://www.runnersworld.com/nutrition-weight-loss/a20826267/why-do-runners-gain-weight/). This has been the only way that I've managed to sustain weightloss in any sort of manageable way, while [running quite a lot](https://www.strava.com/athletes/2764169).

The sheet is good, like really good, but the spreadsheet instance that I've been using has a graph that is less good. I also have a yearning to code and learn things, that I frankly don't get time or opportunity to regularly do during my day job as a technical lead (I know, right?!).

So this is essentially the answer to that. I'm pulling data directly from the Google spreadsheet (public, readable spreadsheets have a simplistic JSON API you can query with no authentication), and then messing on with it a bit.

## So what tech have you been playing with?

### TypeScript

The initial instance of this was a [TypeScript wrapper around a fetch-call](packages/gsheet-log-fetcher/src/getAllCheckins.ts) to said API. There's a bit more too it now, but not much. I mostly wanted to see what the hype was about and how TS compared to the Typed languages I used and hated earlier in my career - I'm still not a fan, but there's definitely a use-case here for lobbing JSON around between things.

### Yarn Workspaces

I wanted the experience of playing about with [packages/\*](packages), and liked the idea of a bucket of stuff I could fiddle about with and reuse/abstract over at will without messing about with NPM modules/Git Submodules/whatever bastardry I wanted to commit in the name of being DRY. In practice it's been ok, as long as I've avoided being too pure (I gave up on trying to make TS behave like they were separate modules, and just get things working used ugly [TS path hacks](https://github.com/SimonS/tdee-plaything/blob/f6356d663b33e24a4a30167ae53523d9c2f4775d/packages/tdee-explorer/tsconfig.json#L7) to give the impression that I have any idea what I'm doing).

### d3

I've always been in awe of people who can lob together really impressive visualisations...

### Gatsby

### Netlify

## Why are you open sourcing this

I'm not - I'm coding in the open. Etc.

## What else do you want to do?

input / crud - data federation? save to google?
gatsby data mesh
styled modules?
css modules?
content meshes? port blog?
use WP as a data source - WP-GraphQL?
