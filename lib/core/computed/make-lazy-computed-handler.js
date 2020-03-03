"use strict";

exports.__esModule = true;
exports["default"] = _default;
exports.CLEAR = void 0;
var CLEAR = Symbol('clear');
exports.CLEAR = CLEAR;

function _default(fn, newState, oldState, fnCtx) {
  var _needCompute = true;
  var _cachedRet = null;
  var _fn = fn;
  var _newState = newState;
  var _oldState = oldState;
  var _fnCtx = fnCtx;
  return function (cmd, newState, oldState, fnCtx) {
    if (cmd === CLEAR) {
      // can only been called by cc
      _newState = newState;
      _oldState = oldState;
      _fnCtx = fnCtx;
      _needCompute = true;
      return;
    }

    if (_needCompute) {
      var ret = _fn(_newState, _oldState, _fnCtx);

      _cachedRet = ret;
      _needCompute = false;
    }

    return _cachedRet;
  };
}