import register from './register';

/****
 * short for register
 * the option's definition is also been changed
 * option.module is called m for short 
 * option.sharedStateKeys is called s for short 
 * option.globalStateKeys is called g for short 
 * option.stateToPropMapping is called pm for short 
 * option.isPropStateModuleMode is called mm for short 
 * option.isSingle is called is for short 
 * option.asyncLifecycleHook is called as for short 
 * option.reducerModule is called re for short 
 * option.extendInputClass is called ex for short 
 */
export default function (ccClassKey, {
  m: module,
  s: sharedStateKeys,
  g: globalStateKeys,
  pm: stateToPropMapping,
  mm: isPropStateModuleMode,
  is: isSingle,
  as: asyncLifecycleHook,
  re: reducerModule,
  ex: extendInputClass,
} = {}) {
  return register(ccClassKey, { extendInputClass, module, sharedStateKeys, globalStateKeys, stateToPropMapping, isPropStateModuleMode, isSingle, asyncLifecycleHook, reducerModule });
}