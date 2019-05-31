"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _extractStateByKeys2 = _interopRequireDefault(require("./extract-state-by-keys"));

var _constant = require("../../support/constant");

var _util = require("../../support/util");

var ccStoreSetState = _ccContext["default"].store.setState;
var ccGlobalStateKeys = _ccContext["default"].globalStateKeys;
var tip = "note! you are trying set state for global module, but the state you commit include some invalid keys which is not declared in cc's global state, \ncc will ignore them, but if this result is not as you expected, please check your committed global state!";

function _default(globalState, tipModule, tipCcClassKey) {
  if (tipModule === void 0) {
    tipModule = '';
  }

  if (tipCcClassKey === void 0) {
    tipCcClassKey = '';
  }

  var _extractStateByKeys = (0, _extractStateByKeys2["default"])(globalState, ccGlobalStateKeys),
      validGlobalState = _extractStateByKeys.partialState,
      isStateEmpty = _extractStateByKeys.isStateEmpty;

  var vKeys = (0, _util.okeys)(validGlobalState);
  var allKeys = (0, _util.okeys)(globalState);

  if (vKeys.length < allKeys.length) {
    //??? need strict?
    var invalidKeys = allKeys.filter(function (k) {
      return !vKeys.includes(k);
    });
    (0, _util.justWarning)(tip + ',invalid keys: ' + invalidKeys.join(',') + ', make sure the keys is invalid and their values are not undefined');
    console.log(globalState);
    if (tipModule) (0, _util.justWarning)('module is ' + tipModule);
    if (tipCcClassKey) (0, _util.justWarning)('ccClassKey is ' + tipCcClassKey);
  }

  ccStoreSetState(_constant.MODULE_GLOBAL, validGlobalState);
  return {
    partialState: validGlobalState,
    isStateEmpty: isStateEmpty
  };
}