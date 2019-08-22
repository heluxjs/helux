import ccContext from '../../cc-context';
import * as util from '../../support/util';
import shouldSkipKey from '../base/should-skip-key';

const getState = ccContext.store.getState;
const moduleName_stateKeys_ = ccContext.moduleName_stateKeys_;

//CcFragment实例调用会提供callerCtx
// stateModule表示状态所属的模块
export default function (refCtx, stateModule, oldState, committedState) {
  const { computedFns, computedDep, hasComputedFn, module: refModule, refComputed, refConnectedComputed } = refCtx;
  if (!hasComputedFn) return;

  const moduleStateKeys = moduleName_stateKeys_[stateModule];
  const toBeComputedKeys = util.okeys(computedFns);

  // 对于computedFns, 采用先遍历toBeComputedKeys的方式
  toBeComputedKeys.forEach(key => {
    const { stateKey, skip, keyModule } = shouldSkipKey(key, refModule, stateModule, refConnectedComputed, moduleStateKeys);
    if (skip) return;

    const newValue = committedState[stateKey];
    if (newValue !== undefined) {
      const fn = computedFns[key];//用原始定义当然key去取fn
      const moduleState = getState(keyModule);
      const fnCtx = { key: stateKey, module: keyModule, moduleState, committedState };

      const computedValue = fn(newValue, oldState[stateKey], fnCtx, refCtx);
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

  // { stateKey_retKeys_: {}, retKey_fn_: {} }
  const moduleComputedDep = computedDep[stateModule];
  if (moduleComputedDep) {
    const { stateKey_retKeys_, retKey_fn_ } = moduleComputedDep;
    const pickedFns = [];
    const retKey_picked_ = {};

    okeys(stateKey_retKeys_).forEach(stateKey => {
      const newValue = committedState[stateKey];

      if (newValue !== undefined || sKey === '*') {
        const retKeys = stateKey_retKeys_[stateKey];
        retKeys.forEach(retKey => {
          //没有挑过的方法才挑出来
          if (!retKey_picked_[retKey]) {
            retKey_picked_[retKey] = true;
            pickedFns.push({ retKey, fn: retKey_fn_[k] });
          }
        });
      }
    });

    pickedFns.forEach(({ fn, retKey }) => {
      const computedValue = fn(committedState, oldState, refCtx);

      if (refModule === stateModule) {
        refComputed[retKey] = computedValue;
      }

      // 意味着用户必须将组建connect到此模块，computed&watch里模块定义才有效果
      const targetComputed = refConnectedComputed[keyModule];
      if (targetComputed) {
        targetComputed[retKey] = computedValue;
      }
    });

  }
  
}