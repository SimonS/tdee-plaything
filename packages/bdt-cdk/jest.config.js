module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
  "transformIgnorePatterns": [
    ".*node_modules/(?!axios|deasync|http-cookie-agent).*/"
  ]

};
