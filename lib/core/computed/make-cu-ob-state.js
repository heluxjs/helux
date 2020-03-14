"use strict";

exports.__esModule = true;
exports["default"] = _default;

function _default(state, depKeys) {
  return new Proxy(state, {
    get: function get(target, key) {
      if (!depKeys.includes(key)) depKeys.push(key);
      return target[key];
    },
    set: function set(target, key) {
      target[key] = target[key];
      return true;
    }
  });
}