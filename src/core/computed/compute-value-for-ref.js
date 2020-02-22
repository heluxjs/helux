import pickDepFns from '../base/pick-dep-fns';
import findDepFnsToExecute from '../base/find-dep-fns-to-execute';
import { CATE_REF } from '../../support/constant';

//CcFragment实例调用会提供callerCtx
// stateModule表示状态所属的模块
export default function (refCtx, stateModule, oldState, committedState, callInfo, isBeforeMount = false, autoMergeDeltaToCommitted = false) {
  const deltaCommittedState = Object.assign({}, committedState);

  if (!refCtx.hasComputedFn) return deltaCommittedState;
  const { computedDep, module: refModule, refComputed, ccUniqueKey } = refCtx;
  // const moduleState = ccContext.store.getState(stateModule);
  const newState = Object.assign({}, oldState, committedState);

  const curDepComputedFns = (committedState, isBeforeMount) => pickDepFns(isBeforeMount, CATE_REF, 'computed', computedDep, stateModule, oldState, committedState, ccUniqueKey);
  // 触发依赖stateKeys相关的computed函数
  findDepFnsToExecute(
    refCtx, stateModule, refModule, oldState, curDepComputedFns,
    committedState, newState, deltaCommittedState, callInfo, isBeforeMount,
    'computed', CATE_REF, refComputed,
  );

  if (autoMergeDeltaToCommitted) {
    Object.assign(committedState, deltaCommittedState);
  }

  return deltaCommittedState;
}