import { executeCompOrWatch, makeCommitHandler } from '../../support/util';

export default (
  refCtx, stateModule, refModule, oldState, finder,
  toComputedState, initNewState, initDeltaCommittedState, callInfo, isFirstCall,
  fnType, sourceType, computedContainer, refConnectedComputed,
) => {
  let whileCount = 0;
  let initComputedState = toComputedState;
  let shouldCurrentRefUpdate = true;

  while (initComputedState) {
    whileCount++;
    // 因为beforeMountFlag为true的情况下，finder里调用的pickDepFns会挑出所有函数，
    // 这里必需保证只有第一次循环的时候取isFirstCall的实际值，否则一定取false，（要不然就陷入无限死循环，每一次都是true，每一次都挑出所有dep函数执行）
    const beforeMountFlag = whileCount === 1 ? isFirstCall : false;
    const { pickedFns, setted, changed } = finder(initComputedState, beforeMountFlag);
    if (!pickedFns.length) break;

    const { commit, getFnCommittedState } = makeCommitHandler();
    pickedFns.forEach(({ retKey, fn, depKeys }) => {
      const fnCtx = { retKey, callInfo, isFirstCall, commit, setted, changed, stateModule, refModule, oldState, committedState: initComputedState, refCtx };
      const computedValueOrRet = executeCompOrWatch(retKey, depKeys, fn, initNewState, oldState, fnCtx);

      if (fnType === 'computed') {
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
    if (whileCount > 10) throw new Error('fnCtx.commit may goes endless loop, please check your code');
  }

  return shouldCurrentRefUpdate;
}