import ccContext from '../../cc-context';
import { okeys, makeCallInfo } from '../../support/util';
import computeValueForRef from '../computed/compute-value-for-ref';
import watchKeyForRef from '../watch/watch-key-for-ref';

const { store: { getState } } = ccContext;

/** 由首次render触发 */
export default function (ref) {
  const ctx = ref.ctx;
  const { hasComputedFn, hasWatchFn, connect, module: refModule } = ctx;

  const callInfo = makeCallInfo(refModule);
  const connectedModules = okeys(connect);
  const refState = ctx.state;
  if (hasComputedFn) {
    computeValueForRef(ref, refModule, refState, refState, callInfo, true, true);
    connectedModules.forEach(m => {
      const mState = getState(m);
      const tmpCallInfo = makeCallInfo(m);
      computeValueForRef(ref, m, mState, mState, tmpCallInfo, true, true);
    });
  }

  if (hasWatchFn) {
    watchKeyForRef(ref, refModule, refState, refState, callInfo, true, true);
    connectedModules.forEach(m => {
      const mState = getState(m);
      const tmpCallInfo = makeCallInfo(m);
      watchKeyForRef(ref, m, mState, mState, tmpCallInfo, true, true);
    });
  }

}