// What I THINK I need to do to create pagination:

// loop through pages - x at a time.
// Create a slug (/films/2)
// Pass through context - cursor info/baseURL - into films template

// ^^^^ that should all give us the default (/films/) and (/films/1/)

// one thing we might want to decipher is whether to display page numbers in pagination. I'm erring towards no.

// Another thing we might do is encode slugs like `/films/from/crazy-arse-cursor-id/` and `/films/to/crazy-arse-cursor-id/`. That way, they might work dynamically client-side?

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const pageInfosCollector = require("./src/utils/pageInfosCollector").default;
  const filmsPerPage = 10;

  const pageInfos = await pageInfosCollector(filmsPerPage, graphql);

  // Create pages for each page of films.
  const path = require("path");
  const filmPageTemplate = path.resolve(`src/pages/films.tsx`);
  pageInfos.forEach((pageInfo, i) => {
    const path = `/films/page/${i + 1}`;
    createPage({
      path,
      component: filmPageTemplate,
      context: {
        pagePath: path,
        pageInfo: pageInfo,
        pageNumber: i + 1,
        from: pageInfo.after,
        first: filmsPerPage,
      },
    });
  });
};
