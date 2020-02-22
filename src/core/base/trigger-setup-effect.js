import ccContext from '../../cc-context';
import * as util from '../../support/util';

const {
  moduleName_stateKeys_, 
  store: { getPrevState, getState, getStateVer }
} = ccContext;

const warn = (key, frag) => util.justWarning(`effect: key[${key}] is invalid, its ${frag} has not been declared in' store!`);

export default function (ref, callByDidMount) {
  const ctx = ref.ctx;
  const {
    effectItems, eid_effectReturnCb_, effectPropsItems, eid_effectPropsReturnCb_,
  } = ctx.effectMeta;
  const { prevModuleStateVer } = ctx;

  const makeItemHandler = (eid_cleanCb_, isDidMount, needJudgeImmediate) => item => {
    const { fn, eId, immediate } = item;
    if (needJudgeImmediate) {
      if (immediate === false) return;
    }
    const cb = fn(ctx, isDidMount);
    if (cb) eid_cleanCb_[eId] = cb;
  };

  if (callByDidMount) {
    // flag isDidMount as true
    effectItems.forEach(makeItemHandler(eid_effectReturnCb_, true, true));
    effectPropsItems.forEach(makeItemHandler(eid_effectPropsReturnCb_, true, true));
  } else {// callByDidUpdate

    // start handle effect meta data of state keys
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
            const moduleStateVer = getStateVer(module);

            if (prevModuleStateVer[unmoduledKey] === moduleStateVer[unmoduledKey]) {
              continue;
            } else {
              ctx.prevModuleStateVer[unmoduledKey] = moduleStateVer[unmoduledKey];
            }

            if (!prevState) {
              warn(key, `module[${module}]`);
              continue;
            }
            if (!moduleName_stateKeys_[module].includes(unmoduledKey)) {
              warn(key, `unmoduledKey[${unmoduledKey}]`);
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
    
    // flag isDidMount as false, means effect triggered in didUpdate period
    toBeExecutedFns.forEach(makeItemHandler(eid_effectReturnCb_, false, false));

     // start handle effect meta data of props keys
    const prevProps = ctx.prevProps;
    const curProps = ctx.props;
    const toBeExecutedPropFns = [];
    effectPropsItems.forEach(item=>{
      const { depKeys, fn, eId } = item;
      if (depKeys) {
        const keysLen = depKeys.length;
        if (keysLen === 0) return;
        let shouldEffectExecute = false;
        for (let i = 0; i < keysLen; i++) {
          const key = depKeys[i];
          if (prevProps[key] !== curProps[key]) {
            shouldEffectExecute = true;
            break;
          }
        }
        if (shouldEffectExecute) toBeExecutedPropFns.push({ fn, eId });
      } else {
        toBeExecutedPropFns.push({ fn, eId });
      }
    });

    toBeExecutedPropFns.forEach(makeItemHandler(eid_effectPropsReturnCb_, false, false));
  }
}