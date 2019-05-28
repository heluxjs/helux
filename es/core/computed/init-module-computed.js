import ccContext from '../../cc-context';
import * as checker from '../checker';
import * as util from '../../support/util';

const { safeGetObjectFromObject, isPlainJsonObject } = util;

export default function(module, computed){
  if (!isPlainJsonObject(computed)) {
    throw new Error(`StartUpOption.computed.${module}'s value is not a plain json object!`);
  }
  checker.checkModuleName(module, false, `computed.${module} is invalid`);

  const rootState = ccContext.store.getState();
  const rootComputedValue = ccContext.computed.getRootComputedValue();
  const rootComputedFn = ccContext.computed.getRootComputedFn();
  const moduleState = rootState[module];
  const stateKeys = Object.keys(computed);

  stateKeys.forEach(key => {
    const originalValue = moduleState[key];
    if (originalValue !== undefined) {
      const moduleComputedFn = safeGetObjectFromObject(rootComputedFn, module);
      const fn = computed[key];
      moduleComputedFn[key] = fn;

      const computedValue = fn(originalValue, originalValue, moduleState);
      const moduleComputedValue = safeGetObjectFromObject(rootComputedValue, module);
      moduleComputedValue[key] = computedValue;
    } else {
      //strict?
      justWarning(`computed.${module}'s key[${key}] is not declared in store.${module}'s state!`);
    }
  });
}