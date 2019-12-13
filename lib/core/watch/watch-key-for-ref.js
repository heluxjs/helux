"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _pickDepFns2 = _interopRequireDefault(require("../base/pick-dep-fns"));

var _util = require("../../support/util");

function _default(refCtx, stateModule, oldState, committedState, callInfo, isBeforeMount) {
  if (!refCtx.hasWatchFn) return true;
  var watchDep = refCtx.watchDep,
      refModule = refCtx.module,
      ccUniqueKey = refCtx.ccUniqueKey;
  var shouldCurrentRefUpdate = true; // 触发有stateKey依赖列表相关的watch函数

  var _pickDepFns = (0, _pickDepFns2["default"])(isBeforeMount, 'ref', 'watch', watchDep, stateModule, oldState, committedState, ccUniqueKey),
      pickedFns = _pickDepFns.pickedFns,
      setted = _pickDepFns.setted,
      changed = _pickDepFns.changed;

  if (callInfo.noCW === false && pickedFns.length) {
    var newState = Object.assign({}, oldState, committedState);

    var _makeCommitHandler = (0, _util.makeCommitHandler)(stateModule, refCtx.changeState, callInfo),
        commit = _makeCommitHandler.commit,
        flush = _makeCommitHandler.flush;

    pickedFns.forEach(function (_ref) {
      var fn = _ref.fn,
          retKey = _ref.retKey,
          depKeys = _ref.depKeys;
      var fnCtx = {
        retKey: retKey,
        callInfo: callInfo,
        isFirstCall: isBeforeMount,
        commit: commit,
        setted: setted,
        changed: changed,
        stateModule: stateModule,
        refModule: refModule,
        oldState: oldState,
        committedState: committedState,
        refCtx: refCtx
      };
      var ret = (0, _util.executeCompOrWatch)(retKey, depKeys, fn, newState, oldState, fnCtx); //实例里只要有一个watch函数返回false，就会阻碍当前实例的ui被更新

      if (ret === false) shouldCurrentRefUpdate = false;
    });
    flush();
  }

  return shouldCurrentRefUpdate;
}