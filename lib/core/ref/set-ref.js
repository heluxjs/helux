"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.incCcKeyInsCount = incCcKeyInsCount;
exports.decCcKeyInsCount = decCcKeyInsCount;
exports.getCcKeyInsCount = getCcKeyInsCount;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _constant = require("../../support/constant");

var _util = _interopRequireDefault(require("../../support/util"));

var me = _util["default"].makeError,
    vbi = _util["default"].verboseInfo,
    ss = _util["default"].styleStr,
    cl = _util["default"].color;
var ccUKey_insCount = {};

function setCcInstanceRef(ccUniqueKey, ref, ccKeys, delayMs) {
  function setRef() {
    _ccContext["default"].ccUkey_ref_[ccUniqueKey] = ref;
    ccKeys.push(ccUniqueKey);
  }

  incCcKeyInsCount(ccUniqueKey);

  if (delayMs) {
    setTimeout(setRef, delayMs);
  } else {
    setRef();
  }
}

function incCcKeyInsCount(ccUniqueKey) {
  if (ccUKey_insCount[ccUniqueKey] === undefined) ccUKey_insCount[ccUniqueKey] = 1;else ccUKey_insCount[ccUniqueKey] += 1;
}

function decCcKeyInsCount(ccUniqueKey) {
  if (ccUKey_insCount[ccUniqueKey] === undefined) ccUKey_insCount[ccUniqueKey] = 0;else ccUKey_insCount[ccUniqueKey] -= 1;
}

function getCcKeyInsCount(ccUniqueKey) {
  if (ccUKey_insCount[ccUniqueKey] === undefined) return 0;else return ccUKey_insCount[ccUniqueKey];
}

function _default(ref, isSingle, ccClassKey, ccKey, ccUniqueKey) {
  var classContext = _ccContext["default"].ccClassKey_ccClassContext_[ccClassKey];
  var ccKeys = classContext.ccKeys;

  if (_ccContext["default"].isDebug) {
    console.log(ss("register ccKey " + ccUniqueKey + " to CC_CONTEXT"), cl());
  }

  var isHot = _ccContext["default"].isHotReloadMode();

  if (ccKeys.includes(ccUniqueKey)) {
    if (isHot) {
      // get existed ins count
      var insCount = getCcKeyInsCount(ccUniqueKey);
      if (isSingle && insCount > 0) throw me(_constant.ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE, vbi("ccClass:" + ccClassKey));

      if (insCount > 1) {
        // now cc can make sure the ccKey duplicate
        throw me(_constant.ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
      } // just warning


      _util["default"].justWarning("\n        found ccKey " + ccKey + " may duplicate, but now is in hot reload mode, cc can't throw the error, please make sure your ccKey is unique manually,\n        " + vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " ccUniqueKey:" + ccUniqueKey) + "\n      "); // in webpack hot reload mode, cc works not very well,
      // cc can't set ref immediately, because the ccInstance of ccKey will ummount right now, in unmount func, 
      // cc call unsetCcInstanceRef will lost the right ref in CC_CONTEXT.refs
      // so cc set ref later


      setCcInstanceRef(ccUniqueKey, ref, ccKeys, 600);
    } else {
      throw me(_constant.ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi("ccClass:[" + ccClassKey + "],ccKey:[" + ccUniqueKey + "]"));
    }
  } else {
    setCcInstanceRef(ccUniqueKey, ref, ccKeys);
  }

  return classContext;
}