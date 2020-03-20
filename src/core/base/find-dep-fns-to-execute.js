import { makeCommitHandler, okeys, justWarning, makeCuObValue, safeGet, safeGetArray } from '../../support/util';
import { FN_WATCH, CATE_REF, FN_CU, CATE_MODULE } from '../../support/constant';
import extractStateByKeys from '../state/extract-state-by-keys';
import makeCuObState from '../computed/make-cu-ob-state';
import { getSimpleObContainer } from '../computed/make-cu-ref-ob-container';
import cuMap from '../../cc-context/computed-map';
import waMap from '../../cc-context/watch-map';
import moduleName_stateKeys_ from '../../cc-context/statekeys-map';
import { makeWaKey } from '../../cc-context/wakey-ukey-map';
import runtimeVar from '../../cc-context/runtime-var';

// 记录某个计算retKey，被其他哪些计算retKey引用过
// 方便watch里更新了这个retKey的依赖是，查找这些引用过这个retKey的其他retKey列表，并更新它们的依赖列表
let modCuRetKey_referredByCuRetKeys_ = {};
let refCuRetKey_referredByCuRetKeys_ = {};

function getCuRefer(sourceType, module, ccUniqueKey) {
  if (sourceType == CATE_MODULE) {
    return safeGet(modCuRetKey_referredByCuRetKeys_, module);
  } else {
    return safeGet(refCuRetKey_referredByCuRetKeys_, ccUniqueKey);
  }
}

export function clearCuRefer() {
  modCuRetKey_referredByCuRetKeys_ = {};
  refCuRetKey_referredByCuRetKeys_ = {};
}

function getStateKeyRetKeysMap(refCtx, sourceType, stateModule) {
  let modDep;
  if (sourceType === CATE_REF) {
    modDep = refCtx.computedDep[refCtx.module] || {};
  } else {
    modDep = cuMap._computedDep[stateModule] || {};
  }
  return modDep.stateKey_retKeys_;
}

function setStateKeyRetKeysMap(refCtx, sourceType, fnType, stateModule, retKey, keys, isKeysDep = true) {
  if (keys.length === 0) return;

  let modDep, cuModDep;
  if (sourceType === CATE_REF) {// 由ref发起调用，refCtx是肯定有值的
    const computedDep = refCtx.computedDep;
    const depDesc = fnType === FN_CU ? computedDep : refCtx.watchDep;

    cuModDep = safeGet(computedDep, stateModule);
    modDep = safeGet(depDesc, stateModule);
  } else {
    const cuDep = cuMap._computedDep;
    const depDesc = fnType === FN_CU ? cuDep : waMap._watchDep;

    cuModDep = safeGet(cuDep, stateModule);
    modDep = safeGet(depDesc, stateModule);
  }
  const stateKey_retKeys_ = safeGet(modDep, 'stateKey_retKeys_');
  const retKey_stateKeys_ = safeGet(modDep, 'retKey_stateKeys_');

  const updateRelationship = (depKeys) => {
    const stateKeys = safeGetArray(retKey_stateKeys_, retKey);
    depKeys.forEach(sKey => {
      const retKeys = safeGetArray(stateKey_retKeys_, sKey);

      // 此处判断一下retKeys，谨防用户直接在computed里操作obState, 这里拿到的sKey是一堆原型链上key，如`valueOf`等
      if (Array.isArray(retKeys) && !retKeys.includes(retKey)) retKeys.push(retKey);

      if (!stateKeys.includes(sKey)) stateKeys.push(sKey);
    });
  }

  if (isKeysDep) {// keys is depKeys
    updateRelationship(keys);
  } else {// keys is retKeys, 将retKeys里各自retKey的stateKeys转移给目标retKey
    keys.forEach(sourceRetKey => {
      // 这里取的是cu模块的retKey_stateKeys_
      const retKey_stateKeys_ = safeGet(cuModDep, 'retKey_stateKeys_');
      const sourceStateKeys = retKey_stateKeys_[sourceRetKey] || [];
      updateRelationship(sourceStateKeys);
    });
  }
}

// fnType: computed watch
// sourceType: module ref
export default (
  ref = {}, stateModule, refModule, oldState, finder,
  stateForComputeFn, initNewState, initDeltaCommittedState, callInfo, isFirstCall,
  fnType, sourceType, computedContainer,
) => {
  const refCtx = ref.ctx;
  const ccUniqueKey = refCtx ? refCtx.ccUniqueKey : '';

  let whileCount = 0;
  let curStateForComputeFn = stateForComputeFn;
  let shouldCurrentRefUpdate = true;
  let hasDelta = false;

  while (curStateForComputeFn) {
    whileCount++;
    // 因为beforeMountFlag为true的情况下，finder里调用的pickDepFns会挑出所有函数，
    // 这里必需保证只有第一次循环的时候取isFirstCall的实际值，否则一定取false，（要不然就陷入无限死循环，每一次都是true，每一次都挑出所有dep函数执行）
    const beforeMountFlag = whileCount === 1 ? isFirstCall : false;
    const { pickedFns, setted, changed } = finder(curStateForComputeFn, beforeMountFlag);
    if (!pickedFns.length) break;

    const { commit, getFnCommittedState } = makeCommitHandler();
    const { commit: commitCu, getFnCommittedState: getRetKeyCu, clear: clearCu } = makeCommitHandler();

    pickedFns.forEach(({ retKey, fn, depKeys, isLazy }) => {
      const cuRetKey_referredByCuRetKeys_ = getCuRefer(sourceType, stateModule, ccUniqueKey);

      const fnCtx = {
        retKey, callInfo, isFirstCall, commit, commitCu, setted, changed,
        // 在sourceType为module时 
        // 这里的computedContainer只是一个携带defineProperty的计算结果收集容器，没有收集依赖行为
        cuVal: computedContainer,
        stateModule, refModule, oldState, committedState: curStateForComputeFn, refCtx
      };
      
      // 循环里的首次计算且是自动收集状态，注入代理对象，收集计算&观察依赖
      const needCollectDep = beforeMountFlag && depKeys === '-';
      
      // 读取cuVal时，记录cuRetKeys，用于辅助下面计算依赖
      const collectedCuRetKeys = [];
      // 读取newState时，记录stateKeys，用于辅助下面计算依赖
      const collectedDepKeys = [];

      // 对于computed，首次计算时会替换为obContainer用于收集依赖
      // !!!对于watch，immediate为true才有机会替换为obContainer收集到依赖
      if (needCollectDep) {
        // 替换cuVal，以便动态的收集到computed&watch函数里读取cuVal时计算相关依赖
        fnCtx.cuVal = getSimpleObContainer(sourceType, stateModule, refCtx, collectedCuRetKeys);
      }

      if (fnType === 'computed') {
        if (isLazy) {
          // lazyComputed 不再暴露这两个接口，以隔绝副作用
          delete fnCtx.commit;
          delete fnCtx.commitCu;
        }

        if (needCollectDep) {
          const obInitNewState = makeCuObState(initNewState, collectedDepKeys);
          // 首次计算时，new 和 old是同一个对象，方便用于收集depKeys
          const computedValueOrRet = fn(obInitNewState, obInitNewState, fnCtx);
          // 记录计算结果
          computedContainer[retKey] = makeCuObValue(false, computedValueOrRet);

          // 当前cuRetKey的函数里读取了其他cuRetKey时需要更新依赖
          // 以便能够正确触发computed函数
          setStateKeyRetKeysMap(refCtx, sourceType, FN_CU, stateModule, retKey, collectedDepKeys);

          // 在computed里读取cuVal里的其他retKey结果, 要将这些retKey对应的stateKeys写到目标retKey的依赖列表上，
          // 以便实例里moduleCompute.YYY or connectedComputed.**.YYY 能够正确收集到实例对YYY的依赖
          setStateKeyRetKeysMap(refCtx, sourceType, FN_CU, stateModule, retKey, collectedCuRetKeys, false);

          collectedCuRetKeys.forEach(referCuRetKey => {
            const reKeys = safeGetArray(cuRetKey_referredByCuRetKeys_, referCuRetKey);
            if (!reKeys.includes(retKey)) reKeys.push(retKey);
          })
        } else {
          if (isLazy) {
            computedContainer[retKey] = makeCuObValue(isLazy, null, true, fn, initNewState, oldState, fnCtx);
          } else {
            const computedValueOrRet = fn(initNewState, oldState, fnCtx);
            computedContainer[retKey] = makeCuObValue(false, computedValueOrRet);
          }
        }

      } else {// watch
        let computedValueOrRet, tmpInitNewState = initNewState;
        let tmpOldState = oldState;

        // 首次触发watch时，才传递ob对象，用于收集依赖
        if (needCollectDep) {
          tmpInitNewState = makeCuObState(initNewState, collectedDepKeys);
          //new 和 old是同一个对象，方便用于收集depKeys
          tmpOldState = tmpInitNewState;
        }

        computedValueOrRet = fn(tmpInitNewState, tmpOldState, fnCtx);

        //实例里只要有一个watch函数返回false，就会阻碍当前实例的ui被更新
        if (computedValueOrRet === false) shouldCurrentRefUpdate = false;

        // 首次触发watch时, 才记录依赖
        if (needCollectDep) {
          // 在watch里读取了newState的stateKey，需要将其记录到当前watch retKey的依赖列表上，以便watch能够被正确触发
          setStateKeyRetKeysMap(refCtx, sourceType, FN_WATCH, stateModule, retKey, collectedDepKeys);
          // 在watch里读取了cuVal里的retKey结果，要将这些retKey对应的stateKey依赖附加到当前watch retKey的依赖列表上，
          // 以便能够在相应stateKey值改变时，能够正确命中watch函数
          setStateKeyRetKeysMap(refCtx, sourceType, FN_WATCH, stateModule, retKey, collectedCuRetKeys, false);

          // refWatch 里收集的到depKeys要记录为ref的静态依赖
          if (sourceType === CATE_REF) {
            collectedDepKeys.forEach(key => refCtx.__$$staticWaKeys[makeWaKey(stateModule, key)] = 1);
            // 注：refWatch直接调用了moduleComputed 或者 connectedComputed时也收集到了依赖
            // 逻辑在updateDep里判断__$$isBM来确定是不是首次触发
          }

        }

        // computedContainer对于模块里的computed回调里调用committedCu，是moduleComputed结果容器，
        // 对于实例里的computed回调里调用committedCu来说，是refComputed结果容器
        // 每一个retKey返回的committedCu都及时处理掉，因为下面setStateKeyRetKeysMap需要对此时的retKey写依赖
        const committedCu = getRetKeyCu();
        
        if (committedCu) {
          let retKey_fn_;

          // 始终从_computedDep 取retKey_fn_，来判断commitCu提交的retKey是否合法
          if (sourceType === 'ref') {
            retKey_fn_ = refCtx.computedRetKeyFns;
          } else {
            let moduleDep = cuMap._computedDep[stateModule] || {};
            retKey_fn_ = moduleDep.retKey_fn_ || {};
          }

          okeys(committedCu).forEach(cuRetKey => {
            // 模块计算函数里调用committedCu只能修改模块计算结果
            // 实例计算函数里调用committedCu只能修改实例计算结果
            if (!retKey_fn_[cuRetKey]) justWarning(`fnCtx.commitCu commit an invalid retKey[${cuRetKey}] for ${sourceType}Computed`);
            // 由committedCu提交的值，可以统一当作非lazy值set回去，方便取的时候直接取
            else {
              computedContainer[cuRetKey] = makeCuObValue(false, committedCu[cuRetKey]);

              if (needCollectDep) {
                // 等待处理依赖关系的cuRetKey
                if (!collectedCuRetKeys.includes(cuRetKey)) collectedCuRetKeys.push(cuRetKey);
              }
            }
          });

          clearCu();
        }

        // 当前waRetKey的函数里读取了其他cuRetKey时需要更新依赖
        if (needCollectDep) {
          collectedCuRetKeys.forEach(cuRetKey => {
            // 在watch里读取了newState的stateKey，需要将其记录到计算结果cuRetKey的依赖列表上，
            // 以便实例里moduleCompute.YYY or connectedComputed.**.YYY 能够正确收集到实例对YYY的依赖
            setStateKeyRetKeysMap(refCtx, sourceType, FN_CU, stateModule, cuRetKey, collectedDepKeys);

            // 在watch里读取cuVal里的retKey结果, 要将这些retKey对应的stateKeys写到目标cuRetKey的依赖列表上，
            // 以便实例里moduleComputed.YYY or connectedComputed.**.YYY 能够正确收集到实例对YYY的依赖
            setStateKeyRetKeysMap(refCtx, sourceType, FN_CU, stateModule, cuRetKey, collectedCuRetKeys, false);

            const referredByCuRetKeys = cuRetKey_referredByCuRetKeys_[cuRetKey] || [];
            // 被其他cuRetKey引用过，则需要更新它们的依赖
            referredByCuRetKeys.forEach(reCuRetKey => {
              setStateKeyRetKeysMap(refCtx, sourceType, FN_CU, stateModule, reCuRetKey, [cuRetKey], false);
            });
          });
        }

      }
    });

    // 这里一次性处理所有computed函数提交的state
    curStateForComputeFn = getFnCommittedState();
    if (curStateForComputeFn) {
      const assignCuState = (toAssign, judgeEmpty = false) => {
        curStateForComputeFn = toAssign;
        if (judgeEmpty && okeys(toAssign).length === 0) {
          curStateForComputeFn = null;
          return;
        }
        Object.assign(initNewState, curStateForComputeFn);
        Object.assign(initDeltaCommittedState, curStateForComputeFn);
        hasDelta = true;
      }

      // !!! 确保实例里调用commit只能提交privState片段，模块里调用commit只能提交moduleState片段
      // !!! 同时确保privState里的key是事先声明过的，而不是动态添加的
      const stateKeys = sourceType === 'ref' ? refCtx.privStateKeys : moduleName_stateKeys_[stateModule];
      const { partialState, ignoredStateKeys } = extractStateByKeys(curStateForComputeFn, stateKeys, true, true);

      if (partialState) {
        if (fnType === FN_WATCH) {
          const stateKey_retKeys_ = getStateKeyRetKeysMap(refCtx, sourceType, stateModule);
          if (stateKey_retKeys_) {
            // 确保watch函数里调用commit提交的state keys没有出现在computed函数的depKeys里
            // 因为按照先执行computed，再执行watch的顺序，提交了这种stateKey，会造成computed函数返回结果失效了的情况产生
            const ignoredStateKeysAsDepInCu = [], canAssignState = {};
            okeys(partialState).forEach(stateKey => {
              if (stateKey_retKeys_[stateKey]) {
                ignoredStateKeysAsDepInCu.push(stateKey);
              } else {
                canAssignState[stateKey] = partialState[stateKey];
              }
            });

            if (ignoredStateKeysAsDepInCu.length > 0) {
              justWarning(`these state keys[${ignoredStateKeysAsDepInCu.join(',')}] will been ignored, cause they are also appeared in computed depKeys,
              cc suggest you move the logic to computed file.`)
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
        const reason = `they are not ${sourceType === CATE_REF ? 'private' : 'module'}, fn is ${sourceType} ${fnType}`;
        justWarning(`these state keys[${ignoredStateKeys.join(',')}] are invalid, ${reason}`)
      }
    }

    if (whileCount > 10) {
      justWarning('fnCtx.commit may goes endless loop, please check your code');
      curStateForComputeFn = null;
    }
  }

  return { shouldCurrentRefUpdate, hasDelta };
}