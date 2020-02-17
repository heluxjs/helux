"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _util = require("../../support/util");

var _statekeysMap = _interopRequireDefault(require("../../cc-context/statekeys-map"));

var _computedMap = _interopRequireDefault(require("../../cc-context/computed-map"));

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
  var stateKeys = _statekeysMap["default"][stateModule]; // commitCu提交的结果是存到moduleComputed里的，所以这里从_computedDep取retKey_fn_

  var _computedDep = _computedMap["default"].getRootComputedDep();

  var _computedValue = _computedMap["default"].getRootComputedValue();

  var moduleCuDep = _computedDep[stateModule];
  var moduleCuContainer = _computedValue[stateModule];

  var _loop = function _loop() {
    whileCount++; // 因为beforeMountFlag为true的情况下，finder里调用的pickDepFns会挑出所有函数，
    // 这里必需保证只有第一次循环的时候取isFirstCall的实际值，否则一定取false，（要不然就陷入无限死循环，每一次都是true，每一次都挑出所有dep函数执行）

    var beforeMountFlag = whileCount === 1 ? isFirstCall : false;

    var _finder = finder(initComputedState, beforeMountFlag),
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
          fn = _ref.fn;
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
      var computedValueOrRet = fn(initNewState, oldState, fnCtx);

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

    if (moduleCuDep && committedCu) {
      var _moduleCuDep$retKey_f = moduleCuDep.retKey_fn_,
          retKey_fn_ = _moduleCuDep$retKey_f === void 0 ? {} : _moduleCuDep$retKey_f;
      (0, _util.okeys)(committedCu).forEach(function (retKey) {
        if (!retKey_fn_[retKey]) (0, _util.justWarning)("fnCtx.commitCu commit an invalid retKey[" + retKey + "]");else setComputedVal(sourceType, refModule, stateModule, moduleCuContainer, refConnectedComputed, retKey, committedCu[retKey]);
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