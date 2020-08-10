import pickDepFns from '../base/pick-dep-fns';
import findDepFnsToExecute from '../base/find-dep-fns-to-execute';
import { CATE_REF, FN_WATCH } from '../../support/constant';

// deltaCommittedState 是computed透传的变量引用，用于继续收集可能新增或者更新的状态
export default function (ref, stateModule, oldState, deltaCommittedState, callInfo, isBeforeMount = false, mergeToDelta) {
  const refCtx = ref.ctx;
  if (!refCtx.hasWatchFn) return { hasDelta: false, newCommittedState: {} };

  const newState = Object.assign({}, oldState, deltaCommittedState);

  const { watchDep, module: refModule, ccUniqueKey } = refCtx;
  let computedContainer = refCtx.refComputed;
  if (stateModule !== refModule) {
    // 由changeRefState/broadcastState触发的connectedRefs 触发的watch
    computedContainer = refCtx.connectedComputed[stateModule];
  }

  const curDepWatchFns = (committedState, isBeforeMount) => pickDepFns(
    isBeforeMount, CATE_REF, FN_WATCH, watchDep, stateModule, oldState, committedState, ccUniqueKey
  );

  // 触发有stateKey依赖列表相关的watch函数
  const { hasDelta } = findDepFnsToExecute(
    ref, stateModule, refModule, oldState, curDepWatchFns,
    deltaCommittedState, newState, deltaCommittedState, callInfo, isBeforeMount,
    FN_WATCH, CATE_REF, computedContainer, mergeToDelta,
  );

  return { hasDelta };
}
