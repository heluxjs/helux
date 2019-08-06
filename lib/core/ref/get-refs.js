"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var util = _interopRequireWildcard(require("../../support/util"));

function _default() {
  var refs = [];
  var ccUkey_ref_ = _ccContext["default"].ccUkey_ref_;
  var ccKeys = util.okeys(ccUkey_ref_);
  ccKeys.forEach(function (k) {
    var ref = ccUkey_ref_[k];
    if (ref) refs.push(ref);
  });
  return refs;
}