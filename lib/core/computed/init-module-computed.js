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

var safeGetObjectFromObject = util.safeGetObjectFromObject,
    isPlainJsonObject = util.isPlainJsonObject;
var callInfo = {
  payload: null,
  renderKey: '',
  delay: -1
};

function _default(module, computed) {
  if (!computed) return;
  var tip = "module[" + module + "] computed";

  if (!isPlainJsonObject(computed)) {
    throw new Error(tip + " " + _privConstant.NOT_A_JSON);
  }

  checker.checkModuleName(module, false, tip + " is invalid");
  var ccComputed = _ccContext["default"].computed;

  var rootState = _ccContext["default"].store.getState();

  var rootComputedValue = ccComputed.getRootComputedValue();
  var rootComputedDep = ccComputed.getRootComputedDep();
  var rootComputedRaw = ccComputed.getRootComputedRaw();
  rootComputedRaw[module] = computed;
  var moduleState = rootState[module];
  (0, _configureDepFns["default"])(_constant.CATE_MODULE, {
    module: module,
    stateKeys: util.okeys(moduleState),
    dep: rootComputedDep
  }, computed);

  var d = _ccContext["default"].getDispatcher();

  var curDepComputedFns = function curDepComputedFns(committedState, isBeforeMount) {
    return (0, _pickDepFns["default"])(isBeforeMount, _constant.CATE_MODULE, 'computed', rootComputedDep, module, moduleState, committedState);
  };

  var deltaCommittedState = Object.assign({}, moduleState);
  var moduleComputedValue = safeGetObjectFromObject(rootComputedValue, module);
  (0, _findDepFnsToExecute["default"])(d && d.ctx, module, d && d.ctx.module, moduleState, curDepComputedFns, moduleState, moduleState, deltaCommittedState, callInfo, true, 'computed', _constant.CATE_MODULE, moduleComputedValue);
}