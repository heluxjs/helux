/*
|--------------------------------------------------------------------------
|
| 生成 hel-meta.json
|
|--------------------------------------------------------------------------
*/
const path = require('path');
const helDevUtils = require('hel-dev-utils');
const packageJson = require('../package.json');

// npm run build_for_cust 设定的 HEL_APP_HOME_PAGE 值指向本地 http-server 静态服务 host
// 该设定会让构建产物时采取的publicPathOrUrl 优先使用此值，而非 subApp.getPublicPathOrUrl('http://localhost:3000/') 传递的值

console.log(`HEL_APP_HOME_PAGE: ${process.env.HEL_APP_HOME_PAGE}`);

helDevUtils.extractHelMetaJson({
  appHomePage: process.env.HEL_APP_HOME_PAGE,
  buildDirFullPath: path.join(__dirname, '../hel_dist'),
  packageJson,
});
