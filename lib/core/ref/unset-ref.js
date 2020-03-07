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
    module_ccUKeys_ = _ccContext["default"].module_ccUKeys_,
    ccClassKey_ccClassContext_ = _ccContext["default"].ccClassKey_ccClassContext_,
    handlerKey_handler_ = _ccContext["default"].handlerKey_handler_;

function updateModuleCcUKeys(module, ccUniqueKey) {
  var uKeys = module_ccUKeys_[module];
  uKeys.ver++;
  var idx = uKeys.keys.indexOf(ccUniqueKey);
  if (idx > 0) uKeys.keys.splice(idx, 1);
}

function _default(ccClassKey, ccUniqueKey) {
  if (runtimeVar.isDebug) {
    console.log((0, _util.styleStr)(ccUniqueKey + " unset ref"), (0, _util.color)('purple'));
  }

  var ref = ccUKey_ref_[ccUniqueKey];

  if (ref) {
    // start update module_ccUKeys_ mapping
    var _ref$ctx = ref.ctx,
        module = _ref$ctx.module,
        connect = _ref$ctx.connect;
    updateModuleCcUKeys(module, ccUniqueKey);
    (0, _util.okeys)(connect).forEach(function (m) {
      return updateModuleCcUKeys(m, ccUniqueKey);
    });
  }

  delete ccUKey_ref_[ccUniqueKey];
  var classContext = ccClassKey_ccClassContext_[ccClassKey];
  var ccKeys = classContext.ccKeys;
  var ccKeyIdx = ccKeys.indexOf(ccUniqueKey);
  if (ccKeyIdx >= 0) ccKeys.splice(ccKeyIdx, 1);
  (0, _setRef.decCcKeyInsCount)(ccUniqueKey);
  var handlerKeys = ccUKey_handlerKeys_[ccUniqueKey];

  if (handlerKeys) {
    handlerKeys.forEach(function (hKey) {
      delete handlerKey_handler_[hKey];
    });
  }
}