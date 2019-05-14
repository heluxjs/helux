"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = _default;

var _util = _interopRequireDefault(require("../support/util"));

var _constant = require("../support/constant");

var _ccContext = _interopRequireDefault(require("../cc-context"));

var helper = _interopRequireWildcard(require("./helper"));

function _default(module, state, throwError) {
  if (throwError === void 0) {
    throwError = false;
  }

  try {
    var ref = helper.pickOneRef(module);
    ref.setState(state, _constant.BROADCAST_TRIGGERED_BY_CC_API_SET_STATE);
  } catch (err) {
    if (throwError) throw err;else _util.default.justWarning(err.message);
  }
}