"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _getFeatureStrAndCmkmapping = _interopRequireDefault(require("./get-feature-str-and-cmkmapping"));

var _getCcClasskey = _interopRequireDefault(require("./get-cc-classkey"));

var checker = _interopRequireWildcard(require("../checker"));

var util = _interopRequireWildcard(require("../../support/util"));

var _privConstant = require("../../support/priv-constant");

var _constant = require("../../support/constant");

var moduleName_stateKeys_ = _ccContext["default"].moduleName_stateKeys_,
    moduleName_ccClassKeys_ = _ccContext["default"].moduleName_ccClassKeys_,
    moduleSingleClass = _ccContext["default"].moduleSingleClass,
    ccClassKey_ccClassContext_ = _ccContext["default"].ccClassKey_ccClassContext_,
    _computedValue = _ccContext["default"].computed._computedValue;
var verifyKeys = util.verifyKeys,
    vbi = util.verboseInfo;

function checkCcStartupOrNot() {
  if (_ccContext["default"].isStartup !== true) {
    throw new Error('you must startup cc by call startup method before register ReactClass to cc!');
  }
}

function getWatchedStateKeys(module, ccClassKey, inputWatchedKeys) {
  if (ccClassKey === _constant.CC_DISPATCHER) return [];
  if (!inputWatchedKeys) return [];

  if (inputWatchedKeys === '*') {
    return moduleName_stateKeys_[module];
  }

  var _verifyKeys = verifyKeys(inputWatchedKeys, []),
      notArray = _verifyKeys.notArray,
      keyElementNotString = _verifyKeys.keyElementNotString;

  if (notArray || keyElementNotString) {
    throw new Error("watchedKeys " + _privConstant.STR_ARR_OR_STAR + " " + vbi("ccClassKey:" + ccClassKey));
  }

  return inputWatchedKeys;
}

function mapModuleToCcClassKeys(moduleName, ccClassKey) {
  var ccClassKeys = util.safeGetArray(moduleName_ccClassKeys_, moduleName);

  if (moduleSingleClass[moduleName] === true && ccClassKeys.length >= 1) {
    throw new Error("module[" + moduleName + "] is declared as single, only on ccClassKey can been registered to it, and now a ccClassKey[" + ccClassKeys[0] + "] has been registered!");
  } // 做一个判断，防止热加载时，传入重复的ccClassKey


  if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey);
}

function mapCcClassKeyToCcClassContext(ccClassKey, renderKeyClasses, moduleName, originalWatchedKeys, watchedKeys, connectedModuleKeyMapping, connectedModuleNames) {
  var ccClassContext = ccClassKey_ccClassContext_[ccClassKey]; //做一个判断，有可能是热加载调用

  if (!ccClassContext) {
    ccClassContext = util.makeCcClassContext(moduleName, ccClassKey, renderKeyClasses, watchedKeys, originalWatchedKeys);
    ccClassKey_ccClassContext_[ccClassKey] = ccClassContext;
  }

  var connectedModule = {};
  var connectedComputed = {};

  if (connectedModuleKeyMapping) {
    var _state = _ccContext["default"].store._state;
    var connectedState = ccClassContext.connectedState; //直接赋值引用

    connectedModuleNames.forEach(function (m) {
      connectedState[m] = _state[m];
      connectedComputed[m] = _computedValue[m];
      connectedModule[m] = 1; //记录连接的模块
    });
    ccClassContext.connectedModuleKeyMapping = connectedModuleKeyMapping;
    ccClassContext.connectedModule = connectedModule;
    ccClassContext.connectedComputed = connectedComputed;
  }
}
/**
 * map registration info to ccContext
 */


function _default(module, ccClassKey, renderKeyClasses, classKeyPrefix, inputWatchedKeys, inputStoredKeys, connect, __checkStartUp, __calledBy) {
  if (module === void 0) {
    module = _constant.MODULE_DEFAULT;
  }

  if (inputStoredKeys === void 0) {
    inputStoredKeys = [];
  }

  if (__checkStartUp === true) checkCcStartupOrNot();
  var allowNamingDispatcher = __calledBy === 'cc';
  checker.checkModuleName(module, false, "module[" + module + "] is not configured in store");
  checker.checkStoredKeys(moduleName_stateKeys_[module], inputStoredKeys);
  var _connect = connect;
  var isArr = Array.isArray(connect);

  if (isArr || typeof connect === 'string') {
    _connect = {};
    var connectedModules = isArr ? connect : connect.split(',');
    connectedModules.forEach(function (m) {
      _connect[m] = '-';
    }); //标识自动收集观察依赖
  } // 不指定global模块的话，默认自动收集global观察依赖，方便用户直接使用ctx.globalState时，就触发自动收集


  if (module !== _constant.MODULE_GLOBAL && !_connect[_constant.MODULE_GLOBAL]) {
    _connect[_constant.MODULE_GLOBAL] = '-';
  }

  var _watchedKeys = getWatchedStateKeys(module, ccClassKey, inputWatchedKeys);

  var _getFeatureStrAndCmkM = (0, _getFeatureStrAndCmkmapping["default"])(_connect, _watchedKeys),
      featureStr = _getFeatureStrAndCmkM.featureStr,
      connectedModuleKeyMapping = _getFeatureStrAndCmkM.connectedModuleKeyMapping,
      connectedModuleNames = _getFeatureStrAndCmkM.connectedModuleNames;

  var _ccClassKey = (0, _getCcClasskey["default"])(allowNamingDispatcher, module, _connect, _watchedKeys, classKeyPrefix, featureStr, ccClassKey);

  var _renderKeyClasses;

  if (!renderKeyClasses) {
    _renderKeyClasses = [_ccClassKey];
  } else {
    if (!Array.isArray(renderKeyClasses) && renderKeyClasses !== '*') {
      throw new Error("renderKeyClasses type err, it is must be an array or string *");
    }

    _renderKeyClasses = renderKeyClasses;
  }

  mapCcClassKeyToCcClassContext(_ccClassKey, _renderKeyClasses, module, inputWatchedKeys, _watchedKeys, connectedModuleKeyMapping, connectedModuleNames);
  mapModuleToCcClassKeys(module, _ccClassKey);
  return {
    _module: module,
    _connect: _connect,
    _watchedKeys: _watchedKeys,
    _ccClassKey: _ccClassKey
  };
}