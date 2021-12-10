module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: ["../src/**/*.stories.@(tsx|mdx)"],
  addons: [
    "@storybook/addon-actions",
    "@storybook/addon-docs",
    "@storybook/addon-controls",
  ],
  webpackFinal: async (config, { configType }) => {
    const ruleCssIndex = config.module.rules.findIndex(
      (rule) => rule.test.toString() === "/\\.css$/"
    );

    config.module.rules[ruleCssIndex].use = [
      {
        loader: "style-loader",
        options: {
          esModule: true,
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
        path: require.resolve("path-browserify/"),
      },
    };
    return config;
  },
};
