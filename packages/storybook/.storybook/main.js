module.exports = {
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
    // map over the 'use' array of the css rule and set the 'module' option to true
    config.module.rules[ruleCssIndex].use.map((item) => {
      if (item.loader && item.loader.includes("/css-loader/")) {
        item.options.modules = {
          mode: "local",
          localIdentName:
            configType === "PRODUCTION"
              ? "[local]--[hash:base64:5]"
              : "[name]__[local]--[hash:base64:5]",
        };
      }
      return item;
    });

    return config;
  },
};
