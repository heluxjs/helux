"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _util = _interopRequireDefault(require("../../support/util"));

function _default(connectedState, module, key, value) {
  var moduleConnState = _util["default"].safeGetObjectFromObject(connectedState, module);

  moduleConnState[key] = value;
}