# Overcast Functions

These functions allow us to log in to Overcast and get all listens since a given date (or all listens if we omit `since`).

Overcast exposes a hyper-detailed opml file of a user's activity at `/account/export_opml/extended`. This library uses Axios and an extension that authenticates using a cookie.
