const jestConfig = {
  roots: ['<rootDir>'],
  testEnvironment: 'node',
  collectCoverageFrom: ['test/**/*.{ts}'],
  setupFilesAfterEnv: [],
  testMatch: ['<rootDir>/test/set-other/update-object-item.ts'],
  testPathIgnorePatterns: ['<rootDir>/test/_util.ts'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '<rootDir>/fileTransform.js',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$'],
  modulePaths: ['<rootDir>/src'],
  moduleFileExtensions: ['js', 'ts', 'json'],
  collectCoverage: true,
};

const { testMatch } = process.env;
if (testMatch) {
  console.log('------ found customized testMatch, start compute ------');
  let prefixedTestMatch = testMatch;

  // 改写前缀
  if (!testMatch.startsWith('<rootDir>')) {
    if (testMatch.startsWith('/')) prefixedTestMatch = `<rootDir>${testMatch}`;
    else prefixedTestMatch = `<rootDir>/${testMatch}`;
  }
  jestConfig.testMatch = [prefixedTestMatch];
  console.log(`computed testMatch: ${JSON.stringify(jestConfig.testMatch)}`);
} else {
  console.log(
    'Start loading the jest configuration file. If it is executed locally and you want to narrow the scope of a single test, you can add the testmatch prefix to execute it, such as',
  );
  // testMatch='test/yyy.ts' npm run test
  console.log("testMatch='test/yyy.ts' npm run test");
}

module.exports = jestConfig;
