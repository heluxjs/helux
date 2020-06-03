import ccContext from '../../cc-context';
import * as util from '../../support/util';

const {
  moduleName_stateKeys_, 
  store: { getPrevState, getState, getStateVer }
} = ccContext;

const warn = (key, frag) => util.justWarning(`effect: key[${key}] is invalid, its ${frag} has not been declared in' store!`);

function mapSettedList(settedList) {
  return settedList.reduce((map, { module, keys }) => {
    keys.forEach(key => map[`${module}/${key}`] = 1);
    return map;
  }, {})
}

export default function (ref, callByDidMount) {
  const ctx = ref.ctx;
  const {
    effectItems, eid_effectReturnCb_, effectPropsItems, eid_effectPropsReturnCb_,
  } = ctx.effectMeta;
  const { __$$prevMoStateVer, __$$settedList, module: refModule } = ctx;

  const makeItemHandler = (eid_cleanCb_, isFirstCall, needJudgeImmediate) => item => {
    const { fn, eId, immediate } = item;
    if (needJudgeImmediate) {
      if (immediate === false) return;
    }
    const prevCb = eid_cleanCb_[eId];
    if (prevCb) prevCb(ctx);// let ctx.effect have the totally same behavior with useEffect

    const cb = fn(ctx, isFirstCall);
    eid_cleanCb_[eId] = cb;//不管有没有返回，都要覆盖之前的结果
  };

  if (callByDidMount) {
    // flag isFirstCall as true
    effectItems.forEach(makeItemHandler(eid_effectReturnCb_, true, true));
    effectPropsItems.forEach(makeItemHandler(eid_effectPropsReturnCb_, true, true));
  } else {// callByDidUpdate

    // start handle effect meta data of state keys
    const prevState = ctx.prevState;
    const curState = ctx.unProxyState;
    const toBeExecutedFns = [];

    effectItems.forEach(item => {
      // const { status, depKeys, fn, eId } = item;
      // if (status === EFFECT_STOPPED) return;

      // todo, 优化为effectDep模式, 利用differStateKeys去命中执行函数
      const { modDepKeys, compare, fn, eId } = item;
      if (modDepKeys) {
        const keysLen = modDepKeys.length;
        if (keysLen === 0) return;

        const mappedSettedKey = mapSettedList(__$$settedList);
        let shouldEffectExecute = false;

        for (let i = 0; i < keysLen; i++) {
          const key = modDepKeys[i];
          if (!compare) {
            if (mappedSettedKey[key]) {
              shouldEffectExecute = true;
              break;
            }else{
              continue;
            }
          }

          let targetCurState, targetPrevState;
          const [module, unmoduledKey] = key.split('/');
          if (module !== refModule) {
            const prevState = getPrevState(module);
            const moduleStateVer = getStateVer(module);

            if (__$$prevMoStateVer[unmoduledKey] === moduleStateVer[unmoduledKey]) {
              continue;
            } else {
              __$$prevMoStateVer[unmoduledKey] = moduleStateVer[unmoduledKey];
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
          } else {
            targetCurState = curState;
            targetPrevState = prevState;
          }

          if (targetPrevState[unmoduledKey] !== targetCurState[unmoduledKey]) {
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
    
    // flag isFirstCall as false, start to run state effect fns
    toBeExecutedFns.forEach(makeItemHandler(eid_effectReturnCb_, false, false));

     // start handle effect meta data of props keys
    const prevProps = ctx.prevProps;
    const curProps = ctx.props;
    const toBeExecutedPropFns = [];
    effectPropsItems.forEach(item=>{
      const { depKeys, fn, eId } = item;
      if (depKeys) {// prop dep key
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

    // flag isFirstCall as false, start to run prop effect fns
    toBeExecutedPropFns.forEach(makeItemHandler(eid_effectPropsReturnCb_, false, false));

    // clear settedList
    __$$settedList.length = 0;
  }

}