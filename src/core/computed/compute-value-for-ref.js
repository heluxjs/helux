import { MODULE_GLOBAL } from '../../support/constant';
import ccContext from '../../cc-context';
import * as util from '../../support/util';
import shouldSkipKey from '../base/should-skip-key';

const getState = ccContext.store.getState;
const moduleName_stateKeys_ = ccContext.moduleName_stateKeys_;

//CcFragment实例调用会提供ctx
export default function(stateModule, computedSpec, refComputed, refConnectedComputed, oldState, commitState, ctx, writeRefComputedWhenRefIsCfrag) {
  if (computedSpec) {
    const globalStateKeys = moduleName_stateKeys_[MODULE_GLOBAL];
    const moduleStateKeys = moduleName_stateKeys_[stateModule];

    const toBeComputed = computedSpec;
    const toBeComputedKeys = util.okeys(toBeComputed);
    toBeComputedKeys.forEach(key => {
      const { stateKey, skip, keyModule } = shouldSkipKey(key, stateModule, refConnectedComputed, moduleStateKeys, globalStateKeys, ctx, writeRefComputedWhenRefIsCfrag);
      if (skip) return;

      const newValue = commitState[stateKey];
      if (newValue !== undefined) {
        const fn = toBeComputed[key];//用原始定义当然key去取fn
        const targetModule = keyModule || stateModule;
        const moduleState = getState(targetModule);
        const keyDesc = { key: stateKey, module: targetModule, moduleState };

        const computedValue = fn(newValue, oldState[stateKey], keyDesc, ctx);
        if(keyModule){
          refConnectedComputed[keyModule][stateKey] = computedValue;
        }else{
          refComputed[stateKey] = computedValue;
        }
      }
    })
  }
}