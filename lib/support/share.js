"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.strictWarning = strictWarning;

var _ccContext = _interopRequireDefault(require("../cc-context"));

function strictWarning(err) {
  if (_ccContext["default"].isStrict) {
    throw err;
  }

  console.error(' ------------ CC WARNING ------------');
  console.error(err);
}