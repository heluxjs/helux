"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _util = require("../../support/util");

var _constant = require("../../support/constant");

var _extractStateByKeys2 = _interopRequireDefault(require("../state/extract-state-by-keys"));

var _makeCuObState = _interopRequireDefault(require("../computed/make-cu-ob-state"));

var _makeCuRefObContainer = require("../computed/make-cu-ref-ob-container");

var _computedMap = _interopRequireDefault(require("../../cc-context/computed-map"));

var _watchMap = _interopRequireDefault(require("../../cc-context/watch-map"));

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

function setStateKeyRetKeysMap(refCtx, sourceType, fnType, stateModule, retKey, keys, isKeysDep) {
  if (isKeysDep === void 0) {
    isKeysDep = true;
  }

  if (keys.length === 0) return;
  var modDep, cuModDep;

  if (sourceType === _constant.CATE_REF) {
    // 由ref发起调用，refCtx是肯定有值的
    var computedDep = refCtx.computedDep;
    var depDesc = fnType === _constant.FN_CU ? computedDep : refCtx.watchDep;
    cuModDep = (0, _util.safeGet)(computedDep, stateModule);
    modDep = (0, _util.safeGet)(depDesc, stateModule);
  } else {
    var cuDep = _computedMap["default"]._computedDep;

    var _depDesc = fnType === _constant.FN_CU ? cuDep : _watchMap["default"]._watchDep;

    cuModDep = (0, _util.safeGet)(cuDep, stateModule);
    modDep = (0, _util.safeGet)(_depDesc, stateModule);
  }

  var stateKey_retKeys_ = (0, _util.safeGet)(modDep, 'stateKey_retKeys_');
  var retKey_stateKeys_ = (0, _util.safeGet)(modDep, 'retKey_stateKeys_');

  var updateRelationship = function updateRelationship(depKeys) {
    var stateKeys = (0, _util.safeGetArray)(retKey_stateKeys_, retKey);
    depKeys.forEach(function (sKey) {
      var retKeys = (0, _util.safeGetArray)(stateKey_retKeys_, sKey); // 此处判断一下retKeys，谨防用户直接在computed里操作obState, 这里拿到的sKey是一堆原型链上key，如`valueOf`等

      if (Array.isArray(retKeys) && !retKeys.includes(retKey)) retKeys.push(retKey);
      if (!stateKeys.includes(sKey)) stateKeys.push(sKey);
    });
  };

  if (isKeysDep) {
    // keys is depKeys
    updateRelationship(keys);
  } else {
    // keys is retKeys, 将retKeys里各自retKey的stateKeys转移给目标retKey
    keys.forEach(function (sourceRetKey) {
      // 这里取的是cu模块的retKey_stateKeys_
      var retKey_stateKeys_ = (0, _util.safeGet)(cuModDep, 'retKey_stateKeys_');
      var sourceStateKeys = retKey_stateKeys_[sourceRetKey] || [];
      updateRelationship(sourceStateKeys);
    });
  }
}

function executeCuOrWatch(retKey, depKeys, fn, newState, oldState, fnCtx) {
  var _getCuWaParams = getCuWaParams(retKey, depKeys, newState, oldState),
      n = _getCuWaParams[0],
      o = _getCuWaParams[1];

  return fn(n, o, fnCtx);
} // fnType: computed watch
// sourceType: module ref


var _default = function _default(ref, stateModule, refModule, oldState, finder, stateForComputeFn, initNewState, initDeltaCommittedState, callInfo, isFirstCall, fnType, sourceType, computedContainer) {
  if (ref === void 0) {
    ref = {};
  }

  var refCtx = ref.ctx;
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
        getRetKeyCu = _makeCommitHandler2.getFnCommittedState,
        clearCu = _makeCommitHandler2.clear;

    pickedFns.forEach(function (_ref) {
      var retKey = _ref.retKey,
          fn = _ref.fn,
          depKeys = _ref.depKeys,
          isLazy = _ref.isLazy;
      var fnCtx = {
        // 注意这里的computedContainer只是一个计算结果收集容器，没有收集依赖行为
        retKey: retKey,
        callInfo: callInfo,
        isFirstCall: isFirstCall,
        commit: commit,
        commitCu: commitCu,
        setted: setted,
        changed: changed,
        cuVal: computedContainer,
        stateModule: stateModule,
        refModule: refModule,
        oldState: oldState,
        committedState: curStateForComputeFn,
        refCtx: refCtx
      }; // 循环里的首次计算且是自动收集状态，注入代理对象，收集计算&观察依赖
      // 注：只有immediate为true的watch才有机会执行此判断结构为true并收集到依赖

      var canPassObState = beforeMountFlag && depKeys === '-'; // 对于watch的cuVal，存在依赖收集行为
      // ref触发了模块watch，先假设路径是通过触发了moduleComputed.*** 来勾起的收集行为
      // todo, 加上调用此findDepFns的ref走的是connectedComputed 还是 moduleComputed

      var collectedRetKeys = [];

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
          setStateKeyRetKeysMap(refCtx, sourceType, fnType, stateModule, retKey, collectedDepKeys);
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
        // 替换cuVal，以便动态的收集到watch函数里对computed结果的相关依赖
        fnCtx.cuVal = (0, _makeCuRefObContainer.getSimpleObContainer)(stateModule, collectedRetKeys);

        var _computedValueOrRet2,
            tmpInitNewState = initNewState,
            _collectedDepKeys = [];

        var tmpOldState = oldState;

        if (canPassObState) {
          tmpInitNewState = (0, _makeCuObState["default"])(initNewState, _collectedDepKeys); // 首次触发watch时，new 和 old是同一个对象，方便用于收集depKeys

          tmpOldState = tmpInitNewState;
        }

        _computedValueOrRet2 = executeCuOrWatch(retKey, depKeys, fn, tmpInitNewState, tmpOldState, fnCtx); //实例里只要有一个watch函数返回false，就会阻碍当前实例的ui被更新

        if (_computedValueOrRet2 === false) shouldCurrentRefUpdate = false; // watch函数本身retKey的stateKey_retKeys_需要被更新

        setStateKeyRetKeysMap(refCtx, sourceType, fnType, stateModule, retKey, _collectedDepKeys); // computedContainer对于模块里的computed回调里调用committedCu，是moduleComputed结果容器，
        // 对于实例里的computed回调里调用committedCu来说，是refComputed结果容器
        // 每一个retKey返回的committedCu都及时处理掉，因为下面setStateKeyRetKeysMap需要对此时的retKey写依赖

        var committedCu = getRetKeyCu();

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
            (0, _util.okeys)(committedCu).forEach(function (cuRetKey) {
              if (!retKey_fn_[cuRetKey]) (0, _util.justWarning)("fnCtx.commitCu commit an invalid retKey[" + cuRetKey + "] for moduleComputed"); // 由committedCu提交的值，可以统一当作非lazy值set回去，方便取的时候直接取
              else {
                  computedContainer[cuRetKey] = (0, _util.makeCuObValue)(false, committedCu[cuRetKey]); // 在watch里读取了cuVal里的retKey结果，要将这些retKey对应的stateKey依赖写回到watchDepDesc里，
                  // 以便能够在相应stateKey值改变时，能够正确命中watch函数

                  setStateKeyRetKeysMap(refCtx, sourceType, _constant.FN_WATCH, stateModule, retKey, collectedRetKeys, false); // 将这些retKey对应的stateKey依赖写回到目标cuRetKey的retKey_stateKeys_映射
                  // 以便实例里moduleCompute.YYY or connectedComputed.**.YYY 能够正确收集到实例对YYY的依赖

                  setStateKeyRetKeysMap(refCtx, sourceType, _constant.FN_CU, stateModule, cuRetKey, collectedRetKeys, false);
                }
            });
          }

          clearCu();
        }
      }
    }); // 这里一次性处理所有computed函数提交的state

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