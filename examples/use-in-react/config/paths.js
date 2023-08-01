'use strict';

const path = require('path');
const fs = require('fs');
const subApp = require('./subApp');
// const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
// const publicUrlOrPath = getPublicUrlOrPath(
//   process.env.NODE_ENV === 'development',
//   require(resolveApp('package.json')).homepage,
//   process.env.PUBLIC_URL
// );

// 此处传入的url值仅为了方便另一个项目可以基于当前模块的wed-dev-server调试当前模块代码，端口号对齐 npm run start 里的 PORT
// 它不会影响流水线的 publicUrl 值，因为 hel-dev-utils 内部发现流水线设置的 process.env.HEL_APP_HOME_PAGE 时，
// 会优先采用 HEL_APP_HOME_PAGE 值作为 publicUrl，覆盖掉这里的默认值
const publicUrlOrPath = subApp.getPublicPathOrUrl('http://localhost:3103');

// const buildPath = process.env.BUILD_PATH || 'build';
const buildPath = subApp.distDir;

const moduleFileExtensions = ['web.mjs', 'mjs', 'web.js', 'js', 'web.ts', 'ts', 'web.tsx', 'tsx', 'json', 'web.jsx', 'jsx'];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find((extension) => fs.existsSync(resolveFn(`${filePath}.${extension}`)));

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp(buildPath),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  proxySetup: resolveApp('src/setupProxy.js'),
  appNodeModules: resolveApp('node_modules'),
  appWebpackCache: resolveApp('node_modules/.cache'),
  appTsBuildInfoFile: resolveApp('node_modules/.cache/tsconfig.tsbuildinfo'),
  swSrc: resolveModule(resolveApp, 'src/service-worker'),
  publicUrlOrPath,
};

module.exports.moduleFileExtensions = moduleFileExtensions;
