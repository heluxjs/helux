"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var util = _interopRequireWildcard(require("../../support/util"));

function _default(connectedState, module, key, value) {
  var moduleConnState = util.safeGetObject(connectedState, module);
  moduleConnState[key] = value;
}