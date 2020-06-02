import ccContext from '../../cc-context';
import { makeCallInfo } from '../../support/util';
import computeValueForRef from '../computed/compute-value-for-ref';
import watchKeyForRef from '../watch/watch-key-for-ref';

const { store: { getState } } = ccContext;

/** 由首次render触发, 在beforeMount里调用 */
export default function (ref) {
  const ctx = ref.ctx;

  // 取原始对象，防止computeValueForRef里用Object.assign触发依赖收集
  // 首次挂载组件时，prevState是原始对象，state可能是代理过的对象
  const { hasComputedFn, hasWatchFn, connectedModules, module: refModule, state: refState } = ctx;

  const callInfo = makeCallInfo(refModule);

  const cuOrWatch = (op) => {
    op(ref, refModule, refState, refState, callInfo, true);
    connectedModules.forEach(m => {
      const mState = getState(m);
      const tmpCallInfo = makeCallInfo(m);
      op(ref, m, mState, mState, tmpCallInfo, true);
    });
  }

  if (hasComputedFn) cuOrWatch(computeValueForRef);
  if (hasWatchFn) cuOrWatch(watchKeyForRef);
}
