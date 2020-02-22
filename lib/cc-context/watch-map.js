"use strict";

exports.__esModule = true;
exports["default"] = void 0;

/** watch section */
var _watchDep = {};
var _watchRaw = {};
var watch = {
  _watchRaw: _watchRaw,
  _watchDep: _watchDep,
  getRootWatchDep: function getRootWatchDep() {
    return _watchDep;
  },
  getRootWatchRaw: function getRootWatchRaw() {
    return _watchRaw;
  }
};
var _default = watch;
exports["default"] = _default;