import ccContext from '../../cc-context';
import * as util from '../../support/util';
import shouldSkipKey from '../base/should-skip-key';

const getState = ccContext.store.getState;
const moduleName_stateKeys_ = ccContext.moduleName_stateKeys_;

//CcFragment实例调用会提供callerCtx
// stateModule表示状态所属的模块
export default function (refCtx, stateModule, oldState, committedState) {
  const {computedSpec, module:refModule, refComputed, refConnectedComputed } = refCtx;

  const { computedFns, hasFn } = computedSpec;
  if (hasFn !== true) return;
  const moduleStateKeys = moduleName_stateKeys_[stateModule];

  const toBeComputedKeys = util.okeys(computedFns);
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
  })
}