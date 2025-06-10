module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
