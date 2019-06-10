"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _ccContext = _interopRequireDefault(require("../cc-context"));

var ccClassKey_ccClassContext_ = _ccContext["default"].ccClassKey_ccClassContext_;

var _default = function _default(ccClassKey) {
  var ctx = ccClassKey_ccClassContext_[ccClassKey];
  return ctx.connectedState || {};
};

exports["default"] = _default;