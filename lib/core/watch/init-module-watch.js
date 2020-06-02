"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var checker = _interopRequireWildcard(require("../checker"));

var util = _interopRequireWildcard(require("../../support/util"));

var _privConstant = require("../../support/priv-constant");

var _constant = require("../../support/constant");

var _configureDepFns = _interopRequireDefault(require("../base/configure-dep-fns"));

var _findDepFnsToExecute = _interopRequireDefault(require("../base/find-dep-fns-to-execute"));

var _pickDepFns = _interopRequireDefault(require("../base/pick-dep-fns"));

var isPJO = util.isPJO,
    safeGet = util.safeGet,
    okeys = util.okeys;
/**
 * 设置watch值，过滤掉一些无效的key
 */

function _default(module, moduleWatch, append) {
  if (append === void 0) {
    append = false;
  }

  if (!moduleWatch) return;
  var tip = "module[" + module + "] watch";

  if (!isPJO(moduleWatch)) {
    throw new Error(tip + " " + _privConstant.NOT_A_JSON);
  }

  checker.checkModuleName(module, false, tip + " is invalid");

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
    stateKeys: okeys(moduleState),
    dep: rootWatchDep
  }, moduleWatch);

  var d = _ccContext["default"].getDispatcher();

  var curDepWatchFns = function curDepWatchFns(committedState, isFirstCall) {
    return (0, _pickDepFns["default"])(isFirstCall, _constant.CATE_MODULE, _constant.FN_WATCH, rootWatchDep, module, moduleState, committedState);
  };

  var moduleComputedValue = safeGet(rootComputedValue, module);
  (0, _findDepFnsToExecute["default"])(d, module, d && d.ctx.module, moduleState, curDepWatchFns, moduleState, moduleState, moduleState, util.makeCallInfo(module), true, _constant.FN_WATCH, _constant.CATE_MODULE, moduleComputedValue);
}