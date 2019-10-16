import ccContext from '../../cc-context';
import * as util from '../../support/util';

const {
  moduleName_stateKeys_, 
  store: { getPrevState, getState }
} = ccContext;

const frag1 = 'has not been declared in';

export default function (ref, callByDidMount) {
  const ctx = ref.ctx;
  const { effectItems, eid_effectReturnCb_ } = ctx.effectMeta;

  if (callByDidMount) {
    effectItems.forEach(item => {
      if (item.immediate === false) return;
      const cb = item.fn(ctx, true);// set true flag isDidMount = true
      if (cb) eid_effectReturnCb_[item.eId] = cb;
    });
  } else {//callByDidUpdate
    const prevState = ctx.prevState;
    const curState = ref.state;
    const toBeExecutedFns = [];
    effectItems.forEach(item => {
      // const { status, depKeys, fn, eId } = item;
      // if (status === EFFECT_STOPPED) return;

      // todo, 优化为effectDep模式, 利用differStateKeys去命中执行函数

      const { depKeys, fn, eId } = item;
      if (depKeys) {
        const keysLen = depKeys.length;
        if (keysLen === 0) return;
        let shouldEffectExecute = false;
        for (let i = 0; i < keysLen; i++) {
          const key = depKeys[i];
          let targetCurState, targetPrevState, targetKey;
          if (key.includes('/')) {
            const [module, unmoduledKey] = key.split('/');
            const prevState = getPrevState(module);
            if (!prevState) {
              util.justWarning(`effect: key[${key}] is invalid, its module[${module}] ${frag1} store!`);
              continue;
            }
            if (!moduleName_stateKeys_[module].includes(unmoduledKey)) {
              util.justWarning(`effect: key[${key}] is invalid, its unmoduledKey[${unmoduledKey}] ${frag1} state!`);
              continue;
            }
            targetCurState = getState(module);
            targetPrevState = prevState;
            targetKey = unmoduledKey;
          } else {
            targetCurState = curState;
            targetPrevState = prevState;
            targetKey = key;
          }

          if (targetPrevState[targetKey] !== targetCurState[targetKey]) {
            shouldEffectExecute = true;
            break;
          }
        }
        if (shouldEffectExecute) {
          toBeExecutedFns.push({ fn, eId });
        }
      } else {
        toBeExecutedFns.push({ fn, eId });
      }
    });

    toBeExecutedFns.forEach(item => {
      const { fn, eId } = item;
      const cb = fn(ctx, false);// set false flag isDidMount = false, means effect triggered in didUpdate period
      if (cb) eid_effectReturnCb_[eId] = cb;
    });
  }
}