"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _ccContext = _interopRequireDefault(require("../cc-context"));

var getState = _ccContext.default.store.getState;
var _default = getState;
exports.default = _default;