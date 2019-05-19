"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _util = _interopRequireDefault(require("../../support/util"));

var _constant = require("../../support/constant");

function _default(moduleState, moduleName) {
  if (!_util["default"].isModuleStateValid(moduleState)) {
    throw _util["default"].makeError(_constant.ERR.CC_STORE_STATE_INVALID, _util["default"].verboseInfo("module[" + moduleName + "]'s state is invalid!"));
  }
}