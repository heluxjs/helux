"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _pickOneRef = _interopRequireDefault(require("../core/ref/pick-one-ref"));

function _default(moduledKeyPath, val, delay, idt) {
  var dispatcher = (0, _pickOneRef["default"])();
  dispatcher.ctx.set(moduledKeyPath, val, delay, idt);
}