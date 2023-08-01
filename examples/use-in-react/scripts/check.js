/*
|--------------------------------------------------------------------------
|
| 此脚本在流水线上会被触发，用于校验组名是否和应用里的组名保持一致
|
|--------------------------------------------------------------------------
*/
const path = require('path');
const helDevUtils = require('hel-dev-utils');
const pkg = require('../package.json');

const fileFullPath = path.join(__dirname, '../src/configs/subApp');
helDevUtils.check(pkg, { fileFullPath, checkEnv: false });
