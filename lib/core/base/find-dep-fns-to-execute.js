"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.clearCuRefer = clearCuRefer;
exports["default"] = executeDepFns;

var _util = require("../../support/util");

var _constant = require("../../support/constant");

var _extractStateByKeys2 = _interopRequireDefault(require("../state/extract-state-by-keys"));

var _pickDepFns = _interopRequireDefault(require("../base/pick-dep-fns"));

var _makeCuObState = _interopRequireDefault(require("../computed/make-cu-ob-state"));

var _makeCuRefObContainer = require("../computed/make-cu-ref-ob-container");

var _computedMap = _interopRequireDefault(require("../../cc-context/computed-map"));

var _watchMap = _interopRequireDefault(require("../../cc-context/watch-map"));

var _statekeysMap = _interopRequireDefault(require("../../cc-context/statekeys-map"));

var _wakeyUkeyMap = require("../../cc-context/wakey-ukey-map");

// 记录某个cuRetKey引用过哪些staticCuRetKeys
// 直接引用或者间接引用过staticCuRetKey都会记录在列表内
var modCuRetKey_referStaticCuRetKeys_ = {};
var refCuRetKey_referStaticCuRetKeys_ = {};

function getCuRetKeyRSListMap(sourceType, module, ccUniqueKey) {
  if (sourceType == _constant.CATE_MODULE) {
    return (0, _util.safeGet)(modCuRetKey_referStaticCuRetKeys_, module);
  } else {
    return (0, _util.safeGet)(refCuRetKey_referStaticCuRetKeys_, ccUniqueKey);
  }
}

function getCuRetKeyRSList(cuRetKey, sourceType, module, ccUniqueKey) {
  var map = getCuRetKeyRSListMap(sourceType, module, ccUniqueKey);
  return (0, _util.safeGetArray)(map, cuRetKey);
}

function clearCuRefer() {
  modCuRetKey_referStaticCuRetKeys_ = {};
  refCuRetKey_referStaticCuRetKeys_ = {};
}

function getCuDep(refCtx, sourceType) {
  return sourceType === _constant.CATE_REF ? refCtx.computedDep : _computedMap["default"]._computedDep;
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

function getRetKeyFnMap(refCtx, sourceType, stateModule) {
  // 始终从_computedDep 取retKey_fn_，来判断commitCu提交的retKey是否合法
  if (sourceType === _constant.CATE_REF) {
    return refCtx.computedRetKeyFns;
  } else {
    var moduleDep = _computedMap["default"]._computedDep[stateModule] || {};
    return moduleDep.retKey_fn_ || {};
  }
}

function mapRSList(cuRetKey, referCuRetKeys, refCtx, ccUniqueKey, sourceType, stateModule) {
  var cuRetKey_referStaticCuRetKeys_ = getCuRetKeyRSListMap(cuRetKey, sourceType, stateModule, ccUniqueKey);
  var retKey_fn_ = getRetKeyFnMap(refCtx, sourceType, stateModule);
  var referStaticCuRetKeys = (0, _util.safeGetArray)(cuRetKey_referStaticCuRetKeys_, cuRetKey);
  referCuRetKeys.forEach(function (referCuRetKey) {
    var fnDesc = retKey_fn_[referCuRetKey]; // 直接引用

    if (fnDesc.isStatic) {
      referStaticCuRetKeys.push(referCuRetKey);
    } else {
      var tmpRSList = (0, _util.safeGetArray)(cuRetKey_referStaticCuRetKeys_, referCuRetKey); // 把引用的referCuRetKey对应的staticCuRetKey列表记录到当前cuRetKey的staticCuRetKey列表记录上
      // 因为computed函数是严格按需执行的，所以此逻辑能够成立

      tmpRSList.forEach(function (staticCuRetKey) {
        return (0, _util.noDupPush)(referStaticCuRetKeys, staticCuRetKey);
      });
    }
  });
} // fnType: computed watch
// sourceType: module ref


function executeDepFns(ref, stateModule, refModule, oldState, finder, stateForComputeFn, initNewState, initDeltaCommittedState, callInfo, isFirstCall, fnType, sourceType, computedContainer) {
  if (ref === void 0) {
    ref = {};
  }

  var refCtx = ref.ctx;
  var ccUniqueKey = refCtx ? refCtx.ccUniqueKey : '';
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
        retKey: retKey,
        callInfo: callInfo,
        isFirstCall: isFirstCall,
        commit: commit,
        commitCu: commitCu,
        setted: setted,
        changed: changed,
        // 在sourceType为module时 
        // 这里的computedContainer只是一个携带defineProperty的计算结果收集容器，没有收集依赖行为
        cuVal: computedContainer,
        stateModule: stateModule,
        refModule: refModule,
        oldState: oldState,
        committedState: curStateForComputeFn,
        refCtx: refCtx
      }; // 循环里的首次计算且是自动收集状态，注入代理对象，收集计算&观察依赖

      var needCollectDep = beforeMountFlag && depKeys === '-'; // 读取cuVal时，记录cuRetKeys，用于辅助下面计算依赖

      var collectedCuRetKeys = []; // 读取newState时，记录stateKeys，用于辅助下面计算依赖

      var collectedDepKeys = []; // 对于computed，首次计算时会替换为obContainer用于收集依赖
      // !!!对于watch，immediate为true才有机会替换为obContainer收集到依赖

      if (needCollectDep) {
        // 替换cuVal，以便动态的收集到computed&watch函数里读取cuVal时计算相关依赖
        fnCtx.cuVal = (0, _makeCuRefObContainer.getSimpleObContainer)(retKey, sourceType, fnType, stateModule, refCtx, collectedCuRetKeys);
      }

      if (fnType === 'computed') {
        if (isLazy) {
          // lazyComputed 不再暴露这两个接口，以隔绝副作用
          delete fnCtx.commit;
          delete fnCtx.commitCu;
        }

        if (needCollectDep) {
          var obInitNewState = (0, _makeCuObState["default"])(initNewState, collectedDepKeys); // 首次计算时，new 和 old是同一个对象，方便用于收集depKeys

          var computedValueOrRet = fn(obInitNewState, obInitNewState, fnCtx); // 记录计算结果

          computedContainer[retKey] = (0, _util.makeCuObValue)(false, computedValueOrRet); // 在computed函数里读取了newState的stateKey，需要将其记录到当前retKey的依赖列表上
          // 以便能够在相应stateKey值改变时，能够正确命中该computed函数

          setStateKeyRetKeysMap(refCtx, sourceType, _constant.FN_CU, stateModule, retKey, collectedDepKeys); // 在computed里读取cuVal里的其他retKey结果, 要将其他retKey对应的stateKeys写到当前retKey的依赖列表上，
          // 以便能够在相应stateKey值改变时，能够正确命中该computed函数

          setStateKeyRetKeysMap(refCtx, sourceType, _constant.FN_CU, stateModule, retKey, collectedCuRetKeys, false);
          mapRSList(retKey, collectedCuRetKeys, refCtx, ccUniqueKey, sourceType, stateModule);
        } else {
          if (isLazy) {
            computedContainer[retKey] = (0, _util.makeCuObValue)(isLazy, null, true, fn, initNewState, oldState, fnCtx);
          } else {
            var _computedValueOrRet = fn(initNewState, oldState, fnCtx);

            computedContainer[retKey] = (0, _util.makeCuObValue)(false, _computedValueOrRet);
          }
        }
      } else {
        // watch
        var _computedValueOrRet2,
            tmpInitNewState = initNewState;

        var tmpOldState = oldState; // 首次触发watch时，才传递ob对象，用于收集依赖

        if (needCollectDep) {
          tmpInitNewState = (0, _makeCuObState["default"])(initNewState, collectedDepKeys); //new 和 old是同一个对象，方便用于收集depKeys

          tmpOldState = tmpInitNewState;
        }

        _computedValueOrRet2 = fn(tmpInitNewState, tmpOldState, fnCtx); //实例里只要有一个watch函数返回false，就会阻碍当前实例的ui被更新

        if (_computedValueOrRet2 === false) shouldCurrentRefUpdate = false; // 首次触发watch时, 才记录依赖

        if (needCollectDep) {
          // 在watch函数里读取了newState的stateKey，需要将其记录到当前watch retKey的依赖列表上
          // 以便能够在相应stateKey值改变时，能够正确命中该watch函数
          setStateKeyRetKeysMap(refCtx, sourceType, _constant.FN_WATCH, stateModule, retKey, collectedDepKeys); // 在watch里读取了cuVal里的retKey结果，要将这些retKey对应的stateKey依赖附加到当前watch retKey的依赖列表上，
          // 以便能够在相应stateKey值改变时，能够正确命中该watch函数

          setStateKeyRetKeysMap(refCtx, sourceType, _constant.FN_WATCH, stateModule, retKey, collectedCuRetKeys, false);
        }
      } // refCompute&refWatch 里获取state、moduleState、connectedState的值收集到的depKeys要记录为ref的静态依赖


      if (needCollectDep && sourceType === _constant.CATE_REF) {
        collectedDepKeys.forEach(function (key) {
          return refCtx.__$$staticWaKeys[(0, _wakeyUkeyMap.makeWaKey)(stateModule, key)] = 1;
        }); // 注：refWatch直接读取了moduleComputed 或者 connectedComputed的值时也收集到了依赖
        // 逻辑在updateDep里判断__$$isBM来确定是不是首次触发
      } // computedContainer对于module computed fn里调用committedCu，是moduleComputed结果容器，
      // 对于ref computed fn里调用committedCu来说，是refComputed结果容器
      // 每一个retKey返回的committedCu都及时处理掉，因为下面setStateKeyRetKeysMap需要对此时的retKey写依赖


      var committedCuRet = getRetKeyCu();

      if (committedCuRet) {
        var retKey_fn_ = getRetKeyFnMap(refCtx, sourceType, stateModule);
        (0, _util.okeys)(committedCuRet).forEach(function (cuRetKey) {
          // 模块计算函数里调用commitCu只能修改模块计算retKey
          // 实例计算函数里调用commitCu只能修改实例计算retKey
          var fnDesc = retKey_fn_[cuRetKey];
          var tip = "commitCu: " + sourceType + " " + fnType + " retKey[" + retKey + "] can't";
          if (!fnDesc) (0, _util.justWarning)(tip + " commit [" + cuRetKey + "], it is not defined"); // 由committedCu提交的值，可以统一当作非lazy值set回去，方便取的时候直接取
          else {
              // 检查提交目标只能是静态的cuRetKey
              if (fnDesc.isStatic) {
                var RSList = getCuRetKeyRSList(cuRetKey, sourceType, stateModule, ccUniqueKey);

                if (RSList.includes(cuRetKey)) {
                  // 直接或间接引用了这个cuRetKey，就不能去改变它，以避免死循环
                  (0, _util.justWarning)(tip + " change [" + cuRetKey + "], [" + retKey + "] referred [" + cuRetKey + "]");
                } else {
                  computedContainer[cuRetKey] = (0, _util.makeCuObValue)(false, committedCuRet[cuRetKey]);
                }
              } else {
                (0, _util.justWarning)(tip + " change [" + cuRetKey + "], it must have zero dep keys");
              }
            }
        });
        clearCu();
      }
    }); // 这里一次性处理所有computed函数提交了然后合并后的state

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

      var _extractStateByKeys = (0, _extractStateByKeys2["default"])(curStateForComputeFn, stateKeys, true),
          partialState = _extractStateByKeys.partialState,
          ignoredStateKeys = _extractStateByKeys.ignoredStateKeys;

      if (ignoredStateKeys.length) {
        var reason = "they are not " + (sourceType === _constant.CATE_REF ? 'private' : 'module') + ", fn is " + sourceType + " " + fnType;
        (0, _util.justWarning)("these state keys[" + ignoredStateKeys.join(',') + "] are invalid, " + reason);
      }

      if (partialState) {
        // watch里提交了新的片段state，再次过一遍computed函数
        if (fnType === _constant.FN_WATCH) {
          // const stateKey_retKeys_ = getStateKeyRetKeysMap(refCtx, sourceType, stateModule);
          var computedDep = getCuDep(refCtx, sourceType, stateModule);

          var _finder2 = function _finder2(committedState, isBeforeMount) {
            return (0, _pickDepFns["default"])(isBeforeMount, sourceType, _constant.FN_CU, computedDep, stateModule, oldState, committedState, ccUniqueKey);
          };

          executeDepFns(ref, stateModule, refModule, oldState, _finder2, partialState, initNewState, initDeltaCommittedState, callInfo, false, // 再次由watch发起的computed函数查找调用，irFirstCall，一定是false
          _constant.FN_CU, sourceType, computedContainer);
        } else {
          assignCuState(partialState);
        }
      }
    }

    if (whileCount > 2) {
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
}