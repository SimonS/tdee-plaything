import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

export default defineConfig ({
  root: ".", // Where to resolve all URLs relative to. Useful if you have a monorepo project.
  site: "https://playground.breakfastdinnertea.co.uk/", // Your public domain, e.g.: https://my-site.dev/. Used to generate sitemaps and canonical URLs.
  integrations: [react()],
  trailingSlash: 'always',
  build: {
    inlineStylesheets: 'auto',
  },
});
