"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var checker = _interopRequireWildcard(require("../checker"));

function _default(module, reducer, rootReducerCanNotContainInputModule) {
  if (rootReducerCanNotContainInputModule === void 0) {
    rootReducerCanNotContainInputModule = true;
  }

  if (!reducer) return;
  if (rootReducerCanNotContainInputModule) checker.checkReducerModuleName(module);else checker.checkModuleNameBasically(module);
  var _reducer = _ccContext["default"].reducer._reducer;
  _reducer[module] = reducer;
}