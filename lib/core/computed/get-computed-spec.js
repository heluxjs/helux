"use strict";

exports.__esModule = true;
exports["default"] = _default;

function _default(computedFns, module) {
  var hasFn = Object.keys(computedFns).length > 0;
  return {
    computedFns: computedFns,
    module: module,
    hasFn: hasFn
  };
}