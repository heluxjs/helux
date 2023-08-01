// jest --updateSnapshot 或 jest -u 更新快照

const jestConfig = {
  roots: ['<rootDir>'],
  // 收集测试覆盖率的匹配文件规则集合，!代表排除的文件
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**/*.ts',
    '!src/index.tsx',
    '!src/serviceWorker.ts',
    '!src/components/_demos/**/*.{ts,tsx}',
  ],
  setupFiles: ['react-app-polyfill/jsdom'],
  setupFilesAfterEnv: ['./node_modules/jest-enzyme/lib/index.js', '<rootDir>/src/setupTests.ts', '<rootDir>/tests/utils/testSetup.ts'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{ts,tsx}',
    '<rootDir>/tests/**/*.{spec,test}.{ts,tsx}',
  ],
  testEnvironment: 'jest-environment-jsdom-fourteen',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '<rootDir>/config/jest/fileTransform.js',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$', '^.+\\.module\\.(css|sass|scss)$'],
  modulePaths: ['<rootDir>/src'],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'jsx'],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
  // reporters: ['default', 'dwt-reporter'],
  reporters: ['default'],
  collectCoverage: true,
};

const testMatch = process.env.testMatch;
if (testMatch) {
  console.log('------ found customized testMatch, start compute ------');
  let prefixedTestMatch = testMatch;

  if (!testMatch.startsWith('<rootDir>')) {
    if (testMatch.startsWith('/')) prefixedTestMatch = `<rootDir>${testMatch}`;
    else prefixedTestMatch = `<rootDir>/${testMatch}`;
  }
  jestConfig.testMatch = [prefixedTestMatch];
  console.log(`computed testMatch: ${JSON.stringify(jestConfig.testMatch)}`);

  if (testMatch.includes('__tests__')) {
    // from: 'src/components/biz-smart/SomeComponent/__tests__/*.{ts,tsx}'
    // to: ['src/components/biz-smart/SomeComponent/', '*.{ts,tsx}']
    const [dirPath, filePath] = testMatch.split('__tests__/');
    // 只收集这一部分覆盖率，方便本地缩小查看范围
    jestConfig.collectCoverageFrom = [`${dirPath}**/${filePath}`];
    console.log(`computed collectCoverageFrom: ${JSON.stringify(jestConfig.collectCoverageFrom)}`);
  }
} else {
  console.log('开始载入jest配置文件，如果是本地执行，想缩小单测范围，可加上testMatch前缀执行，形如');
  // 执行类似命令，缩小测试范围：testMatch='src/pages/_DemoTodoList/__tests__/*.{ts,tsx}' npm run test
  console.log("testMatch='src/components/HelloRemoteReactComp/__tests__/*.{ts,tsx}' npm run test");
}

module.exports = jestConfig;
