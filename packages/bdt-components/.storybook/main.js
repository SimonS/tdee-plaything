import { dirname, join } from "path";
// import type { StorybookConfig } from "@storybook/react-webpack5";

const getAbsolutePath = (packageName) =>
  dirname(require.resolve(join(packageName, 'package.json')));

module.exports = {
  
  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {},
  },

  stories: ["../src/**/*.stories.@(tsx|mdx)"],

  addons: [
    getAbsolutePath("@storybook/addon-actions"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-controls"),
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

  docs: {
    autodocs: true
  }
};
