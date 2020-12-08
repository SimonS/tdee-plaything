# Netlify Functions

## BDT Relay

I'd like to use IFTTT to post things from the outside online world (such as my weight via Withings scales) to my blog. I can build a custom post type to post checkins to, using the WordPress Rest API quite painlessly, however the next problem is authenticating. WP-Rest-API allows authenticating with a token, but only through the header. IFTTT doesn't allow header customisation.

`bdt-relay` takes a payload to post, containing both an endpoint to post it to (relative to https://breakfastdinnertea.co.uk), and an access token. It strips out those extra two fields and then posts remaining payload to the endpoint using the `access_token` in an Authorization header.
