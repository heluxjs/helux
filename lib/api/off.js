"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var util = _interopRequireWildcard(require("../support/util"));

var _pickOneRef = _interopRequireDefault(require("../core/ref/pick-one-ref"));

function _default(event, option) {
  try {
    var ref = (0, _pickOneRef["default"])();
    ref.ctx.off(event, option);
  } catch (err) {
    if (option.throwError) throw err;else util.justWarning(err.message);
  }
}