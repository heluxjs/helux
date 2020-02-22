"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var checker = _interopRequireWildcard(require("../checker"));

function _default(refPrivState, moduleStateKeys, ccOptionStoredKeys, registerStoredKeys) {
  var targetStoredKeys = ccOptionStoredKeys || registerStoredKeys;

  if (!targetStoredKeys) {
    return [];
  }

  if (targetStoredKeys === '*') {
    return Object.keys(refPrivState).filter(function (k) {
      return !moduleStateKeys.includes(k);
    });
  } else {
    checker.checkStoredKeys(moduleStateKeys, targetStoredKeys);
    return targetStoredKeys;
  }
}