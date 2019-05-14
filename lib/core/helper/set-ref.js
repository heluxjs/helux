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
var ccKey_insCount = {};

function setCcInstanceRef(ccUniqueKey, ref, ccKeys, option, delayMs) {
  function setRef() {
    _ccContext["default"].ccKey_ref_[ccUniqueKey] = ref;
    ccKeys.push(ccUniqueKey);
    _ccContext["default"].ccKey_option_[ccUniqueKey] = option;
  }

  incCcKeyInsCount(ccUniqueKey);

  if (delayMs) {
    setTimeout(setRef, delayMs);
  } else {
    setRef();
  }
}

function incCcKeyInsCount(ccUniqueKey) {
  if (ccKey_insCount[ccUniqueKey] === undefined) ccKey_insCount[ccUniqueKey] = 1;else ccKey_insCount[ccUniqueKey] += 1;
}

function decCcKeyInsCount(ccUniqueKey) {
  if (ccKey_insCount[ccUniqueKey] === undefined) ccKey_insCount[ccUniqueKey] = 0;else ccKey_insCount[ccUniqueKey] -= 1;
}

function getCcKeyInsCount(ccUniqueKey) {
  if (ccKey_insCount[ccUniqueKey] === undefined) return 0;else return ccKey_insCount[ccUniqueKey];
}

function _default(ref, isSingle, ccClassKey, ccKey, ccUniqueKey, ccOption, forCcFragment) {
  if (forCcFragment === void 0) {
    forCcFragment = false;
  }

  var classContext = _ccContext["default"].ccClassKey_ccClassContext_[ccClassKey];
  var ccKeys = classContext.ccKeys;

  if (_ccContext["default"].isDebug) {
    console.log(ss("register ccKey " + ccUniqueKey + " to CC_CONTEXT"), cl());
  }

  if (!_util["default"].isCcOptionValid(ccOption)) {
    throw me(_constant.ERR.CC_CLASS_INSTANCE_OPTION_INVALID, vbi("a standard default ccOption may like: {\"syncSharedState\": true, \"asyncLifecycleHook\":false, \"storedStateKeys\": []}"));
  }

  var isHot = _util["default"].isHotReloadMode();

  if (forCcFragment === true) {
    var fragmentCcKeys = _ccContext["default"].fragmentCcKeys;

    if (fragmentCcKeys.includes(ccKey)) {
      throw me(_constant.ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi("<CcFragment ccKey=\"" + ccKey + "\" />")); // if(isHot){
      //   util.justWarning(`cc found you supply a duplicate ccKey:${ccKey} to CcFragment, but now cc is running in hot reload mode, so if this message is wrong, you can ignore it.`);
      // }else{
      //   throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi(`<CcFragment ccKey="${ccKey}" />`));
      // }
    } else {
      fragmentCcKeys.push(ccKey);
    }
  }

  if (ccKeys.includes(ccUniqueKey)) {
    if (isHot) {
      var insCount = getCcKeyInsCount(ccUniqueKey);
      if (isSingle && insCount > 1) throw me(_constant.ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE, vbi("ccClass:" + ccClassKey));

      if (insCount > 2) {
        // now cc can make sure the ccKey duplicate
        throw me(_constant.ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
      } // just warning


      _util["default"].justWarning("\n        found ccKey " + ccKey + " may duplicate, but now is in hot reload mode, cc can't throw the error, please make sure your ccKey is unique manually,\n        " + vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " ccUniqueKey:" + ccUniqueKey) + "\n      "); // in webpack hot reload mode, cc works not very well,
      // cc can't set ref immediately, because the ccInstance of ccKey will ummount right now, in unmount func, 
      // cc call unsetCcInstanceRef will lost the right ref in CC_CONTEXT.refs
      // so cc set ref later


      setCcInstanceRef(ccUniqueKey, ref, ccKeys, ccOption, 600);
    } else {
      throw me(_constant.ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
    }
  } else {
    setCcInstanceRef(ccUniqueKey, ref, ccKeys, ccOption);
  }

  return classContext;
}