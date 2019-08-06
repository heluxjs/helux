"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _getState = _interopRequireDefault(require("./get-state"));

var _extractStateByCcsync2 = _interopRequireDefault(require("../core/state/extract-state-by-ccsync"));

function _default(moduledKeyPath, val) {
  if (!moduledKeyPath.includes('/')) {
    throw new Error("keyPath must start with module");
  }

  var _moduledKeyPath$split = moduledKeyPath.split('/'),
      targetModule = _moduledKeyPath$split[0];

  var fullState = (0, _getState["default"])(targetModule);

  var _extractStateByCcsync = (0, _extractStateByCcsync2["default"])(moduledKeyPath, val, false, fullState, false),
      state = _extractStateByCcsync.state;

  return state;
}