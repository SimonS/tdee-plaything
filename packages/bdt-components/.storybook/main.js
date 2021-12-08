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
