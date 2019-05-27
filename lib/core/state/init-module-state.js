"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _constant = require("../../support/constant");

var checker = _interopRequireWildcard(require("../checker"));

function _default(module, state, rootStateCanNotContainInputModule) {
  if (rootStateCanNotContainInputModule === void 0) {
    rootStateCanNotContainInputModule = true;
  }

  if (rootStateCanNotContainInputModule) checker.checkModuleNameAndState(module, state);else checker.checkModuleNameBasicallyAndState(module, state);

  var rootState = _ccContext["default"].store.getState();

  rootState[module] = state;
  _ccContext["default"].moduleName_stateKeys_[module] = Object.keys(state);

  if (module === _constant.MODULE_GLOBAL) {
    var globalStateKeys = _ccContext["default"].globalStateKeys;
    var keys = Object.keys();
    keys.forEach(function (key) {
      return globalStateKeys.push(key);
    });
  }
}