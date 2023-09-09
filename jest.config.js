module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["./packages"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": "babel-jest",
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.cache/",
    "/bdt-components/",
    "/bdt-cdk/",
  ],
  transformIgnorePatterns: [
    ".*node_modules/(?!axios|deasync|http-cookie-agent|tough-cookie).*/",
  ],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec|integration))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
};
