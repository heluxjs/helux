"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _setRef = require("./set-ref");

var _util = require("../../support/util");

var ccKey_ref_ = _ccContext["default"].ccKey_ref_,
    ccKey_option_ = _ccContext["default"].ccKey_option_,
    ccUniqueKey_handlerKeys_ = _ccContext["default"].ccUniqueKey_handlerKeys_,
    ccClassKey_ccClassContext_ = _ccContext["default"].ccClassKey_ccClassContext_,
    handlerKey_handler_ = _ccContext["default"].handlerKey_handler_,
    fragmentCcKeys = _ccContext["default"].fragmentCcKeys;

function _default(ccClassKey, ccUniqueKey) {
  if (_ccContext["default"].isDebug) {
    console.log((0, _util.styleStr)(ccUniqueKey + " unset ref"), (0, _util.color)('purple'));
  }

  var fIndex = fragmentCcKeys.indexOf(ccUniqueKey);

  if (fIndex >= 0) {
    fragmentCcKeys.splice(fIndex, 1);
  } // ccContext.ccKey_ref_[ccUniqueKey] = null;


  delete ccKey_ref_[ccUniqueKey];
  delete ccKey_option_[ccUniqueKey];
  var classContext = ccClassKey_ccClassContext_[ccClassKey];
  var ccKeys = classContext.ccKeys;
  var ccKeyIdx = ccKeys.indexOf(ccUniqueKey);
  if (ccKeyIdx >= 0) ccKeys.splice(ccKeyIdx, 1);
  (0, _setRef.decCcKeyInsCount)(ccUniqueKey);
  var handlerKeys = ccUniqueKey_handlerKeys_[ccUniqueKey];

  if (handlerKeys) {
    handlerKeys.forEach(function (hKey) {
      delete handlerKey_handler_[hKey]; // ccUniqueKey maybe generated randomly, so delete the key instead of set null
      // handlerKey_handler_[hKey] = null;
    });
  }
}