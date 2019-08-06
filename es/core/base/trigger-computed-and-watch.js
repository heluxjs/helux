import ccContext from '../../cc-context';
import { safeGetObjectFromObject, okeys } from '../../support/util';
import computeValueForRef from '../computed/compute-value-for-ref';
import watchKeyForRef from '../watch/watch-key-for-ref';

const { store: { getState } } = ccContext;

/** 由首次render触发 */
export default function (ref) {
  const  ctx = ref.ctx;
  const { computedSpec, watchSpec, connect, module: refModule } = ctx;

  if (computedSpec.hasFn) {
    const refState = ref.state;
    computeValueForRef(ctx, refModule, refState, refState);
    okeys(connect).forEach(m => {
      const mState = getState(m);
      computeValueForRef(ctx, m, mState, mState);
    });
  }

  if (watchSpec.hasFn) {
    const { immediateWatchKeys } = watchSpec;
    if (immediateWatchKeys.length > 0) {
      const module_stateSpec_ = {};
      immediateWatchKeys.forEach(key => {
        let targetModule, targetStateKey;
        if (key.includes('/')) {
          const [module, stateKey] = key.split('/');
          targetModule = module || refModule;// key: 'foo/f1' or '/f1'
          targetStateKey = stateKey;
        } else {
          targetModule = refModule;
          targetStateKey = key;
        }
        const stateSpec = safeGetObjectFromObject(module_stateSpec_, targetModule, { state: {}, module: targetModule });
        stateSpec.state[targetStateKey] = getState(targetModule)[targetStateKey];
      });

      Object.values(module_stateSpec_).forEach(stateSpec => {
        const { module, state } = stateSpec;
        watchKeyForRef(ctx, module, getState(module), state);
      });
    }
  }
}