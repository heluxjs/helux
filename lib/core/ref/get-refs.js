"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var util = _interopRequireWildcard(require("../../support/util"));

function _default() {
  var refs = [];
  var ccUKey_ref_ = _ccContext["default"].ccUKey_ref_;
  var ccKeys = util.okeys(ccUKey_ref_);
  ccKeys.forEach(function (k) {
    var ref = ccUKey_ref_[k];
    if (ref && !ref.__$$isUnmounted) refs.push(ref);
  });
  return refs;
}