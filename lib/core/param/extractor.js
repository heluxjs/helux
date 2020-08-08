"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.getStoredKeys = getStoredKeys;
exports.getWatchedStateKeys = getWatchedStateKeys;
exports.getConnect = getConnect;

var _constant = require("../../support/constant");

var _privConstant = require("../../support/priv-constant");

var util = _interopRequireWildcard(require("../../support/util"));

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var checker = _interopRequireWildcard(require("./checker"));

var getModuleStateKeys = _ccContext["default"].getModuleStateKeys;
var verifyKeys = util.verifyKeys,
    vbi = util.verboseInfo;

function getStoredKeys(belongMotule, refPrivState, ccOptionStoredKeys, regStoredKeys) {
  var targetStoredKeys = ccOptionStoredKeys || regStoredKeys;

  if (!targetStoredKeys) {
    return [];
  }

  var moduleStateKeys = getModuleStateKeys(belongMotule);

  if (targetStoredKeys === '*') {
    // refPrivState里可能含有moduleStateKey，需要进一步过滤
    return Object.keys(refPrivState).filter(function (k) {
      return !moduleStateKeys.includes(k);
    });
  } else {
    checker.checkStoredKeys(belongMotule, targetStoredKeys);
    return targetStoredKeys;
  }
}

function getWatchedStateKeys(module, ccClassKey, regWatchedKeys) {
  if (ccClassKey === _constant.CC_DISPATCHER) return [];
  if (!regWatchedKeys) return [];

  if (regWatchedKeys === '*') {
    return getModuleStateKeys(module);
  }

  if (regWatchedKeys === '-') {
    return regWatchedKeys;
  }

  var _verifyKeys = verifyKeys(regWatchedKeys, []),
      notArray = _verifyKeys.notArray,
      keyElementNotString = _verifyKeys.keyElementNotString;

  if (notArray || keyElementNotString) {
    var vbiInfo = vbi("ccClassKey:" + ccClassKey);
    throw new Error("watchedKeys " + _privConstant.STR_ARR_OR_STAR + " " + vbiInfo);
  }

  return regWatchedKeys;
}

function getConnect(regConnect) {
  var targetConnect = regConnect || {}; // codesandbox lost default value

  if (!util.isPJO(targetConnect, true)) {
    throw new Error("param connect type error, it " + _privConstant.NOT_A_JSON + " or string array");
  }

  var isArr = Array.isArray(targetConnect);
  var finalConnect = {};

  if (isArr || typeof targetConnect === 'string') {
    var connectedModules = isArr ? targetConnect : targetConnect.split(',');
    connectedModules.forEach(function (m) {
      finalConnect[m] = '-';
    }); //标识自动收集观察依赖
  } else {
    finalConnect = regConnect;
  } // 未设定连接$$global模块的watchedKeys参数时，自动连接$$global模块，并默认采用依赖收集


  if (!finalConnect[_constant.MODULE_GLOBAL]) {
    finalConnect[_constant.MODULE_GLOBAL] = '-';
  }

  checker.checkConnectSpec(finalConnect);
  return finalConnect;
}