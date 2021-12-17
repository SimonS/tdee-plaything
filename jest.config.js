module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["./packages"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.cache/",
    "/tdee-explorer/",
    "/bdt-components/",
    "/bdt-cdk/",
  ],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec|integration))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
