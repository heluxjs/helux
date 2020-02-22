"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.incCcKeyInsCount = incCcKeyInsCount;
exports.decCcKeyInsCount = decCcKeyInsCount;
exports.getCcKeyInsCount = getCcKeyInsCount;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _constant = require("../../support/constant");

var util = _interopRequireWildcard(require("../../support/util"));

var justWarning = util.justWarning,
    me = util.makeError,
    vbi = util.verboseInfo,
    ss = util.styleStr,
    cl = util.color;
var runtimeVar = _ccContext["default"].runtimeVar,
    ccClassKey_ccClassContext_ = _ccContext["default"].ccClassKey_ccClassContext_,
    ccUkey_ref_ = _ccContext["default"].ccUkey_ref_;
var ccUKey_insCount = {};

function setCcInstanceRef(ccUniqueKey, ref, ccKeys, delayMs) {
  function setRef() {
    ccUkey_ref_[ccUniqueKey] = ref;
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
  var classContext = ccClassKey_ccClassContext_[ccClassKey];
  var ccKeys = classContext.ccKeys;

  if (runtimeVar.isDebug) {
    console.log(ss("register ccKey " + ccUniqueKey + " to CC_CONTEXT"), cl());
  }

  var isHot = _ccContext["default"].isHotReloadMode();

  if (ccKeys.includes(ccUniqueKey)) {
    if (isHot) {
      var _dupErr = function _dupErr() {
        throw me(_constant.ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
      }; // get existed ins count


      var insCount = getCcKeyInsCount(ccUniqueKey);
      if (isSingle && insCount > 0) throw me(_constant.ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE, vbi("ccClass:" + ccClassKey));

      if (insCount > 1) {
        // now cc can make sure the ccKey duplicate
        _dupErr();
      } // just warning


      justWarning("\n        found ccKey[" + ccKey + "] duplicated in hot reload mode, please make sure your ccKey is unique manually,\n        " + vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " ccUniqueKey:" + ccUniqueKey) + "\n      "); // in webpack hot reload mode, cc works not very well,
      // cc can't set ref immediately, because the ccInstance of ccKey will ummount right now, in unmount func, 
      // cc call unsetCcInstanceRef will lost the right ref in CC_CONTEXT.refs
      // so cc set ref later

      setCcInstanceRef(ccUniqueKey, ref, ccKeys, 600);
    } else {
      dupErr();
    }
  } else {
    setCcInstanceRef(ccUniqueKey, ref, ccKeys);
  }

  return classContext;
}