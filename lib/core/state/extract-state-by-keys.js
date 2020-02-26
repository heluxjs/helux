"use strict";

exports.__esModule = true;
exports["default"] = _default;

var _util = require("../../support/util");

// set成功则返回true
function setPartialState(partialState, state, key) {
  var value = state[key];

  if (value !== undefined) {
    partialState[key] = value;
    return true;
  }

  return false;
}

function _default(state, stateKeys, returnNullIfEmpty, needIgnored) {
  if (stateKeys === void 0) {
    stateKeys = [];
  }

  if (returnNullIfEmpty === void 0) {
    returnNullIfEmpty = false;
  }

  if (needIgnored === void 0) {
    needIgnored = false;
  }

  var partialState = {},
      ignoredStateKeys = [];

  if (!(0, _util.isPJO)(state)) {
    return {
      partialState: returnNullIfEmpty ? null : partialState,
      isStateEmpty: true,
      ignoredStateKeys: ignoredStateKeys
    };
  }

  var isStateEmpty = true;
  var committedStateKeys = (0, _util.okeys)(state);

  if (committedStateKeys.length >= stateKeys.length) {
    stateKeys.forEach(function (key) {
      if (setPartialState(partialState, state, key)) isStateEmpty = false;
    });
    if (needIgnored) ignoredStateKeys = (0, _util.removeArrElements)(committedStateKeys, stateKeys);
  } else {
    committedStateKeys.forEach(function (key) {
      if (stateKeys.includes(key)) {
        if (setPartialState(partialState, state, key)) isStateEmpty = false;
      } else {
        if (needIgnored) ignoredStateKeys.push(key);
      }
    });
  }

  if (isStateEmpty && returnNullIfEmpty) partialState = null;
  return {
    partialState: partialState,
    isStateEmpty: isStateEmpty,
    ignoredStateKeys: ignoredStateKeys
  };
}