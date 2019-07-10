"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var checker = _interopRequireWildcard(require("../checker"));

var util = _interopRequireWildcard(require("../../support/util"));

var safeGetObjectFromObject = util.safeGetObjectFromObject,
    isPlainJsonObject = util.isPlainJsonObject,
    strictWarning = util.strictWarning;
/**
 * 设置watch值，过滤掉一些无效的key
 */

function _default(module, moduleWatch) {
  if (!isPlainJsonObject(moduleWatch)) {
    throw new Error("StartUpOption.watch." + module + "'s value is not a plain json object!");
  }

  checker.checkModuleName(module, false, "watch." + module + " is invalid");

  var rootWatch = _ccContext["default"].watch.getRootWatch();

  var getState = _ccContext["default"].store.getState;
  var watchStateKeys = Object.keys(moduleWatch);
  watchStateKeys.forEach(function (key) {
    var moduleState = getState(module);
    var originalValue = moduleState[key];

    if (originalValue !== undefined) {
      var fn = moduleWatch[key];

      if (typeof fn !== 'function') {
        throw new Error("watch." + module + "." + key + "'s value is not a function");
      }

      var ccModuleWatch = safeGetObjectFromObject(rootWatch, module);
      ccModuleWatch[key] = fn;
    } else {
      strictWarning("watch." + module + "'s key[" + key + "] is not declared in store." + module + "!");
    }
  });
}