export default {
  coverageProvider: 'v8',
  moduleDirectories: ['node_modules', 'src'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  testEnvironment: 'node',
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./src/utils/test/setup-test.ts'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: {
    global: {
      lines: 85,
    },
  },
};
