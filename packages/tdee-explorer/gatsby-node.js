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
