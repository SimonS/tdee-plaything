// What I THINK I need to do to create pagination:

// loop through pages - x at a time.
// Create a slug (/films/2)
// Pass through context - cursor info/baseURL - into films template

// ^^^^ that should all give us the default (/films/) and (/films/1/)

// one thing we might want to decipher is whether to display page numbers in pagination. I'm erring towards no.

// Another thing we might do is encode slugs like `/films/from/crazy-arse-cursor-id/` and `/films/to/crazy-arse-cursor-id/`. That way, they might work dynamically client-side?

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;
  const pageInfosCollector = require("./src/utils/pageInfosCollector").default;

  const pageInfos = await pageInfosCollector(10, graphql);
  console.log(pageInfos);

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  // Create pages for each markdown file.
  //   const blogPostTemplate = path.resolve(`src/templates/blog-post.js`);
  //   result.data.allMarkdownRemark.edges.forEach(({ node }) => {
  //     const path = node.frontmatter.path;
  //     createPage({
  //       path,
  //       component: blogPostTemplate,
  //       // In your blog post template's graphql query, you can use pagePath
  //       // as a GraphQL variable to query for data from the markdown file.
  //       context: {
  //         pagePath: path,
  //       },
  //     });
  //   });
};
