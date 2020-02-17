import { makeCommitHandler, okeys, justWarning } from '../../support/util';
import moduleName_stateKeys_ from '../../cc-context/statekeys-map';
import cuMap from '../../cc-context/computed-map';

function setComputedVal(sourceType, refModule, stateModule, computedContainer, refConnectedComputed, retKey, computedValueOrRet) {
  if (sourceType === 'ref') {
    if (refModule === stateModule) {
      computedContainer[retKey] = computedValueOrRet;
    }

    // 意味着用户必须将组建connect到此模块，computed&watch里模块定义才有效果
    const targetComputed = refConnectedComputed[stateModule];
    if (targetComputed) {
      targetComputed[retKey] = computedValueOrRet;
    }
  } else {
    computedContainer[retKey] = computedValueOrRet;
  }
}


export default (
  refCtx, stateModule, refModule, oldState, finder,
  toComputedState, initNewState, initDeltaCommittedState, callInfo, isFirstCall,
  fnType, sourceType, computedContainer, refConnectedComputed,
) => {
  let whileCount = 0;
  let initComputedState = toComputedState;
  let shouldCurrentRefUpdate = true;
  const stateKeys = moduleName_stateKeys_[stateModule];

  // commitCu提交的结果是存到moduleComputed里的，所以这里从_computedDep取retKey_fn_
  const _computedDep = cuMap.getRootComputedDep();
  const _computedValue = cuMap.getRootComputedValue();
  const moduleCuDep = _computedDep[stateModule];
  const moduleCuContainer = _computedValue[stateModule];

  while (initComputedState) {
    whileCount++;
    // 因为beforeMountFlag为true的情况下，finder里调用的pickDepFns会挑出所有函数，
    // 这里必需保证只有第一次循环的时候取isFirstCall的实际值，否则一定取false，（要不然就陷入无限死循环，每一次都是true，每一次都挑出所有dep函数执行）
    const beforeMountFlag = whileCount === 1 ? isFirstCall : false;
    const { pickedFns, setted, changed } = finder(initComputedState, beforeMountFlag);
    if (!pickedFns.length) break;

    const { commit, getFnCommittedState } = makeCommitHandler();
    const { commit: commitCu, getFnCommittedState: getFinalCu } = makeCommitHandler();
    pickedFns.forEach(({ retKey, fn }) => {
      const fnCtx = { retKey, callInfo, isFirstCall, commit, commitCu, setted, changed, stateModule, refModule, oldState, committedState: initComputedState, refCtx };
      const computedValueOrRet = fn(initNewState, oldState, fnCtx);

      if (fnType === 'computed') {
        setComputedVal(sourceType, refModule, stateModule, computedContainer, refConnectedComputed, retKey, computedValueOrRet);
      } else {// watch
        //实例里只要有一个watch函数返回false，就会阻碍当前实例的ui被更新
        if (computedValueOrRet === false) shouldCurrentRefUpdate = false;
      }
    });

    initComputedState = getFnCommittedState();
    if (initComputedState) {
      Object.assign(initNewState, initComputedState);
      Object.assign(initDeltaCommittedState, initComputedState);
    }

    const committedCu = getFinalCu();
    if (moduleCuDep && committedCu) {
      const { retKey_fn_ = {} } = moduleCuDep;
      okeys(committedCu).forEach(retKey => {
        if (!retKey_fn_[retKey]) justWarning(`fnCtx.commitCu commit an invalid retKey[${retKey}]`);
        else setComputedVal(sourceType, refModule, stateModule, moduleCuContainer, refConnectedComputed, retKey, committedCu[retKey])
      })
    }

    if (whileCount > 10) throw new Error('fnCtx.commit may goes endless loop, please check your code');
  }

  return shouldCurrentRefUpdate;
}