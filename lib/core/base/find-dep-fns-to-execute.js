"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _util = require("../../support/util");

var _constant = require("../../support/constant");

var _extractStateByKeys2 = _interopRequireDefault(require("../state/extract-state-by-keys"));

var _makeCuObState = _interopRequireDefault(require("../computed/make-cu-ob-state"));

var _computedMap = _interopRequireDefault(require("../../cc-context/computed-map"));

var _statekeysMap = _interopRequireDefault(require("../../cc-context/statekeys-map"));

var _runtimeVar = _interopRequireDefault(require("../../cc-context/runtime-var"));

function getCuWaParams(retKey, depKeys, newState, oldState) {
  if (_runtimeVar["default"].alwaysGiveState) {
    return [newState, oldState];
  } else {
    var firstDepKey = depKeys[0];

    if (depKeys.length === 1 && firstDepKey !== '*' && firstDepKey === retKey) {
      return [newState[firstDepKey], oldState[firstDepKey]];
    } else {
      return [newState, oldState];
    }
  }
}

function getStateKeyRetKeysMap(refCtx, sourceType, stateModule) {
  var modDep;

  if (sourceType === _constant.CATE_REF) {
    modDep = refCtx.computedDep[refCtx.module] || {};
  } else {
    modDep = _computedMap["default"]._computedDep[stateModule] || {};
  }

  return modDep.stateKey_retKeys_;
}

function setStateKeyRetKeysMap(refCtx, sourceType, stateModule, retKey, depKeys) {
  if (depKeys.length === 0) return;
  var modDep;

  if (sourceType === _constant.CATE_REF) {
    modDep = (0, _util.safeGetObject)(refCtx.computedDep, refCtx.module);
  } else {
    modDep = (0, _util.safeGetObject)(_computedMap["default"]._computedDep, stateModule);
  }

  var stateKey_retKeys_ = (0, _util.safeGetObject)(modDep, 'stateKey_retKeys_');
  depKeys.forEach(function (sKey) {
    var retKeys = (0, _util.safeGetArray)(stateKey_retKeys_, sKey);
    if (!retKeys.includes(retKey)) retKeys.push(retKey);
  });
}

function executeCuOrWatch(retKey, depKeys, fn, newState, oldState, fnCtx) {
  var _getCuWaParams = getCuWaParams(retKey, depKeys, newState, oldState),
      n = _getCuWaParams[0],
      o = _getCuWaParams[1];

  return fn(n, o, fnCtx);
} // fnType: computed watch
// sourceType: module ref


var _default = function _default(refCtx, stateModule, refModule, oldState, finder, stateForComputeFn, initNewState, initDeltaCommittedState, callInfo, isFirstCall, fnType, sourceType, computedContainer) {
  var whileCount = 0;
  var curStateForComputeFn = stateForComputeFn;
  var shouldCurrentRefUpdate = true;
  var hasDelta = false;

  var _loop = function _loop() {
    whileCount++; // 因为beforeMountFlag为true的情况下，finder里调用的pickDepFns会挑出所有函数，
    // 这里必需保证只有第一次循环的时候取isFirstCall的实际值，否则一定取false，（要不然就陷入无限死循环，每一次都是true，每一次都挑出所有dep函数执行）

    var beforeMountFlag = whileCount === 1 ? isFirstCall : false;

    var _finder = finder(curStateForComputeFn, beforeMountFlag),
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
          depKeys = _ref.depKeys,
          isLazy = _ref.isLazy;
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
        committedState: curStateForComputeFn,
        refCtx: refCtx
      }; // 循环里的首次计算且是自动收集状态，注入代理对象，收集计算&观察依赖
      // 注：只有immediate为true的watch才有机会执行此判断结构为true并收集到依赖

      var canPassObState = beforeMountFlag && depKeys === '-';

      if (fnType === 'computed') {
        if (isLazy) {
          // lazyComputed 不再暴露这两个接口，以隔绝副作用
          delete fnCtx.commit;
          delete fnCtx.commitCu;
        }

        if (canPassObState) {
          var collectedDepKeys = [];
          var obInitNewState = (0, _makeCuObState["default"])(initNewState, collectedDepKeys); // 首次计算时，new 和 old是同一个对象，方便用于收集depKeys

          var computedValueOrRet = executeCuOrWatch(retKey, depKeys, fn, obInitNewState, obInitNewState, fnCtx);
          computedContainer[retKey] = (0, _util.makeCuObValue)(false, computedValueOrRet);
          setStateKeyRetKeysMap(refCtx, sourceType, stateModule, retKey, collectedDepKeys);
        } else {
          if (isLazy) {
            var _getCuWaParams2 = getCuWaParams(retKey, depKeys, initNewState, oldState),
                n = _getCuWaParams2[0],
                o = _getCuWaParams2[1];

            computedContainer[retKey] = (0, _util.makeCuObValue)(isLazy, null, true, fn, n, o, fnCtx);
          } else {
            var _computedValueOrRet = executeCuOrWatch(retKey, depKeys, fn, initNewState, oldState, fnCtx);

            computedContainer[retKey] = (0, _util.makeCuObValue)(false, _computedValueOrRet);
          }
        }
      } else {
        // watch
        var _computedValueOrRet2,
            tmpInitNewState = initNewState,
            _collectedDepKeys = [];

        var tmpOldState = oldState;

        if (canPassObState) {
          tmpInitNewState = (0, _makeCuObState["default"])(initNewState, _collectedDepKeys); // 首次触发watch时，new 和 old是同一个对象，方便用于收集depKeys

          tmpOldState = tmpInitNewState;
        }

        _computedValueOrRet2 = executeCuOrWatch(retKey, depKeys, fn, tmpInitNewState, tmpOldState, fnCtx);
        setStateKeyRetKeysMap(refCtx, sourceType, stateModule, retKey, _collectedDepKeys); //实例里只要有一个watch函数返回false，就会阻碍当前实例的ui被更新

        if (_computedValueOrRet2 === false) shouldCurrentRefUpdate = false;
      }
    });
    curStateForComputeFn = getFnCommittedState();

    if (curStateForComputeFn) {
      var assignCuState = function assignCuState(toAssign, judgeEmpty) {
        if (judgeEmpty === void 0) {
          judgeEmpty = false;
        }

        curStateForComputeFn = toAssign;

        if (judgeEmpty && (0, _util.okeys)(toAssign).length === 0) {
          curStateForComputeFn = null;
          return;
        }

        Object.assign(initNewState, curStateForComputeFn);
        Object.assign(initDeltaCommittedState, curStateForComputeFn);
        hasDelta = true;
      }; // !!! 确保实例里调用commit只能提交privState片段，模块里调用commit只能提交moduleState片段
      // !!! 同时确保privState里的key是事先声明过的，而不是动态添加的


      var stateKeys = sourceType === 'ref' ? refCtx.privStateKeys : _statekeysMap["default"][stateModule];

      var _extractStateByKeys = (0, _extractStateByKeys2["default"])(curStateForComputeFn, stateKeys, true, true),
          partialState = _extractStateByKeys.partialState,
          ignoredStateKeys = _extractStateByKeys.ignoredStateKeys;

      if (partialState) {
        if (fnType === _constant.FN_WATCH) {
          var stateKey_retKeys_ = getStateKeyRetKeysMap(refCtx, sourceType, stateModule);

          if (stateKey_retKeys_) {
            // 确保watch函数里调用commit提交的state keys没有出现在computed函数的depKeys里
            // 因为按照先执行computed，再执行watch的顺序，提交了这种stateKey，会造成computed函数返回结果失效了的情况产生
            var ignoredStateKeysAsDepInCu = [],
                canAssignState = {};
            (0, _util.okeys)(partialState).forEach(function (stateKey) {
              if (stateKey_retKeys_[stateKey]) {
                ignoredStateKeysAsDepInCu.push(stateKey);
              } else {
                canAssignState[stateKey] = partialState[stateKey];
              }
            });

            if (ignoredStateKeysAsDepInCu.length > 0) {
              (0, _util.justWarning)("these state keys[" + ignoredStateKeysAsDepInCu.join(',') + "] will been ignored, cause they are also appeared in computed depKeys,\n              cc suggest you move the logic to computed file.");
            }

            assignCuState(canAssignState, true);
          } else {
            assignCuState(partialState);
          }
        } else {
          assignCuState(partialState);
        }
      }

      if (ignoredStateKeys.length) {
        var reason = "they are not " + (sourceType === _constant.CATE_REF ? 'private' : 'module') + ", fn is " + sourceType + " " + fnType;
        (0, _util.justWarning)("these state keys[" + ignoredStateKeys.join(',') + "] are invalid, " + reason);
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
          if (!retKey_fn_[retKey]) (0, _util.justWarning)("fnCtx.commitCu commit an invalid retKey[" + retKey + "] for moduleComputed"); // 由committedCu提交的值，可以统一当作非lazy值set回去，方便取的时候直接取
          else computedContainer[retKey] = (0, _util.makeCuObValue)(false, committedCu[retKey]);
          ;
        });
      }
    }

    if (whileCount > 10) {
      (0, _util.justWarning)('fnCtx.commit may goes endless loop, please check your code');
      curStateForComputeFn = null;
    }
  };

  while (curStateForComputeFn) {
    var _ret = _loop();

    if (_ret === "break") break;
  }

  return {
    shouldCurrentRefUpdate: shouldCurrentRefUpdate,
    hasDelta: hasDelta
  };
};

exports["default"] = _default;