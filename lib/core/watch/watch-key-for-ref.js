"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _pickDepFns = _interopRequireDefault(require("../base/pick-dep-fns"));

var _findDepFnsToExecute = _interopRequireDefault(require("../base/find-dep-fns-to-execute"));

var _constant = require("../../support/constant");

function _default(ref, stateModule, oldState, committedState, callInfo, isBeforeMount) {
  var refCtx = ref.ctx;
  if (!refCtx.hasWatchFn) return {
    shouldCurrentRefUpdate: true
  };
  var deltaCommittedState = Object.assign({}, committedState);
  var watchDep = refCtx.watchDep,
      refModule = refCtx.module,
      ccUniqueKey = refCtx.ccUniqueKey;
  var computedContainer = refCtx.refComputed;

  if (stateModule !== refModule) {
    // 由changeRefState/broadcastState触发的connectedRefs 触发的watch
    computedContainer = refCtx.connectedComputed[stateModule];
  }

  var newState = Object.assign({}, oldState, committedState);

  var curDepWatchFns = function curDepWatchFns(committedState, isBeforeMount) {
    return (0, _pickDepFns["default"])(isBeforeMount, _constant.CATE_REF, _constant.FN_WATCH, watchDep, stateModule, oldState, committedState, ccUniqueKey);
  }; // 触发有stateKey依赖列表相关的watch函数


  return (0, _findDepFnsToExecute["default"])(ref, stateModule, refModule, oldState, curDepWatchFns, committedState, newState, deltaCommittedState, callInfo, isBeforeMount, _constant.FN_WATCH, _constant.CATE_REF, computedContainer);
}