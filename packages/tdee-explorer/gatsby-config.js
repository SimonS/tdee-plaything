module.exports = {
  siteMetadata: {
    name: "Hello Typescript World!",
    tagline: "Gatsby + SASS + Typescript = 💪",
  },
  plugins: [
    "gatsby-plugin-sass",
    "gatsby-plugin-typescript",
    "gatsby-source-tdee-json-api",
    "gatsby-source-bin-day-api",
    {
      resolve: `gatsby-plugin-prefetch-google-fonts`,
      options: {
        fonts: [
          {
            family: `Actor`,
          },
        ],
      },
    },
  ],
};
