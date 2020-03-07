"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _constant = require("../../support/constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var util = _interopRequireWildcard(require("../../support/util"));

var ccUKey_ref_ = _ccContext["default"].ccUKey_ref_;

function _default() {
  var ref = ccUKey_ref_[_constant.CC_DISPATCHER];

  if (!ref) {
    if (_ccContext["default"].isHotReloadMode()) {
      util.justTip('in hot reload mode, CC_DISPATCHER initialized more than one time');
    } else {
      throw new Error('CcDispatcher not found');
    }
  }

  return ref;
}