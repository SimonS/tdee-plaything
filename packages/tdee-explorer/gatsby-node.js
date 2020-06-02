exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const pageInfosCollector = require("./src/utils/pageInfosCollector").default;
  const filmsPerPage = 10;

  const pageInfos = await pageInfosCollector(filmsPerPage, graphql);

  // Create pages for each page of films.
  const path = require("path");
  const filmPageTemplate = path.resolve(`src/templates/films.tsx`);

  const createFilmPage = (path, pageInfos, i) =>
    createPage({
      path: path,
      component: filmPageTemplate,
      context: {
        pageInfo: pageInfos[i],
        pageNumber: i + 1,
        from: pageInfos[i].after,
        first: filmsPerPage,
      },
    });

  createFilmPage("/films", pageInfos, 0);

  pageInfos.forEach((pageInfo, i) =>
    createFilmPage(`/films/page/${i + 1}`, pageInfos, i)
  );
};
