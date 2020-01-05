import ccContext from '../../cc-context';
import { okeys } from '../../support/util';
import computeValueForRef from '../computed/compute-value-for-ref';
import watchKeyForRef from '../watch/watch-key-for-ref';

const { store: { getState } } = ccContext;

const callInfo = { payload: null, renderKey: '', delay: -1 };

/** 由首次render触发 */
export default function (ref) {
  const ctx = ref.ctx;
  const { hasComputedFn, hasWatchFn, connect, module: refModule } = ctx;

  const connectedModules = okeys(connect);
  const refState = ctx.state;
  if (hasComputedFn) {
    computeValueForRef(ctx, refModule, refState, refState, callInfo, true, true);
    connectedModules.forEach(m => {
      const mState = getState(m);
      computeValueForRef(ctx, m, mState, mState, callInfo, true, true);
    });
  }

  if (hasWatchFn) {
    watchKeyForRef(ctx, refModule, refState, refState, callInfo, true, true);
    connectedModules.forEach(m => {
      const mState = getState(m);
      watchKeyForRef(ctx, m, mState, mState, callInfo, true, true);
    });
  }

}