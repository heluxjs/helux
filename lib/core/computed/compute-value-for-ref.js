"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _pickDepFns = _interopRequireDefault(require("../base/pick-dep-fns"));

var _findDepFnsToExecute = _interopRequireDefault(require("../base/find-dep-fns-to-execute"));

var _constant = require("../../support/constant");

// stateModule表示状态所属的模块
function _default(ref, stateModule, oldState, deltaCommittedState, callInfo, isBeforeMount, mergeToDelta) {
  if (isBeforeMount === void 0) {
    isBeforeMount = false;
  }

  var refCtx = ref.ctx;
  if (!refCtx.hasComputedFn) return {
    hasDelta: false,
    newCommittedState: {}
  };
  var computedDep = refCtx.computedDep,
      refModule = refCtx.module,
      ccUniqueKey = refCtx.ccUniqueKey;
  var computedContainer = refCtx.refComputed; // if (stateModule !== refModule) {
  //   // 由changeRefState/broadcastState触发的connectedRefs 触发的计算
  //   computedContainer = refCtx.connectedComputed[stateModule];
  // }

  var newState = Object.assign({}, oldState, deltaCommittedState);

  var curDepComputedFns = function curDepComputedFns(committedState, isBeforeMount) {
    return (0, _pickDepFns["default"])(isBeforeMount, _constant.CATE_REF, _constant.FN_CU, computedDep, stateModule, oldState, committedState, ccUniqueKey);
  }; // 触发依赖stateKeys相关的computed函数


  return (0, _findDepFnsToExecute["default"])(ref, stateModule, refModule, oldState, curDepComputedFns, deltaCommittedState, newState, deltaCommittedState, callInfo, isBeforeMount, _constant.FN_CU, _constant.CATE_REF, computedContainer, mergeToDelta);
}