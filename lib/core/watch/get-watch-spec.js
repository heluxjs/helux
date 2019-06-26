"use strict";

exports.__esModule = true;
exports["default"] = _default;

function _default(watch, ctx, module) {
  var watchFns;
  var watchType = typeof watch;
  if (watchType === 'function') watchFns = watch(ctx);else if (watchType === 'object' && !Array.isArray(watch)) watchFns = watch;else throw new Error('watch type can only be a function or a plain json object');
  return {
    watchFns: watchFns,
    module: module
  };
}