"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _setRef = require("./set-ref");

var _util = require("../../support/util");

var ccUKey_ref_ = _ccContext["default"].ccUKey_ref_,
    ccUKey_handlerKeys_ = _ccContext["default"].ccUKey_handlerKeys_,
    runtimeVar = _ccContext["default"].runtimeVar,
    handlerKey_handler_ = _ccContext["default"].handlerKey_handler_;

function _default(ccUniqueKey) {
  if (runtimeVar.isDebug) {
    console.log((0, _util.styleStr)(ccUniqueKey + " unset ref"), (0, _util.color)('purple'));
  }

  delete ccUKey_ref_[ccUniqueKey];
  if (_ccContext["default"].isHotReloadMode()) (0, _setRef.decCcKeyInsCount)(ccUniqueKey);
  var handlerKeys = ccUKey_handlerKeys_[ccUniqueKey];

  if (handlerKeys) {
    handlerKeys.forEach(function (hKey) {
      delete handlerKey_handler_[hKey];
    });
  }
}