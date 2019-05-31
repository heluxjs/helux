"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var checker = _interopRequireWildcard(require("../checker"));

var util = _interopRequireWildcard(require("../../support/util"));

function _default(module, reducer, rootReducerCanNotContainInputModule) {
  if (rootReducerCanNotContainInputModule === void 0) {
    rootReducerCanNotContainInputModule = true;
  }

  if (!reducer) return;
  if (rootReducerCanNotContainInputModule) checker.checkReducerModuleName(module);else checker.checkModuleNameBasically(module);
  var _ccContext$reducer = _ccContext["default"].reducer,
      _reducer = _ccContext$reducer._reducer,
      _reducerName_FullReducerNameList_ = _ccContext$reducer._reducerName_FullReducerNameList_;
  _reducer[module] = reducer;
  var reducerNames = util.okeys(reducer);
  reducerNames.forEach(function (name) {
    var list = util.safeGetArrayFromObject(_reducerName_FullReducerNameList_, name);
    list.push(module + "/" + name);
  });
}