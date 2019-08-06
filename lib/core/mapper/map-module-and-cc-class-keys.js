"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _util = _interopRequireDefault(require("../../support/util"));

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var moduleName_ccClassKeys_ = _ccContext["default"].moduleName_ccClassKeys_,
    moduleSingleClass = _ccContext["default"].moduleSingleClass;

function _default(moduleName, ccClassKey) {
  var ccClassKeys = _util["default"].safeGetArrayFromObject(moduleName_ccClassKeys_, moduleName);

  if (moduleSingleClass[moduleName] === true && ccClassKeys.length >= 1) {
    throw new Error("module[" + moduleName + "] is declared as single, only on ccClassKey can been registered to it, and now a ccClassKey[" + ccClassKeys[0] + "] has been registered!");
  }

  if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey);
}