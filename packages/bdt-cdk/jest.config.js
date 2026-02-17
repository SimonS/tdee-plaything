module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
    '^.+\\.jsx?$': 'babel-jest',
  },
  "transformIgnorePatterns": [
    "/node_modules/\\.pnpm/(?!(axios-cookiejar-support|http-cookie-agent|tough-cookie|axios|deasync)@)[^/]+/node_modules/",
    "/node_modules/(?!axios-cookiejar-support|http-cookie-agent|tough-cookie|axios|deasync)/",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
