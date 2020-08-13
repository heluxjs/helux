"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _pickDepFns = _interopRequireDefault(require("../base/pick-dep-fns"));

var _findDepFnsToExecute2 = _interopRequireDefault(require("../base/find-dep-fns-to-execute"));

var _constant = require("../../support/constant");

// deltaCommittedState 是computed透传的变量引用，用于继续收集可能新增或者更新的状态
function _default(ref, stateModule, oldState, deltaCommittedState, callInfo, isBeforeMount, mergeToDelta) {
  if (isBeforeMount === void 0) {
    isBeforeMount = false;
  }

  var refCtx = ref.ctx;
  if (!refCtx.hasWatchFn) return {
    hasDelta: false,
    newCommittedState: {}
  };
  var newState = Object.assign({}, oldState, deltaCommittedState);
  var watchDep = refCtx.watchDep,
      refModule = refCtx.module,
      ccUniqueKey = refCtx.ccUniqueKey;
  var computedContainer = refCtx.refComputed; // if (stateModule !== refModule) {
  //   // 由changeRefState/broadcastState触发的connectedRefs 触发的watch
  //   computedContainer = refCtx.connectedComputed[stateModule];
  // }

  var curDepWatchFns = function curDepWatchFns(committedState, isBeforeMount) {
    return (0, _pickDepFns["default"])(isBeforeMount, _constant.CATE_REF, _constant.FN_WATCH, watchDep, stateModule, oldState, committedState, ccUniqueKey);
  }; // 触发有stateKey依赖列表相关的watch函数


  var _findDepFnsToExecute = (0, _findDepFnsToExecute2["default"])(ref, stateModule, refModule, oldState, curDepWatchFns, deltaCommittedState, newState, deltaCommittedState, callInfo, isBeforeMount, _constant.FN_WATCH, _constant.CATE_REF, computedContainer, mergeToDelta),
      hasDelta = _findDepFnsToExecute.hasDelta;

  return {
    hasDelta: hasDelta
  };
}