import {
  makeCommitHandler, okeys, justWarning, makeCuPackedValue,
  safeGet, safeGetArray, noDupPush, isAsyncFn, noop,
} from '../../support/util';
import { FN_WATCH, CATE_REF, FN_CU, CATE_MODULE } from '../../support/constant';
import extractStateByKeys from '../state/extract-state-by-keys';
import pickDepFns from '../base/pick-dep-fns';
import makeCuObState from '../computed/make-cu-ob-state';
import executeAsyncCuInfo from '../computed/execute-async-cu-info';
import { getSimpleObContainer } from '../computed/make-cu-ref-ob-container';
import cuMap from '../../cc-context/computed-map';
import waMap from '../../cc-context/watch-map';
import moduleName_stateKeys_ from '../../cc-context/statekeys-map';
import { makeWaKey } from '../../cc-context/wakey-ukey-map';

const noCommit = (tip, asIs) => justWarning(`${tip} call commit or commitCu as it is ${asIs}`);

// 记录某个cuRetKey引用过哪些staticCuRetKeys
// 直接引用或者间接引用过staticCuRetKey都会记录在列表内
let modCuRetKey_referStaticCuRetKeys_ = {};
let refCuRetKey_referStaticCuRetKeys_ = {};

function getCuRetKeyRSListMap(sourceType, module, ccUniqueKey) {
  if (sourceType == CATE_MODULE) {
    return safeGet(modCuRetKey_referStaticCuRetKeys_, module);
  } else {
    return safeGet(refCuRetKey_referStaticCuRetKeys_, ccUniqueKey);
  }
}

function getCuRetKeyRSList(cuRetKey, sourceType, module, ccUniqueKey) {
  let map = getCuRetKeyRSListMap(sourceType, module, ccUniqueKey);
  return safeGetArray(map, cuRetKey);
}

export function clearCuRefer() {
  modCuRetKey_referStaticCuRetKeys_ = {};
  refCuRetKey_referStaticCuRetKeys_ = {};
}


function getCuDep(refCtx, sourceType) {
  return sourceType === CATE_REF ? refCtx.computedDep : cuMap._computedDep;
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

function getRetKeyFnMap(refCtx, sourceType, stateModule) {
  // 始终从_computedDep 取retKey_fn_，来判断commitCu提交的retKey是否合法
  if (sourceType === CATE_REF) {
    return refCtx.computedRetKeyFns;
  } else {
    let moduleDep = cuMap._computedDep[stateModule] || {};
    return moduleDep.retKey_fn_ || {};
  }
}

function mapRSList(cuRetKey, referCuRetKeys, refCtx, ccUniqueKey, sourceType, stateModule) {
  const cuRetKey_referStaticCuRetKeys_ = getCuRetKeyRSListMap(cuRetKey, sourceType, stateModule, ccUniqueKey);
  const retKey_fn_ = getRetKeyFnMap(refCtx, sourceType, stateModule);
  const referStaticCuRetKeys = safeGetArray(cuRetKey_referStaticCuRetKeys_, cuRetKey);

  referCuRetKeys.forEach(referCuRetKey => {
    const fnDesc = retKey_fn_[referCuRetKey];
    // 直接引用
    if (fnDesc.isStatic) {
      referStaticCuRetKeys.push(referCuRetKey);
    } else {
      const tmpRSList = safeGetArray(cuRetKey_referStaticCuRetKeys_, referCuRetKey);
      // 把引用的referCuRetKey对应的staticCuRetKey列表记录到当前cuRetKey的staticCuRetKey列表记录上
      // 因为computed函数是严格按需执行的，所以此逻辑能够成立
      tmpRSList.forEach(staticCuRetKey => noDupPush(referStaticCuRetKeys, staticCuRetKey));
    }
  });
}

const STOP_FN = Symbol('sf');

// fnType: computed watch
// sourceType: module ref
// initDeltaCommittedState 会在整个过程里收集所有的提交状态
export default function executeDepFns(
  ref = {}, stateModule, refModule, oldState, finder,
  committedState, initNewState, initDeltaCommittedState, callInfo, isFirstCall,
  fnType, sourceType, computedContainer, mergeToDelta = true
) {
  const refCtx = ref.ctx;
  const ccUniqueKey = refCtx ? refCtx.ccUniqueKey : '';

  // while循环结束后，收集到的所有的新增或更新state
  const committedStateInWhile = {};
  const nextTickCuInfo = { sourceType, ref, module: stateModule, fns: [], fnAsync: [], fnRetKeys: [], cuRetContainer: computedContainer };

  let whileCount = 0;
  let curStateForComputeFn = committedState;
  let hasDelta = false;

  while (curStateForComputeFn) {
    whileCount++;
    // 因为beforeMountFlag为true的情况下，finder里调用的pickDepFns会挑出所有函数，
    // 这里必需保证只有第一次循环的时候取isFirstCall的实际值，否则一定取false，（要不然就陷入无限死循环，每一次都是true，每一次都挑出所有dep函数执行）
    const beforeMountFlag = whileCount === 1 ? isFirstCall : false;
    const { pickedFns, setted, changed, retKey_stateKeys_ } = finder(curStateForComputeFn, beforeMountFlag);
    nextTickCuInfo.retKey_stateKeys_ = retKey_stateKeys_;

    if (!pickedFns.length) break;

    const { commit, getFnCommittedState } = makeCommitHandler();
    const { commit: commitCu, getFnCommittedState: getRetKeyCu, clear: clearCu } = makeCommitHandler();

    pickedFns.forEach(({ retKey, fn, depKeys, isLazy }) => {
      const keyInfo = `${sourceType} ${fnType} retKey[${retKey}]`;
      const tip = `${keyInfo} can't`;

      // 异步计算的初始值
      let initialVal = '';
      let isInitialValSetted = false;

      const fnCtx = {
        retKey, callInfo, isFirstCall, commit, commitCu, setted, changed,
        // 在sourceType为module时, 如果非首次计算
        // computedContainer只是一个携带defineProperty的计算结果收集容器，没有收集依赖行为
        cuVal: computedContainer,
        committedState: curStateForComputeFn,
        deltaCommittedState: initDeltaCommittedState,
        stateModule, refModule, oldState, refCtx,
        setInitialVal: () => {
          beforeMountFlag && justWarning(`non async ${keyInfo} call setInitialVal is unnecessary`);
        },
      };

      // 循环里的首次计算且是自动收集状态，注入代理对象，收集计算&观察依赖
      const needCollectDep = beforeMountFlag && depKeys === '-';

      // 用户通过cuVal读取其他计算结果时，记录cuRetKeys，用于辅助下面计算依赖
      const collectedCuRetKeys = [];
      // 读取newState时，记录stateKeys，用于辅助下面计算依赖
      const collectedDepKeys = [];

      // 对于computed，首次计算时会替换为obContainer用于收集依赖
      // !!!对于watch，immediate为true才有机会替换为obContainer收集到依赖
      const referInfo = { hasAsyncCuRefer: false };
      if (needCollectDep) {
        // 替换cuVal，以便动态的收集到computed&watch函数里读取cuVal时计算相关依赖
        fnCtx.cuVal = getSimpleObContainer(retKey, sourceType, fnType, stateModule, refCtx, collectedCuRetKeys, referInfo);
      }

      if (fnType === FN_CU) {
        const isCuFnAsync = isAsyncFn(fn);

        if (isLazy || isCuFnAsync) {
          // lazyComputed 和 asyncComputed 不能调用commit commitCu，以隔绝副作用
          const asIs = isLazy ? 'lazy' : 'async computed';
          fnCtx.commit = () => noCommit(tip, asIs);
          fnCtx.commitCu = fnCtx.commit;
          if (isCuFnAsync) fnCtx.setInitialVal = val => {
            initialVal = val;
            isInitialValSetted = true;
            // 这里阻止异步计算函数的首次执行，交给executeAsyncCuInfo去触发
            if (beforeMountFlag) throw STOP_FN;
          }
        }

        if (isLazy) {
          computedContainer[retKey] = makeCuPackedValue(isLazy, null, true, fn, initNewState, oldState, fnCtx);
        } else {
          let newStateArg = initNewState, oldStateArg = oldState;

          // 首次计算时，new 和 old是同一个对象，方便用于收集depKeys
          if (needCollectDep) {
            newStateArg = oldStateArg = makeCuObState(initNewState, collectedDepKeys);
          }

          let computedRet;
          // 异步函数首次执行时才去调用它，仅为了收集依赖
          if (isCuFnAsync) {
            if (beforeMountFlag) {
              fn(newStateArg, oldStateArg, fnCtx).catch(err => {
                if (err !== STOP_FN) throw err;
              })
            }
          } else {
            computedRet = fn(newStateArg, oldStateArg, fnCtx);
          }

          if (isCuFnAsync || referInfo.hasAsyncCuRefer) {
            // 首次计算时需要赋初始化值
            if (beforeMountFlag) {
              if (!isInitialValSetted) {
                throw new Error(`async ${keyInfo} forget call setInitialVal`);
              }
              computedRet = initialVal;
            }
            // 不做任何新的计算，还是赋值原来的结果
            // 新的结果等待 asyncComputedMgr 来计算并触发相关实例重渲染
            else computedRet = computedContainer[retKey];

            // 替换掉setInitialVal，使其失效
            fnCtx.setInitialVal = noop;
            fnCtx.commit = () => noCommit(tip, 'async computed or it refers async computed ret');
            fnCtx.commitCu = fnCtx.commit;

            //安排到nextTickCuInfo里，while结束后单独触发它们挨个按需计算
            nextTickCuInfo.fns.push(() => fn(newStateArg, oldStateArg, fnCtx));
            nextTickCuInfo.fnAsync.push(isCuFnAsync);
            nextTickCuInfo.fnRetKeys.push(retKey);
          }

          // 记录计算结果
          computedContainer[retKey] = makeCuPackedValue(false, computedRet);

          if (needCollectDep) {
            // 在computed函数里读取了newState的stateKey，需要将其记录到当前retKey的依赖列表上
            // 以便能够在相应stateKey值改变时，能够正确命中该computed函数
            setStateKeyRetKeysMap(refCtx, sourceType, FN_CU, stateModule, retKey, collectedDepKeys);

            // 在computed里读取cuVal里的其他retKey结果, 要将其他retKey对应的stateKeys写到当前retKey的依赖列表上，
            // 以便能够在相应stateKey值改变时，能够正确命中该computed函数
            setStateKeyRetKeysMap(refCtx, sourceType, FN_CU, stateModule, retKey, collectedCuRetKeys, false);

            mapRSList(retKey, collectedCuRetKeys, refCtx, ccUniqueKey, sourceType, stateModule);
          }
        }

      } else {// watch
        let tmpInitNewState = initNewState;
        let tmpOldState = oldState;

        // 首次触发watch时，才传递ob对象，用于收集依赖
        if (needCollectDep) {
          tmpInitNewState = makeCuObState(initNewState, collectedDepKeys);
          //new 和 old是同一个对象，方便用于收集depKeys
          tmpOldState = tmpInitNewState;
        }

        fn(tmpInitNewState, tmpOldState, fnCtx);

        // 首次触发watch时, 才记录依赖
        if (needCollectDep) {
          // 在watch函数里读取了newState的stateKey，需要将其记录到当前watch retKey的依赖列表上
          // 以便能够在相应stateKey值改变时，能够正确命中该watch函数
          setStateKeyRetKeysMap(refCtx, sourceType, FN_WATCH, stateModule, retKey, collectedDepKeys);
          // 在watch里读取了cuVal里的retKey结果，要将这些retKey对应的stateKey依赖附加到当前watch retKey的依赖列表上，
          // 以便能够在相应stateKey值改变时，能够正确命中该watch函数
          setStateKeyRetKeysMap(refCtx, sourceType, FN_WATCH, stateModule, retKey, collectedCuRetKeys, false);
        }
      }


      // refCompute&refWatch 里获取state、moduleState、connectedState的值收集到的depKeys要记录为ref的静态依赖
      if (needCollectDep && sourceType === CATE_REF) {
        collectedDepKeys.forEach(key => refCtx.__$$staticWaKeys[makeWaKey(stateModule, key)] = 1);
        // 注：refWatch直接读取了moduleComputed 或者 connectedComputed的值时也收集到了依赖
        // 逻辑在updateDep里判断__$$isBM来确定是不是首次触发
      }

      // computedContainer对于module computed fn里调用committedCu，是moduleComputed结果容器，
      // 对于ref computed fn里调用committedCu来说，是refComputed结果容器
      // 每一个retKey返回的committedCu都及时处理掉，因为下面setStateKeyRetKeysMap需要对此时的retKey写依赖
      const committedCuRet = getRetKeyCu();

      if (committedCuRet) {
        const retKey_fn_ = getRetKeyFnMap(refCtx, sourceType, stateModule);

        okeys(committedCuRet).forEach(cuRetKey => {
          // 模块计算函数里调用commitCu只能修改模块计算retKey
          // 实例计算函数里调用commitCu只能修改实例计算retKey

          const fnDesc = retKey_fn_[cuRetKey];
          if (!fnDesc) justWarning(`commitCu:${tip} commit [${cuRetKey}], it is not defined`);
          // 由committedCu提交的值，可以统一当作非lazy值set回去，方便取的时候直接取
          else {
            // 检查提交目标只能是静态的cuRetKey
            if (fnDesc.isStatic) {
              const RSList = getCuRetKeyRSList(cuRetKey, sourceType, stateModule, ccUniqueKey);
              if (RSList.includes(cuRetKey)) {
                // 直接或间接引用了这个cuRetKey，就不能去改变它，以避免死循环
                justWarning(`commitCu:${tip} change [${cuRetKey}], [${retKey}] referred [${cuRetKey}]`);
              } else {
                computedContainer[cuRetKey] = makeCuPackedValue(false, committedCuRet[cuRetKey]);
              }
            } else {
              justWarning(`commitCu:${tip} change [${cuRetKey}], it must have zero dep keys`);
            }
          }
        });

        clearCu();
      }

    });

    // 这里一次性处理所有computed or watch函数提交了然后合并后的state
    curStateForComputeFn = getFnCommittedState();

    if (curStateForComputeFn) {
      // toAssign may be null
      const assignCuState = (toAssign, mergeAssign = false) => {
        // 确保finder函数只针对这一部分新提交的状态去触发computed or watch
        if (mergeAssign) Object.assign(curStateForComputeFn, toAssign);
        else curStateForComputeFn = toAssign;

        if (!curStateForComputeFn) return;
        Object.assign(committedStateInWhile, curStateForComputeFn);

        if (mergeToDelta) {
          Object.assign(initNewState, curStateForComputeFn);
          Object.assign(initDeltaCommittedState, curStateForComputeFn);
        } else {
          // 强行置为null，结束while循环  
          // mergeToDelta为false表示这是来自connectedRefs触发的 cu 或者 wa 函数
          // 此时传入的 initDeltaCommittedState 是模块state
          // 但是实例里 cu 或 wa 函数只能commit private state
          // 收集到 committedStateInWhile 后，在外面单独触发新的 computedForRef watchForRef过程
          curStateForComputeFn = null;
        }

        hasDelta = true;
      }

      const ensureCommittedState = (fnCommittedState) => {
        // !!! 确保实例里调用commit只能提交privState片段，模块里调用commit只能提交moduleState片段
        // !!! 同时确保privState里的key是事先声明过的，而不是动态添加的
        const stateKeys = sourceType === 'ref' ? refCtx.privStateKeys : moduleName_stateKeys_[stateModule];
        const { partialState, ignoredStateKeys } = extractStateByKeys(fnCommittedState, stateKeys, true);

        if (ignoredStateKeys.length) {
          const reason = `they are not ${sourceType === CATE_REF ? 'private' : 'module'}, fn is ${sourceType} ${fnType}`;
          justWarning(`these state keys[${ignoredStateKeys.join(',')}] are invalid, ${reason}`)
        }
        return partialState;// 返回合法的提交状态
      }

      const partialState = ensureCommittedState(curStateForComputeFn);
      if (partialState) {
        assignCuState(partialState);

        // watch里提交了新的片段state，再次过一遍computed、watch函数
        if (fnType === FN_WATCH) {
          // const stateKey_retKeys_ = getStateKeyRetKeysMap(refCtx, sourceType, stateModule);
          const computedDep = getCuDep(refCtx, sourceType, stateModule);

          const finder = (committedState, isBeforeMount) => pickDepFns(
            isBeforeMount, sourceType, FN_CU, computedDep, stateModule,
            oldState, committedState, ccUniqueKey
          );

          // 一轮watch函数执行结束，去触发对应的computed计算
          const { hasDelta, newCommittedState } = executeDepFns(
            ref, stateModule, refModule, oldState, finder,
            partialState, initNewState, initDeltaCommittedState, callInfo,
            false, // 再次由watch发起的computed函数查找调用，irFirstCall，一定是false
            FN_CU, sourceType, computedContainer
          );

          if (hasDelta) {
            // see https://codesandbox.io/s/complex-cu-watch-chain-s9wzt, 
            // 输入 cc.setState('test', {k1:Date.now()})，确保k4 watch被触发
            const validCommittedState = ensureCommittedState(newCommittedState);
            // 让validCommittedState合并到curStateForComputeFn里，确保下一轮循环相关watch能被computed里提交的状态触发
            assignCuState(validCommittedState, true);
          }
        }

      }
    }

    if (whileCount > 2) {
      justWarning('fnCtx.commit may goes endless loop, please check your code');
      // 清空，确保不再触发while循环
      curStateForComputeFn = null;
    }
  }

  executeAsyncCuInfo(nextTickCuInfo);

  return { hasDelta, newCommittedState: committedStateInWhile };
}