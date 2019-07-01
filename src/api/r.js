import register from './register';

/****
 * short for register
 * the option's definition is also been changed
 * option.module is called m for short 
 * option.sharedStateKeys is called s for short 
 * option.connect is called pm for c 
 * option.isSingle is called is for short 
 * option.reducerModule is called re for short 
 * option.isPropsProxy is called ip for short 
 */
export default function (ccClassKey, {
  m: module,
  s: sharedStateKeys,
  st: storedStateKeys,
  c: connect,
  is: isSingle,
  re: reducerModule,
  ip: isPropsProxy,
} = {}) {
  return register(ccClassKey, { isPropsProxy, module, sharedStateKeys, storedStateKeys, connect, isSingle, reducerModule });
}