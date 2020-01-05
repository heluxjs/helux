import pickDepFns from '../base/pick-dep-fns';
import findDepFnsToExecute from '../base/find-dep-fns-to-execute';

export default function (refCtx, stateModule, oldState, committedState, callInfo, isBeforeMount, autoMergeDeltaToCommitted = false) {

  if (!refCtx.hasWatchFn) return true;

  const deltaCommittedState = Object.assign({}, committedState);
  const { watchDep, module: refModule, ccUniqueKey } = refCtx;
  const newState = Object.assign({}, oldState, committedState);

  const curDepComputedFns = (committedState, isBeforeMount) => pickDepFns(isBeforeMount, 'ref', 'watch', watchDep, stateModule, oldState, committedState, ccUniqueKey);
  // 触发有stateKey依赖列表相关的watch函数
  const shouldCurrentRefUpdate = findDepFnsToExecute(
    refCtx, stateModule, refModule, oldState, curDepComputedFns,
    committedState, newState, deltaCommittedState, callInfo, isBeforeMount,
  );

  if (autoMergeDeltaToCommitted) {
    Object.assign(committedState, deltaCommittedState);
  }

  return shouldCurrentRefUpdate;
}