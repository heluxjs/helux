import register from './register';

/****
 * short for register
 * the option's definition is also been changed
 * option.module is called m for short 
 * option.sharedStateKeys is called s for short 
 * option.globalStateKeys is called g for short 
 * option.connect is called pm for c 
 * option.isSingle is called is for short 
 * option.asyncLifecycleHook is called as for short 
 * option.reducerModule is called re for short 
 * option.extendInputClass is called ex for short 
 */
export default function (ccClassKey, {
  m: module,
  s: sharedStateKeys,
  g: globalStateKeys,
  st: storedStateKeys,
  c: connect,
  is: isSingle,
  as: asyncLifecycleHook,
  re: reducerModule,
  ex: extendInputClass,
} = {}) {
  return register(ccClassKey, { extendInputClass, module, sharedStateKeys, globalStateKeys, storedStateKeys, connect, isSingle, asyncLifecycleHook, reducerModule });
}