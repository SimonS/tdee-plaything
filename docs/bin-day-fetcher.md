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
