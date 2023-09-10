import { dirname, join } from "path";
module.exports = {
  
  framework: {
    name: "@storybook/react-webpack5",
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

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}
