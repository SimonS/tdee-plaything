module.exports = {
  siteMetadata: {
    name: "Hello Typescript World!",
    tagline: "Gatsby + SASS + Typescript = 💪",
  },
  plugins: [
    "gatsby-plugin-sass",
    "gatsby-plugin-typescript",
    "gatsby-plugin-css-modules-typings",
    "gatsby-source-tdee-json-api",
    "gatsby-source-bin-day-api",
    {
      resolve: `gatsby-plugin-webfonts`,
      options: {
        fonts: {
          google: [
            {
              family: `Actor`,
            },
          ],
        },
      },
    },
    {
      resolve: "gatsby-source-graphql",
      options: {
        typeName: "WPGraphQL",
        fieldName: "bdt",
        url: "https://breakfastdinnertea.co.uk/graphql",
      },
    },
  ],
};
