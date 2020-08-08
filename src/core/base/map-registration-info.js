import ccContext from '../../cc-context';
import getFeatureStr from './get-feature-str';
import getCcClassKey from './get-cc-classkey';
import * as checker from '../checker';
import * as util from '../../support/util';
import { STR_ARR_OR_STAR } from '../../support/priv-constant';
import { MODULE_GLOBAL, MODULE_DEFAULT, CC_DISPATCHER } from '../../support/constant';

const {
  moduleName_stateKeys_, moduleName_ccClassKeys_,
  ccClassKey_ccClassContext_,
} = ccContext;
const { verifyKeys, verboseInfo: vbi } = util;

function checkCcStartupOrNot() {
  if (ccContext.isStartup !== true) {
    throw new Error('you must startup cc by call startup method before register ReactClass to cc!');
  }
}

function getWatchedStateKeys(module, ccClassKey, inputWatchedKeys) {
  if (ccClassKey === CC_DISPATCHER) return [];

  if (!inputWatchedKeys) return [];

  if (inputWatchedKeys === '*') {
    return moduleName_stateKeys_[module];
  }

  const { notArray, keyElementNotString } = verifyKeys(inputWatchedKeys, []);
  if (notArray || keyElementNotString) {
    const vbiInfo = vbi(`ccClassKey:${ccClassKey}`);
    throw new Error(`watchedKeys ${STR_ARR_OR_STAR} ${vbiInfo}`);
  }
  return inputWatchedKeys;
}

function mapModuleToCcClassKeys(moduleName, ccClassKey) {
  const ccClassKeys = util.safeGetArray(moduleName_ccClassKeys_, moduleName);

  // 做一个判断，防止热加载时，传入重复的ccClassKey
  if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey);
}

function mapCcClassKeyToCcClassContext(ccClassKey, renderKeyClasses, moduleName, originalWatchedKeys, watchedKeys) {
  let ccClassContext = ccClassKey_ccClassContext_[ccClassKey];

  //做一个判断，有可能是热加载调用
  if (!ccClassContext) {
    ccClassContext = util.makeCcClassContext(moduleName, ccClassKey, renderKeyClasses, watchedKeys, originalWatchedKeys);
    ccClassKey_ccClassContext_[ccClassKey] = ccClassContext;
  }
}

/**
 * map registration info to ccContext
 */
export default function (
  module = MODULE_DEFAULT, ccClassKey, renderKeyClasses, classKeyPrefix, inputWatchedKeys,
  inputStoredKeys = [], connect, __checkStartUp, __calledBy
) {
  if (__checkStartUp === true) checkCcStartupOrNot();
  const allowNamingDispatcher = __calledBy === 'cc';

  checker.checkModuleName(module, false, `module[${module}] not configured`);
  checker.checkStoredKeys(moduleName_stateKeys_[module], inputStoredKeys);

  let _connect = connect || {};// codesandbox lost default value
  const isArr = Array.isArray(connect);
  if (isArr || typeof connect === 'string') {
    _connect = {};
    const connectedModules = isArr ? connect : connect.split(',');
    connectedModules.forEach(m => { _connect[m] = '-' });//标识自动收集观察依赖
  }

  // 未设定连接$$global模块的watchedKeys参数时，自动连击$$global模块，并默认采用依赖收集
  if (!_connect[MODULE_GLOBAL]) {
    _connect[MODULE_GLOBAL] = '-';
  }

  const _watchedKeys = getWatchedStateKeys(module, ccClassKey, inputWatchedKeys);
  const featureStr = getFeatureStr(_connect, _watchedKeys);
  const _ccClassKey = getCcClassKey(allowNamingDispatcher, module, _connect, _watchedKeys, classKeyPrefix, featureStr, ccClassKey);

  let _renderKeyClasses;
  if (!renderKeyClasses) {
    _renderKeyClasses = [_ccClassKey];
  } else {
    if (!Array.isArray(renderKeyClasses) && renderKeyClasses !== '*') {
      throw new Error(`renderKeyClasses type err, it ${STR_ARR_OR_STAR}`);
    }
    _renderKeyClasses = renderKeyClasses;
  }

  mapCcClassKeyToCcClassContext(_ccClassKey, _renderKeyClasses, module, inputWatchedKeys, _watchedKeys);
  mapModuleToCcClassKeys(module, _ccClassKey);

  return { _module: module, _connect, _watchedKeys, _ccClassKey };
}
