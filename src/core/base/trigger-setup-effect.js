import ccContext from '../../cc-context';
import * as util from '../../support/util';

const {
  moduleName_stateKeys_, 
  store: { getPrevState, getState }
} = ccContext;

export default function (ref, callByDidMount) {
  const ctx = ref.ctx;
  const { effectItems, eid_effectReturnCb_ } = ctx.effectMeta;

  if (callByDidMount) {
    effectItems.forEach(item => {
      if (item.immediate === false) return;
      const cb = item.fn(ctx);
      if (cb) eid_effectReturnCb_[item.eId] = cb;
    });
  } else {//callByDidUpdate
    const prevState = ctx.prevState;
    const curState = ref.state;
    const toBeExecutedFns = [];
    effectItems.forEach(item => {
      // const { status, stateKeys, fn, eId } = item;
      // if (status === EFFECT_STOPPED) return;

      // todo, 优化为effectDep模式, 利用differStateKeys去命中执行函数

      const { stateKeys, fn, eId } = item;
      if (stateKeys) {
        const keysLen = stateKeys.length;
        if (keysLen === 0) return;
        let shouldEffectExecute = false;
        for (let i = 0; i < keysLen; i++) {
          const key = stateKeys[i];
          let targetCurState, targetPrevState, targetKey;
          if (key.includes('/')) {
            const [module, unmoduledKey] = key.split('/');
            const prevState = getPrevState(module);
            if (!prevState) {
              util.justWarning(`key[${key}] is invalid, its module[${module}] has not been declared in store!`);
              continue;
            }
            if (!moduleName_stateKeys_[module].includes(unmoduledKey)) {
              util.justWarning(`key[${key}] is invalid, its unmoduledKey[${unmoduledKey}] has not been declared in state!`);
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
      const cb = fn(ctx);
      if (cb) eid_effectReturnCb_[eId] = cb;
    });
  }
}