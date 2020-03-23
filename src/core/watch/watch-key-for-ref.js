import pickDepFns from '../base/pick-dep-fns';
import findDepFnsToExecute from '../base/find-dep-fns-to-execute';
import { CATE_REF, FN_WATCH } from '../../support/constant';

export default function (ref, stateModule, oldState, committedState, callInfo, isBeforeMount) {
  const refCtx = ref.ctx;
  if (!refCtx.hasWatchFn) return { shouldCurrentRefUpdate: true };

  const deltaCommittedState = Object.assign({}, committedState);

  const { watchDep, module: refModule, ccUniqueKey } = refCtx;
  let computedContainer = refCtx.refComputed;
  if (stateModule !== refModule) {
    // 由changeRefState/broadcastState触发的connectedRefs 触发的watch
    computedContainer = refCtx.connectedComputed[stateModule];
  }

  const newState = Object.assign({}, oldState, committedState);

  const curDepComputedFns = (committedState, isBeforeMount) => pickDepFns(
    isBeforeMount, CATE_REF, FN_WATCH, watchDep, stateModule, oldState, committedState, ccUniqueKey
  );

  // 触发有stateKey依赖列表相关的watch函数
  return findDepFnsToExecute(
    ref, stateModule, refModule, oldState, curDepComputedFns,
    committedState, newState, deltaCommittedState, callInfo, isBeforeMount,
    FN_WATCH, CATE_REF, computedContainer,
  );
}