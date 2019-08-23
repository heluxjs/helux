import ccContext from '../../cc-context';
import { okeys } from '../../support/util';
import shouldSkipKey from '../base/should-skip-key';
import pickDepFns from '../base/pick-dep-fns';

const getState = ccContext.store.getState;
const moduleName_stateKeys_ = ccContext.moduleName_stateKeys_;

//CcFragment实例调用会提供callerCtx
// stateModule表示状态所属的模块
export default function (refCtx, stateModule, oldState, committedState) {
  const { computedFns, computedDep, hasComputedFn, module: refModule, refComputed, refConnectedComputed, ccUniqueKey } = refCtx;
  if (!hasComputedFn) return;
  const moduleStateKeys = moduleName_stateKeys_[refModule];

  //todo 优化computedFns {m:{[moduleA]: {} }, self: {} }
  // 调用differStateKeys, 然后直接取命中这些函数

  // 触发直接对stateKey定义的相管computed函数
  okeys(computedFns).forEach(key => {// key: 'foo/a' 'a' '/a'
    const { stateKey, skip, keyModule } = shouldSkipKey(key, refModule, stateModule, refConnectedComputed, moduleStateKeys);
    if (skip) return;

    const newValue = committedState[stateKey];
    const oldValue = oldState[stateKey];
    if (newValue !== undefined && newValue !== oldValue) {
      const fn = computedFns[key];//用原始定义当然key去取fn
      const moduleState = getState(keyModule);
      const fnCtx = { key: stateKey, module: keyModule, moduleState, committedState };

      const computedValue = fn(newValue, oldValue, fnCtx, refCtx);
      const targetComputed = refConnectedComputed[keyModule];

      //foo模块的实例，定义的watchKey是 foo/f1, 此时skip是false，但是结果不会向refConnectedComputed里放的
      //因为refConnectedComputed放置的只是connect连接的模块的key结算结果
      if (targetComputed) {
        targetComputed[stateKey] = computedValue;
      }

      //foo模块的实例，定义的watchKey是 foo/f1, /f1, f1 都会放置到refComputed里
      if (!keyModule || keyModule === refModule) {
        refComputed[stateKey] = computedValue;
      }
    }
  });

  // 触发依赖stateKeys相关的computed函数
  const pickedFns = pickDepFns('ref', 'computed', computedDep, stateModule, oldState, committedState, ccUniqueKey);
  pickedFns.forEach(({ fn, retKey }) => {
    const computedValue = fn(committedState, oldState, refCtx);

    if (refModule === stateModule) {
      refComputed[retKey] = computedValue;
    }

    // 意味着用户必须将组建connect到此模块，computed&watch里模块定义才有效果
    const targetComputed = refConnectedComputed[stateModule];
    if (targetComputed) {
      targetComputed[retKey] = computedValue;
    }
  });

}