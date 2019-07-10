"use strict";

exports.__esModule = true;
exports["default"] = _default;

function _default(computed, ctx, module) {
  var computedFns;
  var computedType = typeof computed;
  if (computedType === 'function') computedFns = computed(ctx);else if (computedType === 'object' && !Array.isArray(computed)) computedFns = computed;else throw new Error('computed type can only be a function or a plain json object');
  return {
    computedFns: computedFns,
    module: module
  };
}