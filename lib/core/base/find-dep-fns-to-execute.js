"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _util = require("../../support/util");

function setComputedVal(sourceType, refModule, stateModule, computedContainer, refConnectedComputed, retKey, computedValueOrRet) {
  if (sourceType === 'ref') {
    if (refModule === stateModule) {
      computedContainer[retKey] = computedValueOrRet;
    } // 意味着用户必须将组建connect到此模块，computed&watch里模块定义才有效果


    var targetComputed = refConnectedComputed[stateModule];

    if (targetComputed) {
      targetComputed[retKey] = computedValueOrRet;
    }
  } else {
    computedContainer[retKey] = computedValueOrRet;
  }
}

var _default = function _default(refCtx, stateModule, refModule, oldState, finder, toComputedState, initNewState, initDeltaCommittedState, callInfo, isFirstCall, fnType, sourceType, computedContainer, refConnectedComputed) {
  var whileCount = 0;
  var initComputedState = toComputedState;
  var shouldCurrentRefUpdate = true;

  var _loop = function _loop() {
    whileCount++; // 因为beforeMountFlag为true的情况下，finder里调用的pickDepFns会挑出所有函数，
    // 这里必需保证只有第一次循环的时候取isFirstCall的实际值，否则一定取false，（要不然就陷入无限死循环，每一次都是true，每一次都挑出所有dep函数执行）

    var beforeMountFlag = whileCount === 1 ? isFirstCall : false;

    var _finder = finder(initComputedState, beforeMountFlag),
        retKey_fn_ = _finder.retKey_fn_,
        pickedFns = _finder.pickedFns,
        setted = _finder.setted,
        changed = _finder.changed;

    if (!pickedFns.length) return "break";

    var _makeCommitHandler = (0, _util.makeCommitHandler)(),
        commit = _makeCommitHandler.commit,
        getFnCommittedState = _makeCommitHandler.getFnCommittedState;

    var _makeCommitHandler2 = (0, _util.makeCommitHandler)(),
        commitCu = _makeCommitHandler2.commit,
        getFinalCu = _makeCommitHandler2.getFnCommittedState;

    pickedFns.forEach(function (_ref) {
      var retKey = _ref.retKey,
          fn = _ref.fn,
          depKeys = _ref.depKeys;
      var fnCtx = {
        retKey: retKey,
        callInfo: callInfo,
        isFirstCall: isFirstCall,
        commit: commit,
        commitCu: commitCu,
        setted: setted,
        changed: changed,
        stateModule: stateModule,
        refModule: refModule,
        oldState: oldState,
        committedState: initComputedState,
        refCtx: refCtx
      };
      var computedValueOrRet = (0, _util.executeCompOrWatch)(retKey, depKeys, fn, initNewState, oldState, fnCtx);

      if (fnType === 'computed') {
        setComputedVal(sourceType, refModule, stateModule, computedContainer, refConnectedComputed, retKey, computedValueOrRet);
      } else {
        // watch
        //实例里只要有一个watch函数返回false，就会阻碍当前实例的ui被更新
        if (computedValueOrRet === false) shouldCurrentRefUpdate = false;
      }
    });
    initComputedState = getFnCommittedState();

    if (initComputedState) {
      Object.assign(initNewState, initComputedState);
      Object.assign(initDeltaCommittedState, initComputedState);
    }

    var committedCu = getFinalCu();

    if (committedCu) {
      (0, _util.okeys)(committedCu).forEach(function (retKey) {
        if (!retKey_fn_[retKey]) throw new Error("fnCtx.commitCu commit an invalid retKey[" + retKey + "]");
        setComputedVal(sourceType, refModule, stateModule, computedContainer, refConnectedComputed, retKey, committedCu[retKey]);
      });
    }

    if (whileCount > 10) throw new Error('fnCtx.commit may goes endless loop, please check your code');
  };

  while (initComputedState) {
    var _ret = _loop();

    if (_ret === "break") break;
  }

  return shouldCurrentRefUpdate;
};

exports["default"] = _default;