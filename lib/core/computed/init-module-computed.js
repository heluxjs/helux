"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var checker = _interopRequireWildcard(require("../checker"));

var util = _interopRequireWildcard(require("../../support/util"));

var safeGetObjectFromObject = util.safeGetObjectFromObject,
    isPlainJsonObject = util.isPlainJsonObject;

function _default(module, computed) {
  if (!isPlainJsonObject(computed)) {
    throw new Error("StartUpOption.computed." + module + "'s value is not a plain json object!");
  }

  checker.checkModuleName(module, false, "computed." + module + " is invalid");

  var rootState = _ccContext["default"].store.getState();

  var rootComputedValue = _ccContext["default"].computed.getRootComputedValue();

  var rootComputedFn = _ccContext["default"].computed.getRootComputedFn();

  var moduleState = rootState[module];
  var stateKeys = Object.keys(computed);
  stateKeys.forEach(function (key) {
    var originalValue = moduleState[key];

    if (originalValue !== undefined) {
      var moduleComputedFn = safeGetObjectFromObject(rootComputedFn, module);
      var fn = computed[key];
      moduleComputedFn[key] = fn;
      var computedValue = fn(originalValue, originalValue, moduleState);
      var moduleComputedValue = safeGetObjectFromObject(rootComputedValue, module);
      moduleComputedValue[key] = computedValue;
    } else {
      //strict?
      justWarning("computed." + module + "'s key[" + key + "] is not declared in store." + module + "'s state!");
    }
  });
}