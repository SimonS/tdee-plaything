const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const prettierPlugin = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");
const reactPlugin = require("eslint-plugin-react");
const jestPlugin = require("eslint-plugin-jest");

module.exports = [
  {
    ignores: [
      "dist/**",
      "lambda/**",
      "**/*.d.ts",
      "packages/bdt-cdk/bin/*.js",
      "packages/bdt-cdk/lambda/**/*.js",
      "packages/bdt-cdk/lib/*.js",
      "packages/bdt-cdk/test/*.js",
      "packages/bdt-cdk/jest-setup.js",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@typescript-eslint": tsPlugin,
      prettier: prettierPlugin,
      react: reactPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
      },
    },
    settings: {
      react: {
        version: "16.11",
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
      "prettier/prettier": "error",
      "react/prop-types": 0,
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: [
      "**/*.test.{ts,tsx,js}",
      "**/*.spec.{ts,tsx,js}",
      "**/*.integration.ts",
    ],
    ...jestPlugin.configs["flat/recommended"],
    rules: {
      ...jestPlugin.configs["flat/recommended"].rules,
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    // CDK tests use template.hasResourceProperties() as assertions, not expect()
    files: ["packages/bdt-cdk/test/bdt-cdk.test.ts"],
    rules: {
      "jest/expect-expect": "off",
    },
  },
  {
    // CJS config files and jest setup files legitimately use require()
    files: [
      "eslint.config.js",
      "*.config.js",
      "*.config.cjs",
      "**/.storybook/*.js",
      "**/jest-setup.ts",
      "**/jest-setup.js",
    ],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];
