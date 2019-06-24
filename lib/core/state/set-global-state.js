"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _util = _interopRequireDefault(require("../../support/util"));

var _pickOneRef = _interopRequireDefault(require("../ref/pick-one-ref"));

/****
 * if you are sure the input state is really belong to global state, call cc.setGlobalState,
 * note! cc will filter the input state to meet global state shape and only pass the filtered state to global module
 */
function _default(state, delayMs, throwError) {
  if (delayMs === void 0) {
    delayMs = -1;
  }

  if (throwError === void 0) {
    throwError = false;
  }

  try {
    var ref = (0, _pickOneRef["default"])();
    ref.setGlobalState(state, delayMs);
  } catch (err) {
    if (throwError) throw err;else _util["default"].justWarning(err.message);
  }
}