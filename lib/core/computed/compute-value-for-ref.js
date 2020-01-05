"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _pickDepFns = _interopRequireDefault(require("../base/pick-dep-fns"));

var _findDepFnsToExecute = _interopRequireDefault(require("../base/find-dep-fns-to-execute"));

var _constant = require("../../support/constant");

//CcFragment实例调用会提供callerCtx
// stateModule表示状态所属的模块
function _default(refCtx, stateModule, oldState, committedState, callInfo, isBeforeMount, autoMergeDeltaToCommitted) {
  if (isBeforeMount === void 0) {
    isBeforeMount = false;
  }

  if (autoMergeDeltaToCommitted === void 0) {
    autoMergeDeltaToCommitted = false;
  }

  var deltaCommittedState = Object.assign({}, committedState);
  if (!refCtx.hasComputedFn) return deltaCommittedState;
  var computedDep = refCtx.computedDep,
      refModule = refCtx.module,
      refComputed = refCtx.refComputed,
      refConnectedComputed = refCtx.refConnectedComputed,
      ccUniqueKey = refCtx.ccUniqueKey; // const moduleState = ccContext.store.getState(stateModule);

  var newState = Object.assign({}, oldState, committedState);

  var curDepComputedFns = function curDepComputedFns(committedState, isBeforeMount) {
    return (0, _pickDepFns["default"])(isBeforeMount, _constant.CATE_REF, 'computed', computedDep, stateModule, oldState, committedState, ccUniqueKey);
  }; // 触发依赖stateKeys相关的computed函数


  (0, _findDepFnsToExecute["default"])(refCtx, stateModule, refModule, oldState, curDepComputedFns, committedState, newState, deltaCommittedState, callInfo, isBeforeMount, 'computed', _constant.CATE_REF, refComputed, refConnectedComputed);

  if (autoMergeDeltaToCommitted) {
    Object.assign(committedState, deltaCommittedState);
  }

  return deltaCommittedState;
}