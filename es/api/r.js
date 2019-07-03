import register from './register';

/****
 * short for register
 * the option's definition is also been changed
 * option.module is called m for short 
 * option.watchedKeys is called s for short 
 * option.connect is called pm for c 
 * option.isSingle is called is for short 
 * option.reducerModule is called re for short 
 * option.isPropsProxy is called ip for short 
 */
export default function (ccClassKey, {
  m: module,
  w: watchedKeys,
  st: storedKeys,
  c: connect,
  is: isSingle,
  re: reducerModule,
  ip: isPropsProxy,
} = {}) {
  return register(ccClassKey, { isPropsProxy, module, watchedKeys, storedKeys, connect, isSingle, reducerModule });
}