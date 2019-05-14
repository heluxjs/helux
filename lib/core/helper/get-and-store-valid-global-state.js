"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _extractStateByKeys2 = _interopRequireDefault(require("./extract-state-by-keys"));

var _constant = require("../../support/constant");

var _util = require("../../support/util");

var ccStoreSetState = _ccContext.default.store.setState;
var ccGlobalStateKeys = _ccContext.default.globalStateKeys;
var tip = "note! you are trying set state for global module, but the state you commit include some invalid keys which is not declared in cc's global state, \ncc will ignore them, but if this result is not as you expected, please check your committed global state!";

function _default(globalState) {
  var _extractStateByKeys = (0, _extractStateByKeys2.default)(globalState, ccGlobalStateKeys),
      validGlobalState = _extractStateByKeys.partialState,
      isStateEmpty = _extractStateByKeys.isStateEmpty;

  if (Object.keys(validGlobalState) < Object.keys(globalState)) {
    (0, _util.justWarning)(tip);
  }

  ccStoreSetState(_constant.MODULE_GLOBAL, validGlobalState);
  return {
    partialState: validGlobalState,
    isStateEmpty: isStateEmpty
  };
}