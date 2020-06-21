# Overcast Fetcher

Downloads Overcast OPML file, parses for recent listens, and posts them to a micropub endpoint

Intended to be executed as a serverless function (in my case, Netlify).

Download and parse is currently two steps, that's deliberate - apart from being able to perform those steps independently, which feels nice, I'd also like to open up some flexibility as to what does which step and where. There's a TODO there around downloading further META information, and while that will LIKELY be done here too, there's always the possibility that it's cheaper and more performant to do that in WordPress (the file in question is 1.5mb and getting larger 😬).
