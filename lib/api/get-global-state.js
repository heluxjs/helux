"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _ccContext = _interopRequireDefault(require("../cc-context"));

var getGlobalState = _ccContext["default"].store.getGlobalState;
var _default = getGlobalState;
exports["default"] = _default;