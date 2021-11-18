export default {
  projectRoot: '.',     // Where to resolve all URLs relative to. Useful if you have a monorepo project.
  buildOptions: {
    site: 'https://gatsby.breakfastdinnertea.co.uk',           // Your public domain, e.g.: https://my-site.dev/. Used to generate sitemaps and canonical URLs.
    sitemap: false,         // Generate sitemap (set to "false" to disable)
  },
  devOptions: {
    hostname: 'localhost',  // The hostname to run the dev server on.
    port: 3000,             // The port to run the dev server on.
  },
  renderers: [
    "@astrojs/renderer-react"
  ],
};
