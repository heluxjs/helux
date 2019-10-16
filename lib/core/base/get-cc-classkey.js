"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _constant = require("../../support/constant");

var util = _interopRequireWildcard(require("../../support/util"));

var isObjectNull = util.isObjectNull,
    me = util.makeError;
var featureStr_classKey_ = _ccContext["default"].featureStr_classKey_,
    userClassKey_featureStr_ = _ccContext["default"].userClassKey_featureStr_,
    ccClassKey_ccClassContext_ = _ccContext["default"].ccClassKey_ccClassContext_;
var cursor = 0;

function _default(allowNamingDispatcher, module, connect, watchedKeys, prefix, featureStr, classKey) {
  if (classKey === void 0) {
    classKey = '';
  }

  // 未指定classKey
  if (!classKey) {
    // 未指定所属模块，也未连接到其他模块，且无watchedKeys
    if (module === _constant.MODULE_DEFAULT && isObjectNull(connect) && watchedKeys.length === 0) {
      return prefix + "0";
    }

    var prefixedFeatureStr = prefix + ":" + featureStr;
    var _classKey = featureStr_classKey_[prefixedFeatureStr];

    if (_classKey) {
      return _classKey;
    }

    cursor++;
    _classKey = "" + prefix + cursor;
    featureStr_classKey_[prefixedFeatureStr] = _classKey;
    return _classKey;
  } // verify user input classKey


  if (classKey.startsWith(_constant.CC_PREFIX)) {
    throw new Error("user can not specify a classKey[" + classKey + "] starts with $$Cc");
  }

  if (!allowNamingDispatcher) {
    if (classKey.toLowerCase() === _constant.CC_DISPATCHER.toLowerCase()) {
      throw new Error(_constant.CC_DISPATCHER + " is cc built-in ccClassKey name, if you want to customize your dispatcher, \n      you can set autoCreateDispatcher=false in StartupOption, and use createDispatcher then.");
    }
  }

  var ctx = ccClassKey_ccClassContext_[classKey];

  if (ctx) {
    var fStr = userClassKey_featureStr_[classKey];

    if (fStr !== featureStr) {
      //不允许，特征值不一样的class指定相同的ccClassKey
      throw me(_constant.ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:[" + classKey + "] duplicate");
    }
  } else {
    userClassKey_featureStr_[classKey] = featureStr;
  }

  return classKey;
}