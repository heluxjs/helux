"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _util = _interopRequireDefault(require("../../support/util"));

var _constant = require("../../support/constant");

var _setState = _interopRequireDefault(require("./set-state"));

var _getAndStoreValidGlobalState = _interopRequireDefault(require("./get-and-store-valid-global-state"));

var _extractStateByKeys2 = _interopRequireDefault(require("./extract-state-by-keys"));

function _default(module) {
  return function (state) {
    try {
      (0, _setState["default"])(module, state, 0, true);
    } catch (err) {
      if (module == _constant.MODULE_GLOBAL) {
        (0, _getAndStoreValidGlobalState["default"])(state, module);
      } else {
        var moduleState = _ccContext["default"].store.getState(module);

        if (!moduleState) {
          return _util["default"].justWarning("invalid module " + module);
        }

        var keys = Object.keys(moduleState);

        var _extractStateByKeys = (0, _extractStateByKeys2["default"])(state, keys),
            validModuleState = _extractStateByKeys.partialState,
            isStateEmpty = _extractStateByKeys.isStateEmpty;

        if (!isStateEmpty) _ccContext["default"].store.setState(module, validModuleState); //store this state;
      }

      _util["default"].justTip("no ccInstance found for module " + module + " currently, cc will just store it, lately ccInstance will pick this state to render");
    }
  };
}