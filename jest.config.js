/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: './app',
  moduleNameMapper: {
    '^~(.*)$': '<rootDir>$1',
  },
};
