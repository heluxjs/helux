import { makeCommitHandler, okeys, justWarning, makeCuObValue } from '../../support/util';
import { FN_WATCH, CATE_REF } from '../../support/constant';
import extractStateByKeys from '../state/extract-state-by-keys';
import cuMap from '../../cc-context/computed-map';
import moduleName_stateKeys_ from '../../cc-context/statekeys-map';
import runtimeVar from '../../cc-context/runtime-var';

function getCuWaParams(retKey, depKeys, newState, oldState) {
  if (runtimeVar.alwaysGiveState) {
    return [newState, oldState];
  } else {
    const firstDepKey = depKeys[0];
    if (depKeys.length === 1 && firstDepKey !== '*' && firstDepKey === retKey) {
      return [newState[firstDepKey], oldState[firstDepKey]];
    } else {
      return [newState, oldState];
    }
  }
}

export function executeCuOrWatch(retKey, depKeys, fn, newState, oldState, fnCtx) {
  const [n, o] = getCuWaParams(retKey, depKeys, newState, oldState);
  return fn(n, o, fnCtx);
}

// fnType: computed watch
// sourceType: module ref
export default (
  refCtx, stateModule, refModule, oldState, finder,
  toBeComputedState, initNewState, initDeltaCommittedState, callInfo, isFirstCall,
  fnType, sourceType, computedContainer,
) => {
  let whileCount = 0;
  let curToBeComputedState = toBeComputedState;
  let shouldCurrentRefUpdate = true;
  let hasDelta = false;

  while (curToBeComputedState) {
    whileCount++;
    // 因为beforeMountFlag为true的情况下，finder里调用的pickDepFns会挑出所有函数，
    // 这里必需保证只有第一次循环的时候取isFirstCall的实际值，否则一定取false，（要不然就陷入无限死循环，每一次都是true，每一次都挑出所有dep函数执行）
    const beforeMountFlag = whileCount === 1 ? isFirstCall : false;
    const { pickedFns, setted, changed } = finder(curToBeComputedState, beforeMountFlag);
    if (!pickedFns.length) break;

    const { commit, getFnCommittedState } = makeCommitHandler();
    const { commit: commitCu, getFnCommittedState: getFinalCu } = makeCommitHandler();
    pickedFns.forEach(({ retKey, fn, depKeys, isLazy }) => {
      const fnCtx = {
        retKey, callInfo, isFirstCall, commit, commitCu, setted, changed,
        stateModule, refModule, oldState, committedState: curToBeComputedState, refCtx
      };
      
      if (fnType === 'computed') {
        if(isLazy){
          // lazyComputed 不再暴露这两个接口，以隔绝副作用
          delete fnCtx.commit;
          delete fnCtx.commitCu;
          const [n, o] = getCuWaParams(retKey, depKeys, initNewState, oldState);
          computedContainer[retKey] = makeCuObValue(isLazy, null, true, fn, n, o, fnCtx);
        }else{
          const computedValueOrRet = executeCuOrWatch(retKey, depKeys, fn, initNewState, oldState, fnCtx);
          // computedContainer[retKey] = computedValueOrRet;
          computedContainer[retKey] = makeCuObValue(false, computedValueOrRet);
        }
      } else {// watch
        const computedValueOrRet = executeCuOrWatch(retKey, depKeys, fn, initNewState, oldState, fnCtx);
        //实例里只要有一个watch函数返回false，就会阻碍当前实例的ui被更新
        if (computedValueOrRet === false) shouldCurrentRefUpdate = false;
      }
    });

    curToBeComputedState = getFnCommittedState();
    if (curToBeComputedState) {
      const assignCuState = (toAssign, judgeEmpty = false) => {
        curToBeComputedState = toAssign;
        if (judgeEmpty && okeys(toAssign).length === 0) {
          curToBeComputedState = null;
          return;
        }
        Object.assign(initNewState, curToBeComputedState);
        Object.assign(initDeltaCommittedState, curToBeComputedState);
        hasDelta = true;
      }

      // !!! 确保实例里调用commit只能提交privState片段，模块里调用commit只能提交moduleState片段
      // !!! 同时确保privState里的key是事先声明过的，而不是动态添加的
      const stateKeys = sourceType === 'ref' ? refCtx.privStateKeys : moduleName_stateKeys_[stateModule];
      const { partialState, ignoredStateKeys } = extractStateByKeys(curToBeComputedState, stateKeys, true, true);

      if (partialState) {
        if (fnType === FN_WATCH) {
          let modDep;
          if (sourceType === CATE_REF) {
            modDep = refCtx.computedDep[refCtx.module] || {};
          } else {
            modDep = cuMap._computedDep[stateModule] || {};
          }
          const { stateKey_retKeys_ } = modDep;

          if (stateKey_retKeys_) {
            // 确保watch函数里调用commit提交的state keys没有出现在computed函数的depKeys里
            // 因为按照先执行computed，再执行watch的顺序，提交了这种stateKey，会照成computed函数返回结果过失的情况产生
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

    // computedContainer对于模块里的computed回调里调用committedCu，是moduleComputed结果容器，
    // 对于实例里的computed回调里调用committedCu来说，是refComputed结果容器
    const committedCu = getFinalCu();
    if (committedCu) {
      let retKey_fn_;
      if (sourceType === 'ref') {
        retKey_fn_ = fnType === 'computed' ? refCtx.computedRetKeyFns : refCtx.watchRetKeyFns;
      } else {
        // commitCu提交的结果是存到moduleComputed里的，所以这里从始终从_computedDep 取retKey_fn_，来判断commitCu提交的retKey是否合法
        let moduleDep = cuMap.getRootComputedDep()[stateModule] || {};
        retKey_fn_ = moduleDep.retKey_fn_ || null;
      }

      if (retKey_fn_) {
        okeys(committedCu).forEach(retKey => {
          if (!retKey_fn_[retKey]) justWarning(`fnCtx.commitCu commit an invalid retKey[${retKey}] for moduleComputed`);
          // 由committedCu提交的值，可以统一当作非lazy值set回去，方便取的时候直接取
          else computedContainer[retKey] = makeCuObValue(false, committedCu[retKey]);;
        });
      }
    }

    if (whileCount > 10) throw new Error('fnCtx.commit may goes endless loop, please check your code');
  }

  return { shouldCurrentRefUpdate, hasDelta };
}