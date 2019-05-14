"use strict";

exports.__esModule = true;
exports["default"] = _default;

var _util = require("../../support/util");

function _default(state, stateKeys, returnNullIfEmpty) {
  if (returnNullIfEmpty === void 0) {
    returnNullIfEmpty = false;
  }

  var partialState = {};

  if (!(0, _util.isStateValid)(state) || !(0, _util.isObjectNotNull)(state)) {
    return {
      partialState: returnNullIfEmpty ? null : partialState,
      isStateEmpty: true
    };
  }

  var isStateEmpty = true;
  stateKeys.forEach(function (key) {
    var value = state[key];

    if (value !== undefined) {
      partialState[key] = value;
      isStateEmpty = false;
    }
  });
  return {
    partialState: partialState,
    isStateEmpty: isStateEmpty
  };
}