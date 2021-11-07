import ccContext from '../../cc-context';
import * as util from '../../support/util';

const {
  moduleName2stateKeys,
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
    effectItems, eid2effectReturnCb, effectPropsItems, eid2effectPropsReturnCb,
  } = ctx.effectMeta;
  const { __$$prevMoStateVer, __$$settedList, module: refModule } = ctx;

  const makeItemHandler = (eid2cleanCb, isFirstCall, needJudgeImmediate) => item => {
    const { fn, eId, immediate } = item;
    if (needJudgeImmediate) {
      if (immediate === false) return;
    }
    const prevCb = eid2cleanCb[eId];
    if (prevCb) prevCb(ctx);// let ctx.effect have the totally same behavior with useEffect

    const cb = fn(ctx, isFirstCall);
    eid2cleanCb[eId] = cb;//不管有没有返回，都要覆盖之前的结果
  };

  if (callByDidMount) {
    // flag isFirstCall as true
    effectItems.forEach(makeItemHandler(eid2effectReturnCb, true, true));
    effectPropsItems.forEach(makeItemHandler(eid2effectPropsReturnCb, true, true));
    return;
  }

  // callByDidUpdate
  // start handle effect meta data of state keys
  const prevState = ctx.prevState;
  const curState = ctx.unProxyState;
  const toBeExecutedFns = [];

  effectItems.forEach(item => {
    // const { status, depKeys, fn, eId } = item;
    // if (status === EFFECT_STOPPED) return;

    // todo, 优化为effectDep模式, 利用differStateKeys去命中执行函数
    const { modDepKeys, depKeys, compare, fn, eId } = item;
    if (!depKeys) {
      return toBeExecutedFns.push({ fn, eId });
    }
    
    const keysLen = modDepKeys.length;
    if (keysLen === 0) return;

    const mappedSettedKey = mapSettedList(__$$settedList);
    let shouldEffectExecute = false;
    for (let i = 0; i < keysLen; i++) {
      const key = modDepKeys[i];
      const [module, unmoduledKey] = key.split('/');
      let targetCurState, targetPrevState;

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
        if (!moduleName2stateKeys[module].includes(unmoduledKey)) {
          warn(key, `unmoduledKey[${unmoduledKey}]`);
          continue;
        }

        targetCurState = getState(module);
        targetPrevState = prevState;
      } else {
        targetCurState = curState;
        targetPrevState = prevState;
      }
      const isValChanged = targetPrevState[unmoduledKey] !== targetCurState[unmoduledKey];

      if (isValChanged) {
        shouldEffectExecute = true;
      } else {
        // compare为true看有没有发生变化（object类型值不走immutable写法的话，这里是false，所以compare值默认是false）
        // compare为false则看是不是setted
        shouldEffectExecute = compare ? isValChanged : mappedSettedKey[key];
      }

      if (shouldEffectExecute) {
        break;
      }
    }

    if (shouldEffectExecute) {
      toBeExecutedFns.push({ fn, eId });
    }
  });

  // flag isFirstCall as false, start to run state effect fns
  toBeExecutedFns.forEach(makeItemHandler(eid2effectReturnCb, false, false));

  // start handle effect meta data of props keys
  const prevProps = ctx.prevProps;
  const curProps = ctx.props;
  const toBeExecutedPropFns = [];
  effectPropsItems.forEach(item => {
    const { depKeys, fn, eId } = item;
    if (!depKeys) {
      return toBeExecutedPropFns.push({ fn, eId });
    }

    const keysLen = depKeys.length;
    let shouldEffectExecute = false;
    for (let i = 0; i < keysLen; i++) {
      const key = depKeys[i];
      if (prevProps[key] !== curProps[key]) {
        shouldEffectExecute = true;
        break;
      }
    }
    if (shouldEffectExecute) toBeExecutedPropFns.push({ fn, eId });
  });

  // flag isFirstCall as false, start to run prop effect fns
  toBeExecutedPropFns.forEach(makeItemHandler(eid2effectPropsReturnCb, false, false));

  // clear settedList
  __$$settedList.length = 0;
}
