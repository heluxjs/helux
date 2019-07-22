import ccContext from '../../cc-context';
import * as util from '../../support/util';
import shouldSkipKey from '../base/should-skip-key';

const getState = ccContext.store.getState;
const moduleName_stateKeys_ = ccContext.moduleName_stateKeys_;

//CcFragment实例调用会提供callerCtx
export default function (stateModule, computedSpec, refComputed, refConnectedComputed, oldState, committedState, callerCtx) {
  if (computedSpec) {
    const moduleStateKeys = moduleName_stateKeys_[stateModule];

    const { computedFns, module: computedSpecModule } = computedSpec;
    const toBeComputedKeys = util.okeys(computedFns);
    toBeComputedKeys.forEach(key => {
      const { stateKey, skip, keyModule } = shouldSkipKey(computedSpecModule, key, stateModule, refConnectedComputed, moduleStateKeys);
      if (skip) return;

      const newValue = committedState[stateKey];
      if (newValue !== undefined) {
        const fn = computedFns[key];//用原始定义当然key去取fn
        const targetModule = keyModule || stateModule;
        const moduleState = getState(targetModule);
        const fnCtx = { key: stateKey, module: targetModule, moduleState, committedState };

        const computedValue = fn(newValue, oldState[stateKey], fnCtx, callerCtx);
        if (keyModule) {
          const targetConnectedComputed = refConnectedComputed[keyModule];
          //防止foo模块的实例，定义的watchKey是 foo/f1, 此时skip是false，但是结果不会向refConnectedComputed里放
          if(targetConnectedComputed){
            targetConnectedComputed[stateKey] = computedValue;
          }

          //计算的目标key的模块和实例所属模块值一样时，也向refComputed赋值
          if (keyModule === computedSpecModule) {
            refComputed[stateKey] = computedValue;
          }
        } else {
          refComputed[stateKey] = computedValue;
        }
      }
    })
  }
}