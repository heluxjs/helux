"use strict";

exports.__esModule = true;
exports["default"] = _default;

function _default(watchFns, immediateWatchKeys) {
  if (immediateWatchKeys === void 0) {
    immediateWatchKeys = [];
  }

  var hasFn = Object.keys(watchFns).length > 0;
  return {
    watchFns: watchFns,
    immediateWatchKeys: immediateWatchKeys,
    hasFn: hasFn
  };
}