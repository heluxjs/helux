"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.executeCuOrWatch = executeCuOrWatch;
exports["default"] = void 0;

var _util = require("../../support/util");

var _extractStateByKeys2 = _interopRequireDefault(require("../state/extract-state-by-keys"));

var _computedMap = _interopRequireDefault(require("../../cc-context/computed-map"));

var _statekeysMap = _interopRequireDefault(require("../../cc-context/statekeys-map"));

var _runtimeVar = _interopRequireDefault(require("../../cc-context/runtime-var"));

function executeCuOrWatch(retKey, depKeys, fn, newState, oldState, fnCtx) {
  var computedValue;

  if (_runtimeVar["default"].alwaysGiveState) {
    computedValue = fn(newState, oldState, fnCtx);
  } else {
    var firstDepKey = depKeys[0];

    if (depKeys.length === 1 && firstDepKey !== '*' && firstDepKey === retKey) {
      computedValue = fn(newState[firstDepKey], oldState[firstDepKey], fnCtx);
    } else {
      computedValue = fn(newState, oldState, fnCtx);
    }
  }

  return computedValue;
} // fnType: computed watch
// sourceType: module ref


var _default = function _default(refCtx, stateModule, refModule, oldState, finder, toComputedState, initNewState, initDeltaCommittedState, callInfo, isFirstCall, fnType, sourceType, computedContainer) {
  var whileCount = 0;
  var initComputedState = toComputedState;
  var shouldCurrentRefUpdate = true;

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
      var computedValueOrRet = executeCuOrWatch(retKey, depKeys, fn, initNewState, oldState, fnCtx);

      if (fnType === 'computed') {
        computedContainer[retKey] = computedValueOrRet;
      } else {
        // watch
        //实例里只要有一个watch函数返回false，就会阻碍当前实例的ui被更新
        if (computedValueOrRet === false) shouldCurrentRefUpdate = false;
      }
    });
    initComputedState = getFnCommittedState();

    if (initComputedState) {
      // !!!确保实例里调用commit只能提交privState片段，模块里调用commit只能提交moduleState片段
      var stateKeys = sourceType === 'ref' ? refCtx.privStateKeys : _statekeysMap["default"][stateModule];

      var _extractStateByKeys = (0, _extractStateByKeys2["default"])(initComputedState, stateKeys, true, true),
          partialState = _extractStateByKeys.partialState,
          ignoredStateKeys = _extractStateByKeys.ignoredStateKeys;

      if (partialState) {
        initComputedState = partialState;
        Object.assign(initNewState, initComputedState);
        Object.assign(initDeltaCommittedState, initComputedState);
      }

      if (ignoredStateKeys.length) {
        (0, _util.justWarning)("these state keys were ignored " + ignoredStateKeys.join(','));
      }
    } // computedContainer对于模块里的computed回调里调用committedCu，是moduleComputed结果容器，
    // 对于实例里的computed回调里调用committedCu来说，是refComputed结果容器


    var committedCu = getFinalCu();

    if (committedCu) {
      var retKey_fn_;

      if (sourceType === 'ref') {
        retKey_fn_ = fnType === 'computed' ? refCtx.computedRetKeyFns : refCtx.watchRetKeyFns;
      } else {
        // commitCu提交的结果是存到moduleComputed里的，所以这里从始终从_computedDep 取retKey_fn_，来判断commitCu提交的retKey是否合法
        var moduleDep = _computedMap["default"].getRootComputedDep()[stateModule] || {};
        retKey_fn_ = moduleDep.retKey_fn_ || null;
      }

      if (retKey_fn_) {
        (0, _util.okeys)(committedCu).forEach(function (retKey) {
          if (!retKey_fn_[retKey]) (0, _util.justWarning)("fnCtx.commitCu commit an invalid retKey[" + retKey + "] for moduleComputed");else computedContainer[retKey] = committedCu[retKey];
        });
      }
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