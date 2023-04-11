/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch:['**/__tests__/integrations/**/*.[jt]s?(x)'],
  testTimeout: 1000
};