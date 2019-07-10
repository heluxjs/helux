"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _constant = require("../../support/constant");

var _util = _interopRequireDefault(require("../../support/util"));

// import setConnectedState from '../state/set-connected-state';
var me = _util["default"].makeError;

function _default(ccClassKey, moduleName, originalWatchedKeys, watchedKeys, stateToPropMapping, connectedModuleNames, forCcFragment) {
  if (forCcFragment === void 0) {
    forCcFragment = false;
  }

  var contextMap = _ccContext["default"].ccClassKey_ccClassContext_;
  var _computedValue = _ccContext["default"].computed._computedValue;
  var ccClassContext = contextMap[ccClassKey];

  if (forCcFragment === true) {
    //对于CcFragment的调用，ccClassContext可能是已存在的，
    //因为cc根据CcFragment的connect参数计算ccClassKey
    //多个CcFragment实例的connect一样的话，会计算出同一个ccClassKey
    if (ccClassContext === undefined) {
      ccClassContext = _util["default"].makeCcClassContext(moduleName, ccClassKey, watchedKeys, originalWatchedKeys);
    }
  } else {
    //对于register调用，ccClassContext一定是不存在的, 如果存在就报错
    if (ccClassContext !== undefined) {
      _ccContext["default"].throwCcHmrError(me(_constant.ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate"));
    }

    ccClassContext = _util["default"].makeCcClassContext(moduleName, ccClassKey, watchedKeys, originalWatchedKeys);
  }

  var connectedModule = {};
  var connectedComputed = {};

  if (stateToPropMapping) {
    var _state = _ccContext["default"].store._state;
    var connectedState = ccClassContext.connectedState; // const prefixedKeys = Object.keys(stateToPropMapping);
    // const len = prefixedKeys.length;
    // for (let i = 0; i < len; i++) {
    //   const prefixedKey = prefixedKeys[i];
    //   const [targetModule, targetStateKey] = prefixedKey.split('/');// prefixedKey : 'foo/f1'
    //   connectedModule[targetModule] = 1;
    //   const moduleState = _state[targetModule];
    //   connectedState[targetModule] = moduleState;
    //   // setConnectedState(connectedState, targetModule, targetStateKey, moduleState[targetStateKey]);
    //   if(!connectedComputed[targetModule]){//绑定_computedValue的引用到connectedComputed上
    //     connectedComputed[targetModule] = _computedValue[targetModule];
    //   }
    // }
    //直接赋值引用

    connectedModuleNames.forEach(function (m) {
      connectedState[m] = _state[m];
      connectedComputed[m] = _computedValue[m];
      connectedModule[m] = 1; //记录连接的模块
    });
    ccClassContext.stateToPropMapping = stateToPropMapping;
    ccClassContext.connectedModule = connectedModule;
    ccClassContext.connectedComputed = connectedComputed;
  }

  contextMap[ccClassKey] = ccClassContext;
}