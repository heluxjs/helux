"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var checker = _interopRequireWildcard(require("../checker"));

var util = _interopRequireWildcard(require("../../support/util"));

var _constant = require("../../support/constant");

var _configureDepFns = _interopRequireDefault(require("../base/configure-dep-fns"));

var _findDepFnsToExecute = _interopRequireDefault(require("../base/find-dep-fns-to-execute"));

var _pickDepFns = _interopRequireDefault(require("../base/pick-dep-fns"));

var isPlainJsonObject = util.isPlainJsonObject,
    safeGetObjectFromObject = util.safeGetObjectFromObject;
var callInfo = {
  payload: null,
  renderKey: '',
  delay: -1
};
/**
 * 设置watch值，过滤掉一些无效的key
 */

function _default(module, moduleWatch, append) {
  if (append === void 0) {
    append = false;
  }

  if (!isPlainJsonObject(moduleWatch)) {
    throw new Error("StartUpOption.watch." + module + "'s value is not a plain json object!");
  }

  checker.checkModuleName(module, false, "watch." + module + " is invalid");

  var rootWatchDep = _ccContext["default"].watch.getRootWatchDep();

  var rootWatchRaw = _ccContext["default"].watch.getRootWatchRaw();

  var rootComputedValue = _ccContext["default"].computed.getRootComputedValue();

  if (append) {
    var ori = rootWatchRaw[module];
    if (ori) Object.assign(ori, moduleWatch);else rootWatchRaw[module] = moduleWatch;
  } else {
    rootWatchRaw[module] = moduleWatch;
  }

  var getState = _ccContext["default"].store.getState;
  var moduleState = getState(module);
  (0, _configureDepFns["default"])(_constant.CATE_MODULE, {
    module: module,
    state: moduleState,
    dep: rootWatchDep
  }, moduleWatch);

  var d = _ccContext["default"].getDispatcher();

  var deltaCommittedState = Object.assign({}, moduleState);

  var curDepWatchFns = function curDepWatchFns(committedState, isFirstCall) {
    return (0, _pickDepFns["default"])(isFirstCall, _constant.CATE_MODULE, 'watch', rootWatchDep, module, moduleState, committedState);
  };

  var moduleComputedValue = safeGetObjectFromObject(rootComputedValue, module);
  (0, _findDepFnsToExecute["default"])(d && d.ctx, module, d && d.ctx.module, moduleState, curDepWatchFns, moduleState, moduleState, deltaCommittedState, callInfo, true, 'watch', _constant.CATE_MODULE, moduleComputedValue);
}