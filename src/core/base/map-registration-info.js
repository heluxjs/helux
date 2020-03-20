import ccContext from '../../cc-context';
import getFeatureStrAndCmkMapping from './get-feature-str-and-cmkmapping';
import getCcClassKey from './get-cc-classkey';
import * as checker from '../checker';
import * as util from '../../support/util';
import { STR_ARR_OR_STAR } from '../../support/priv-constant';
import { MODULE_GLOBAL, MODULE_DEFAULT, CC_DISPATCHER } from '../../support/constant';

const {
  moduleName_stateKeys_, moduleName_ccClassKeys_,
  moduleSingleClass, ccClassKey_ccClassContext_,
  computed: { _computedValue },
} = ccContext;
const { verifyKeys, makeError: me, verboseInfo: vbi } = util;

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
    throw new Error(`watchedKeys ${STR_ARR_OR_STAR} ${vbi(`ccClassKey:${ccClassKey}`)}`);
  }
  return inputWatchedKeys;
}

function mapModuleToCcClassKeys(moduleName, ccClassKey) {
  const ccClassKeys = util.safeGetArray(moduleName_ccClassKeys_, moduleName);

  if (moduleSingleClass[moduleName] === true && ccClassKeys.length >= 1) {
    throw new Error(`module[${moduleName}] is declared as single, only on ccClassKey can been registered to it, and now a ccClassKey[${ccClassKeys[0]}] has been registered!`);
  }

  // 做一个判断，防止热加载时，传入重复的ccClassKey
  if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey);
}

function mapCcClassKeyToCcClassContext(ccClassKey, renderKeyClasses, moduleName, originalWatchedKeys, watchedKeys, connectedModuleKeyMapping, connectedModuleNames) {
  let ccClassContext = ccClassKey_ccClassContext_[ccClassKey];

  //做一个判断，有可能是热加载调用
  if (!ccClassContext) {
    ccClassContext = util.makeCcClassContext(moduleName, ccClassKey, renderKeyClasses, watchedKeys, originalWatchedKeys);
    ccClassKey_ccClassContext_[ccClassKey] = ccClassContext;
  }

  const connectedModule = {};
  const connectedComputed = {};
  if (connectedModuleKeyMapping) {
    const _state = ccContext.store._state;
    const connectedState = ccClassContext.connectedState;

    //直接赋值引用
    connectedModuleNames.forEach(m => {
      connectedState[m] = _state[m];
      connectedComputed[m] = _computedValue[m];
      connectedModule[m] = 1;//记录连接的模块
    });

    ccClassContext.connectedModuleKeyMapping = connectedModuleKeyMapping;
    ccClassContext.connectedModule = connectedModule;
    ccClassContext.connectedComputed = connectedComputed;
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

  checker.checkModuleName(module, false, `module[${module}] is not configured in store`);
  checker.checkStoredKeys(moduleName_stateKeys_[module], inputStoredKeys);

  let _connect = connect;
  if (Array.isArray(connect)) {
    _connect = {};
    connect.forEach(m => _connect[m] = '-');//标识自动收集观察依赖
  }

  // 不指定global模块的话，默认自动收集global观察依赖，方便用户直接使用ctx.globalState时，就触发自动收集
  if (module !== MODULE_GLOBAL && !_connect[MODULE_GLOBAL]) {
    _connect[MODULE_GLOBAL] = '-';
  }

  const _watchedKeys = getWatchedStateKeys(module, ccClassKey, inputWatchedKeys);
  const { featureStr, connectedModuleKeyMapping, connectedModuleNames } = getFeatureStrAndCmkMapping(_connect, _watchedKeys);
  const _ccClassKey = getCcClassKey(allowNamingDispatcher, module, _connect, _watchedKeys, classKeyPrefix, featureStr, ccClassKey);

  let _renderKeyClasses;
  if (!renderKeyClasses) {
    _renderKeyClasses = [_ccClassKey];
  } else {
    if (!Array.isArray(renderKeyClasses) && renderKeyClasses !== '*') {
      throw new Error(`renderKeyClasses type err, it is must be an array or string *`);
    }
    _renderKeyClasses = renderKeyClasses;
  }

  mapCcClassKeyToCcClassContext(_ccClassKey, _renderKeyClasses, module, inputWatchedKeys, _watchedKeys, connectedModuleKeyMapping, connectedModuleNames);
  mapModuleToCcClassKeys(module, _ccClassKey);

  return { _module: module, _connect, _watchedKeys, _ccClassKey };
}
