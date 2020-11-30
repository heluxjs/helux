import pickDepFns from '../base/pick-dep-fns';
import findDepFnsToExecute from '../base/find-dep-fns-to-execute';
import { CATE_REF, FN_CU } from '../../support/constant';

// stateModule表示状态所属的模块
export default function (
  ref, stateModule, oldState, deltaCommittedState, callInfo, isBeforeMount = false, mergeToDelta
) {
  const refCtx = ref.ctx;

  if (!refCtx.hasComputedFn) return { hasDelta: false, newCommittedState: {} };

  const { computedDep, module: refModule, ccUniqueKey, refComputed: computedContainer } = refCtx;
  const newState = Object.assign({}, oldState, deltaCommittedState);

  const curDepComputedFns = (committedState, isBeforeMount) => pickDepFns(
    isBeforeMount, CATE_REF, FN_CU, computedDep, stateModule,
    oldState, committedState, ccUniqueKey);
  // 触发依赖stateKeys相关的computed函数
  return findDepFnsToExecute(
    ref, stateModule, refModule, oldState, curDepComputedFns,
    deltaCommittedState, newState, deltaCommittedState, callInfo, isBeforeMount,
    FN_CU, CATE_REF, computedContainer, mergeToDelta
  );
}
