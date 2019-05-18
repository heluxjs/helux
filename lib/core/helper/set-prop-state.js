"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _util = _interopRequireDefault(require("../../support/util"));

function _default(propState, module, key, value) {
  var modulePropState = _util["default"].safeGetObjectFromObject(propState, module);

  modulePropState[key] = value;
}