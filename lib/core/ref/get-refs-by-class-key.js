"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _util = require("../../support/util");

/** @typedef {import('../../types').ICtxBase} ICtxBase */
var ccUKey_ref_ = _ccContext["default"].ccUKey_ref_;

function _default(ccClassKey) {
  var refs = [];
  var ukeys = (0, _util.okeys)(ccUKey_ref_);
  var len = ukeys.length;

  for (var i = 0; i < len; i++) {
    /** @type {{ctx:ICtxBase}} */
    var ref = ccUKey_ref_[ukeys[i]];

    if (ref.ctx.ccClassKey === ccClassKey) {
      refs.push(ref);
    }
  }

  return refs;
}