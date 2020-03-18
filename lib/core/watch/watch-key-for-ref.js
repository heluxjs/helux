"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _pickDepFns = _interopRequireDefault(require("../base/pick-dep-fns"));

var _findDepFnsToExecute2 = _interopRequireDefault(require("../base/find-dep-fns-to-execute"));

var _constant = require("../../support/constant");

function _default(ref, stateModule, oldState, committedState, callInfo, isBeforeMount, autoMergeDeltaToCommitted) {
  if (autoMergeDeltaToCommitted === void 0) {
    autoMergeDeltaToCommitted = false;
  }

  var refCtx = ref.ctx;
  if (!refCtx.hasWatchFn) return true;
  var deltaCommittedState = Object.assign({}, committedState);
  var watchDep = refCtx.watchDep,
      refModule = refCtx.module,
      ccUniqueKey = refCtx.ccUniqueKey,
      refComputed = refCtx.refComputed;
  var newState = Object.assign({}, oldState, committedState);

  var curDepComputedFns = function curDepComputedFns(committedState, isBeforeMount) {
    return (0, _pickDepFns["default"])(isBeforeMount, 'ref', 'watch', watchDep, stateModule, oldState, committedState, ccUniqueKey);
  }; // 触发有stateKey依赖列表相关的watch函数


  var _findDepFnsToExecute = (0, _findDepFnsToExecute2["default"])(ref, stateModule, refModule, oldState, curDepComputedFns, committedState, newState, deltaCommittedState, callInfo, isBeforeMount, 'watch', _constant.CATE_REF, refComputed),
      shouldCurrentRefUpdate = _findDepFnsToExecute.shouldCurrentRefUpdate,
      hasDelta = _findDepFnsToExecute.hasDelta;

  if (autoMergeDeltaToCommitted && hasDelta) {
    Object.assign(committedState, deltaCommittedState);
  }

  return shouldCurrentRefUpdate;
}