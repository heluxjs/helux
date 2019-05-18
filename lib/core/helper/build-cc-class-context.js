"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _constant = require("../../support/constant");

var _util = _interopRequireDefault(require("../../support/util"));

var _setPropState = _interopRequireDefault(require("./set-prop-state"));

var _getFeatureStrAndStpmapping = _interopRequireDefault(require("./get-feature-str-and-stpmapping"));

var me = _util["default"].makeError,
    vbi = _util["default"].verboseInfo,
    throwCcHmrError = _util["default"].throwCcHmrError;

function _default(ccClassKey, moduleName, originalSharedStateKeys, originalGlobalStateKeys, sharedStateKeys, globalStateKeys, stateToPropMapping, forCcFragment) {
  if (forCcFragment === void 0) {
    forCcFragment = false;
  }

  var contextMap = _ccContext["default"].ccClassKey_ccClassContext_;
  var ccClassContext = contextMap[ccClassKey];

  if (forCcFragment === true) {
    //对于CcFragment的调用，ccClassContext可能是已存在的，因为cc根据CcFragment的connect参数为当前CcFragment分配一个ccClassKey，
    //多个CcFragment实例的connect一样的话，会被分配给同一个ccClassKey
    if (ccClassContext === undefined) {
      ccClassContext = _util["default"].makeCcClassContext(moduleName, ccClassKey, sharedStateKeys, globalStateKeys, originalSharedStateKeys, originalGlobalStateKeys);
    }
  } else {
    //对于register调用，ccClassContext一定是不存在的
    if (ccClassContext !== undefined) {
      throwCcHmrError(me(_constant.ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate"));
    }

    ccClassContext = _util["default"].makeCcClassContext(moduleName, ccClassKey, sharedStateKeys, globalStateKeys, originalSharedStateKeys, originalGlobalStateKeys);
  }

  var connectedModule = {};

  if (stateToPropMapping) {
    var _state = _ccContext["default"].store._state;
    var propState = ccClassContext.propState;
    var prefixedKeys = Object.keys(stateToPropMapping);
    var len = prefixedKeys.length;

    for (var i = 0; i < len; i++) {
      var prefixedKey = prefixedKeys[i];

      var _prefixedKey$split = prefixedKey.split('/'),
          targetModule = _prefixedKey$split[0],
          targetStateKey = _prefixedKey$split[1]; // prefixedKey : 'foo/f1'


      connectedModule[targetModule] = 1;
      var moduleState = _state[targetModule];
      (0, _setPropState["default"])(propState, targetModule, targetStateKey, moduleState[targetStateKey]);
    }

    ccClassContext.stateToPropMapping = stateToPropMapping;
    ccClassContext.connectedModule = connectedModule;
  }

  contextMap[ccClassKey] = ccClassContext;
}