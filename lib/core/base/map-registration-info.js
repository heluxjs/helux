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

var _constant = require("../../support/constant");

var moduleName_stateKeys_ = _ccContext["default"].moduleName_stateKeys_,
    moduleName_ccClassKeys_ = _ccContext["default"].moduleName_ccClassKeys_,
    moduleSingleClass = _ccContext["default"].moduleSingleClass,
    ccClassKey_ccClassContext_ = _ccContext["default"].ccClassKey_ccClassContext_,
    connectedModuleName_ccClassKeys_ = _ccContext["default"].connectedModuleName_ccClassKeys_,
    _computedValue = _ccContext["default"].computed._computedValue;
var verifyKeys = util.verifyKeys,
    me = util.makeError,
    vbi = util.verboseInfo;

function checkCcStartupOrNot() {
  if (_ccContext["default"].isCcAlreadyStartup !== true || !window.cc) {
    throw new Error('you must startup cc by call startup method before register ReactClass to cc!');
  }
}

function getWatchedStateKeys(module, ccClassKey, inputWatchedKeys) {
  var watchedKeys = inputWatchedKeys;

  if (inputWatchedKeys === '*') {
    watchedKeys = moduleName_stateKeys_[module];
  }

  var _verifyKeys = verifyKeys(watchedKeys, []),
      notArray = _verifyKeys.notArray,
      keyElementNotString = _verifyKeys.keyElementNotString;

  if (notArray) {
    throw me(_constant.ERR.CC_ARG_KEYS_NOT_AN_ARRAY, vbi("ccClassKey:" + ccClassKey));
  }

  if (keyElementNotString) {
    throw me(_constant.ERR.CC_ARG_KEYS_NOT_AN_ARRAY, vbi("ccClassKey:" + ccClassKey));
  }

  return watchedKeys;
}

function mapModuleToCcClassKeys(moduleName, ccClassKey) {
  var ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, moduleName);

  if (moduleSingleClass[moduleName] === true && ccClassKeys.length >= 1) {
    throw new Error("module[" + moduleName + "] is declared as single, only on ccClassKey can been registered to it, and now a ccClassKey[" + ccClassKeys[0] + "] has been registered!");
  }

  if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey);
}

function mapCcClassKeyToCcClassContext(ccClassKey, moduleName, originalWatchedKeys, watchedKeys, connectedModuleKeyMapping, connectedModuleNames) {
  var ccClassContext = ccClassKey_ccClassContext_[ccClassKey];

  if (!ccClassContext) {
    ccClassContext = util.makeCcClassContext(moduleName, ccClassKey, watchedKeys, originalWatchedKeys);
    var connectedModule = {};
    var connectedComputed = {};

    if (connectedModuleKeyMapping) {
      var _state = _ccContext["default"].store._state;
      var connectedState = ccClassContext.connectedState; //直接赋值引用

      connectedModuleNames.forEach(function (m) {
        connectedState[m] = _state[m];
        connectedComputed[m] = _computedValue[m];
        connectedModule[m] = 1; //记录连接的模块
        //记录这个模块被某个ccClassKey连接

        var ccClassKeys = util.safeGetArrayFromObject(connectedModuleName_ccClassKeys_, m);
        ccClassKeys.push(ccClassKey);
      });
      ccClassContext.connectedModuleKeyMapping = connectedModuleKeyMapping;
      ccClassContext.connectedModule = connectedModule;
      ccClassContext.connectedComputed = connectedComputed;
    }

    ccClassKey_ccClassContext_[ccClassKey] = ccClassContext;
  }
}
/**
 * map registration info to ccContext
 */


function _default(module, ccClassKey, classKeyPrefix, inputWatchedKeys, inputStoredKeys, connect, reducerModule, __checkStartUp, __calledBy) {
  if (inputStoredKeys === void 0) {
    inputStoredKeys = [];
  }

  if (__checkStartUp === true) checkCcStartupOrNot();
  var allowNamingDispatcher = __calledBy === 'cc';

  var _reducerModule = reducerModule || module; //if reducerModule not defined, will be equal module;


  checker.checkModuleName(module, false, "module[" + module + "] is not configured in store");
  checker.checkStoredKeys(moduleName_stateKeys_[module], inputStoredKeys);
  var _connect = connect;

  if (Array.isArray(connect)) {
    _connect = {};
    connect.forEach(function (m) {
      return _connect[m] = '*';
    });
  }

  var _watchedKeys = getWatchedStateKeys(module, ccClassKey, inputWatchedKeys);

  var _getFeatureStrAndCmkM = (0, _getFeatureStrAndCmkmapping["default"])(_connect),
      featureStr = _getFeatureStrAndCmkM.featureStr,
      connectedModuleKeyMapping = _getFeatureStrAndCmkM.connectedModuleKeyMapping,
      connectedModuleNames = _getFeatureStrAndCmkM.connectedModuleNames;

  var _ccClassKey = (0, _getCcClasskey["default"])(allowNamingDispatcher, module, _connect, classKeyPrefix, featureStr, ccClassKey);

  mapCcClassKeyToCcClassContext(_ccClassKey, module, inputWatchedKeys, _watchedKeys, connectedModuleKeyMapping, connectedModuleNames);
  mapModuleToCcClassKeys(module, _ccClassKey);
  var isSKeysArr = Array.isArray(inputStoredKeys);

  if (!isSKeysArr && inputStoredKeys !== '*') {
    throw new Error("storedKeys type err, it is must be an array or string *");
  }

  if (isSKeysArr) {
    inputStoredKeys.forEach(function (v) {
      if (_watchedKeys.includes(v)) {
        throw new Error("storedKeys key err, the key[" + v + "] is already been declared in watchedKeys");
      }
    });
  }

  return {
    _module: module,
    _reducerModule: _reducerModule,
    _connect: _connect,
    _watchedKeys: _watchedKeys,
    _ccClassKey: _ccClassKey
  };
}