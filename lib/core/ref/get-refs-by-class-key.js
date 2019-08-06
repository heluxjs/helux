"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var ccUkey_ref_ = _ccContext["default"].ccUkey_ref_,
    ccClassKey_ccClassContext_ = _ccContext["default"].ccClassKey_ccClassContext_;

function _default(ccClassKey) {
  var refs = [];
  var ccClassContext = ccClassKey_ccClassContext_[ccClassKey];

  if (!ccClassContext) {
    return refs;
  }

  var ccKeys = ccClassContext.ccKeys;
  ccKeys.forEach(function (k) {
    var ref = ccUkey_ref_[k];
    if (ref) refs.push(ref);
  });
  return refs;
}