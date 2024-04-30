/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

const config = {
  roots: ['<rootDir>/test'],
  clearMocks: true,
  coverageProvider: 'babel',
  extensionsToTreatAsEsm: ['.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ['test/*.{js,jsx, tsx, ts}']
}

export default config
