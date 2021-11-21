module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: ["../../tdee-explorer/src/**/*.stories.@(tsx|mdx)"],
  addons: ["@storybook/addon-actions", "@storybook/addon-docs"],
  webpackFinal: async (config, { configType }) => {
    // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
    config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/];

    config.module.rules[0].use[0].options.plugins = [
      // use @babel/plugin-proposal-class-properties for class arrow functions
      require.resolve("@babel/plugin-proposal-class-properties"),
      // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
      require.resolve("babel-plugin-remove-graphql-queries"),
    ];

    const ruleCssIndex = config.module.rules.findIndex(
      (rule) => rule.test.toString() === "/\\.css$/"
    );

    config.module.rules[ruleCssIndex].use = [
      {
        loader: "style-loader",
        options: {
          esModule: true,
          modules: {
            namedExport: true,
          },
        },
      },
      {
        loader: "css-loader",
        options: {
          importLoaders: 1,
          esModule: true,
          modules: {
            namedExport: true,
          },
        },
      },
    ];

    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.fallback,
        assert: require.resolve("assert-browserify/"),
      },
    };
    return config;
  },
};
