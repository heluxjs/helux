"use strict";

exports.__esModule = true;
exports["default"] = _default;

var _privConstant = require("../../support/priv-constant");

var _util = require("../../support/util");

function _default(ref, state, module) {
  return new Proxy(state, {
    get: function get(target, key) {
      var refCtx = ref.ctx;

      if (refCtx.__$$renderStatus === _privConstant.START) {
        if (module) {
          refCtx.__$$collectingModuleWatchedKeys_[module][key] = 1;
        } else {
          if (!refCtx.privStateKeys.includes(key)) {
            refCtx.__$$collectingWatchedKeys_[key] = 1;
          }
        }
      }

      return target[key];
    },
    set: function set(target, key) {
      (0, _util.justWarning)("warnning: state can not been changed manually, use api setState or dispatch instead");
      target[key] = target[key]; // avoid Uncaught TypeError: 'set' on proxy: trap returned falsish for property '***'

      return true;
    }
  });
}