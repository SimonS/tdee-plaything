# BDT CDK

Creates a lambda that downloads podcast listens and posts them to WordPress using the Rest API. Runs that lambda overnight.

To fill in blanks (because of my dodgy SSL rotation script) you can now run the lambda with a `since` parameter (in `YYYY-MM-DD` format). By default it downloads all since yesterday.
