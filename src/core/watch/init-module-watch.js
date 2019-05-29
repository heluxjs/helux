import ccContext from '../../cc-context';
import * as checker from '../checker';
import * as util from '../../support/util';

const { safeGetObjectFromObject, isPlainJsonObject } = util;

/**
 * 设置watch值，过滤掉一些无效的key
 */
export default function(module, moduleWatch){
  if (!isPlainJsonObject(moduleWatch)) {
    throw new Error(`StartUpOption.watch.${module}'s value is not a plain json object!`);
  }
  checker.checkModuleName(module, false, `watch.${module} is invalid`);

  const rootWatch = ccContext.watch.getRootWatch();
  const getState = ccContext.store.getState;
  const watchStateKeys = Object.keys(moduleWatch);

  watchStateKeys.forEach(key => {
    const moduleState = getState(module);
    const originalValue = moduleState[key];
    if (originalValue !== undefined) {
      const fn = moduleWatch[key];
      if (typeof fn !== 'function') {
        throw new Error(`watch.${module}.${key}'s value is not a function`);
      }
      const ccModuleWatch = safeGetObjectFromObject(rootWatch, module);
      ccModuleWatch[key] = fn;
    } else {
      //strict?
      util.justWarning(`watch.${module}'s key[${key}] is not declared in store.${module}!`);
    }
  });
}