module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["./packages"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { diagnostics: { ignoreCodes: ["TS151001"] } }],
    "^.+\\.jsx?$": "babel-jest",
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.cache/",
    "/bdt-components/",
    "/bdt-cdk/",
  ],
  transformIgnorePatterns: [
    "/node_modules/\\.pnpm/(?!(axios-cookiejar-support|http-cookie-agent|tough-cookie|axios|deasync|graphql-request|graphql|@graphql-typed-document-node|extract-files|form-data|get-stream)@)[^/]+/node_modules/",
    "/node_modules/(?!axios-cookiejar-support|http-cookie-agent|tough-cookie|axios|deasync|graphql-request|graphql|@graphql-typed-document-node|extract-files|form-data|get-stream)/",
  ],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec|integration))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
};
