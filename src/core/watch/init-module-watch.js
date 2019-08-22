import ccContext from '../../cc-context';
import * as checker from '../checker';
import * as util from '../../support/util';

const { safeGetObjectFromObject, isPlainJsonObject, safeGetArrayFromObject, okeys } = util;

const tipFn = watchKey => `watchKey[${watchKey}] is a stateKey, watchDesc must like: function | {fn:Function, immediate?:boolean}`;
const tipDep = watchKey => `watchKey[${watchKey}] is not a stateKey, watchDesc must like: {fn:Function, depKeys:string[] | *, immediate?:boolean}`;


/**
 * 设置watch值，过滤掉一些无效的key
 */
export default function(module, moduleWatch){
  if (!isPlainJsonObject(moduleWatch)) {
    throw new Error(`StartUpOption.watch.${module}'s value is not a plain json object!`);
  }
  checker.checkModuleName(module, false, `watch.${module} is invalid`);

  const rootWatch = ccContext.watch.getRootWatch();
  const rootWatchDep = ccContext.watch.getRootWatchDep();
  const getState = ccContext.store.getState;
  const moduleState = getState(module);

  okeys(moduleWatch).forEach(key => {
    const desc = moduleWatch[key];

    if (moduleState.hasOwnProperty(key)) {
      if (!desc) throw new Error(tipFn(key));

      let _fn, _immediate = false;
      if (typeof desc !== 'function') {
        if (typeof desc !== 'object') throw new Error(tipFn(key));

        const { fn, immediate } = desc;
        if (typeof fn !== 'function') throw new Error(tipFn(key));
        _fn = fn;
        _immediate = immediate;
      } else {
        _fn = desc;
      }

      const ccModuleWatch = safeGetObjectFromObject(rootWatch, module);
      ccModuleWatch[key] = _fn;

      if(_immediate){
        const val = moduleState[key];
        // 和 ccContext里setStateByModule保持统一的fnCtx
        fn(val, val, { key, module, moduleState, committedState: moduleState });
      }
    } else {// customized key for depKeys
      if (typeof desc !== 'object') throw new Error(tipDep(key));
      const { fn, depKeys, immediate } = desc;
      if (typeof fn !== 'function') throw new Error(tipDep(key));

      let _depKeys;
      if (depKeys === '*') {
        _depKeys = ['*'];
      } else {
        if (!Array.isArray(depKeys)) throw new Error(tipDep(key));
        _depKeys = depKeys;
      }

      const moduleWatchDep = rootWatchDep[module] = { stateKey_retKeys_: {}, retKey_fn_: {}, fnCount: 0 };
      const { stateKey_retKeys_, retKey_fn_ } = moduleWatchDep;
      retKey_fn_[key] = fn;
      moduleWatchDep.fnCount++;
      _depKeys.forEach(sKey => {
        const retKeys = safeGetArrayFromObject(stateKey_retKeys_, sKey);
        retKeys.push(key);
      });

      if(immediate){
        fn(moduleState, moduleState);
      }
    }
  });
}