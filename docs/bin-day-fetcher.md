# Bin Day Fetcher?

So yes, I've gone a little off piste right here. I think I want to pivot a little to a bit more of a full-personal-data thing. Both in terms of data ownership (I need to document a bit more of my [indieweb strategy](https://indieweb.org/User:Breakfastdinnertea.co.uk) at some point) and data surfacing.

Do you, the reader, care what my bin day is? Nah, probably not (not unless you're my neighbour), but this is my project and I'm using it as a little playspace. Maybe it'll end up being something dead useful but for now, it's not.

Anyway - the bin day fetcher. My council, Rochdale's bin day page is a right arse on, you have to go to a page, type in your postcode, select your address and then figure out what the next day is (harder than you think over the holidays). I'd like an endpoint I can go to that tells me to put the grey bin out this Tuesday. Maybe it will form an RSS feed, or even better, an iCal feed? I have a gatsby thing here, I'm sure I can abuse it somehow.

Reverse engineering what's there reveals a bit of a mess, mostly cos it's .net and all of the code is clearly machine generated, but I did come up with the following snippet, just hacking about on the command line:

    fetch('http://applications.rochdale.gov.uk/RefuseCollectionCalendar/Home/CollectionDates?UPRN=23016840&selectedDate=31/03/2020')
        .then(res => res.json())
        .then(e => e.map(({PostCode, CollectionType, StartDate}) => ({
            CollectionType,
            PostCode,
            StartDate: new Date(
                parseInt(StartDate.replace(/\/Date\((\d+)\)\//, '$1'), 10)
            }
        )))
        .then(console.log)

Which gives you ALL of the bin days since `selectedDate=`. Which should be enough to give me pretty much everything I wanted to do above.

## Update: April 12, 2020

As of today, we are now publishing bin day data to graphql. Querying /\_\_graphql with

```
query BinDaysByDate {
  allBinDay {
    group(field: date) {
      fieldValue
      nodes {
        bin
      }
    }
  }
}
```

should retrieve all bin days grouped by date.

## Update: May 4th 2020

Eesh, this is slow work, isn't it? :D As of today, we now have two little icons on the main index page. They may not stay there in that form. It's likely that I'll start forming some sort of dashboard of sorts here. Rome in a day and all that.

To keep everything timely, it all runs from a netlify webhook, hit by an IFTTT recipe which fires at 9am each day. That's probably more than it needs (every Sunday would be enough), but I like both the redundancy and that this likely scales to more daily-checkins than just that.

## Credit

There is now a little icon on the main site to remind me what bin day it is this week. It uses a Creative Commons licensed icon:

“[Dustbin](https://thenounproject.com/search/?q=wheelie%20bin&i=1413990)” by Wuppdidu, from the Noun Project
