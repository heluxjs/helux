import ccContext from '../../cc-context';
import getFeatureStrAndCmkMapping from './get-feature-str-and-cmkmapping';
import getCcClassKey from './get-cc-classkey';
import * as checker from '../checker';
import * as util from '../../support/util';
import { ERR, MODULE_DEFAULT } from '../../support/constant';

const {
  moduleName_stateKeys_, moduleName_ccClassKeys_,
  moduleSingleClass, ccClassKey_ccClassContext_,
  connectedModuleName_ccClassKeys_,
  computed: { _computedValue },
} = ccContext;
const { verifyKeys, makeError: me, verboseInfo: vbi } = util;

function checkCcStartupOrNot() {
  if (ccContext.isCcAlreadyStartup !== true || !window.cc) {
    throw new Error('you must startup cc by call startup method before register ReactClass to cc!');
  }
}

function getWatchedStateKeys(module, ccClassKey, inputWatchedKeys) {
  let watchedKeys = inputWatchedKeys;
  if (inputWatchedKeys === '*') {
    watchedKeys = moduleName_stateKeys_[module];
  }
  const { notArray, keyElementNotString } = verifyKeys(watchedKeys, []);
  if (notArray) {
    throw me(ERR.CC_ARG_KEYS_NOT_AN_ARRAY, vbi(`ccClassKey:${ccClassKey}`));
  }
  if (keyElementNotString) {
    throw me(ERR.CC_ARG_KEYS_NOT_AN_ARRAY, vbi(`ccClassKey:${ccClassKey}`));
  }
  return watchedKeys;
}

function mapModuleToCcClassKeys(moduleName, ccClassKey) {
  const ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, moduleName);

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

      //记录这个模块被某个ccClassKey连接
      const ccClassKeys = util.safeGetArrayFromObject(connectedModuleName_ccClassKeys_, m);
      ccClassKeys.push(ccClassKey);
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
  inputStoredKeys = [], connect, reducerModule, __checkStartUp, __calledBy
) {
  if (__checkStartUp === true) checkCcStartupOrNot();
  const allowNamingDispatcher = __calledBy === 'cc';
  const _reducerModule = reducerModule || module;//if reducerModule not defined, will be equal module;

  checker.checkModuleName(module, false, `module[${module}] is not configured in store`);
  checker.checkStoredKeys(moduleName_stateKeys_[module], inputStoredKeys);

  let _connect = connect;
  if (Array.isArray(connect)) {
    _connect = {};
    connect.forEach(m => _connect[m] = '*');
  }

  const _watchedKeys = getWatchedStateKeys(module, ccClassKey, inputWatchedKeys);
  const { featureStr, connectedModuleKeyMapping, connectedModuleNames } = getFeatureStrAndCmkMapping(_connect);
  const _ccClassKey = getCcClassKey(allowNamingDispatcher, module, _connect, classKeyPrefix, featureStr, ccClassKey);

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

  const isSKeysArr = Array.isArray(inputStoredKeys);
  if (!isSKeysArr && inputStoredKeys !== '*') {
    throw new Error(`storedKeys type err, it is must be an array or string *`)
  }
  if (isSKeysArr) {
    inputStoredKeys.forEach(v => {
      if (_watchedKeys.includes(v)) {
        throw new Error(`storedKeys key err, the key[${v}] is already been declared in watchedKeys`)
      }
    });
  }

  return { _module: module, _reducerModule, _connect, _watchedKeys, _ccClassKey };
}