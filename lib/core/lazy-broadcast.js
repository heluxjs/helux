"use strict";

exports.__esModule = true;
exports.LazyBroadcast = LazyBroadcast;
exports.default = void 0;

function LazyBroadcast(module, lazyMs) {
  this.module = module;
  this.lazyMs = lazyMs;
}

var _default = function _default(module, lazyMs) {
  return new LazyBroadcast(module, lazyMs);
};

exports.default = _default;