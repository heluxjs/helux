import ccContext from '../../cc-context';
import { okeys } from '../../support/util';
import computeValueForRef from '../computed/compute-value-for-ref';
import watchKeyForRef from '../watch/watch-key-for-ref';

const { store: { getState } } = ccContext;

/** 由首次render触发 */
export default function (ref) {
  const  ctx = ref.ctx;
  const { hasComputedFn, hasWatchFn, immediateWatchKeys, connect, module: refModule } = ctx;

  const refState = ctx.state;
  if (hasComputedFn) {
    computeValueForRef(ctx, refModule, refState, refState);
    okeys(connect).forEach(m => {
      const mState = getState(m);
      computeValueForRef(ctx, m, mState, mState);
    });
  }

  if (hasWatchFn) {
    if (immediateWatchKeys.length > 0) {
      const module_state_ = {};
      immediateWatchKeys.forEach(key => {
        let targetModule;
        if (key.includes('/')) {
          const [module] = key.split('/');
          targetModule = module || refModule;// key: 'foo/f1' or '/f1'
        } else {
          targetModule = refModule;
        }

        const state = targetModule === refModule ? refState : getState(targetModule);
        module_state_[targetModule] = state;
      });

      okeys(module_state_).forEach(m => {
        const state = module_state_[m];
        watchKeyForRef(ctx, m, state, state, true);
      });
    }
  }
  
}