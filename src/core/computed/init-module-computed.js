import ccContext from '../../cc-context';
import * as checker from '../checker';
import * as util from '../../support/util';

const { safeGetObjectFromObject, isPlainJsonObject, safeGetArrayFromObject } = util;
const FN_MSG = `type of computed fn must be a function or object {fn:function}`
const FN_MSG2 = `computedKey is not stateKey, type of computed object must be {fn:function, depKeys:string[]}`

export default function(module, computed){
  if (!isPlainJsonObject(computed)) {
    throw new Error(`StartUpOption.computed.${module}'s value is not a plain json object!`);
  }
  checker.checkModuleName(module, false, `computed.${module} is invalid`);

  const rootState = ccContext.store.getState();
  const rootComputedValue = ccContext.computed.getRootComputedValue();
  const rootComputedFn = ccContext.computed.getRootComputedFn();
  const rootComputedDep = ccContext.computed.getRootComputedDep();
  const moduleState = rootState[module];
  
  const moduleComputedDep = safeGetObjectFromObject(rootComputedDep, module, { stateKey_retKeys_: {}, retKey_fn_: {}, fnCount: 0 });
  
  const retKeys = Object.keys(computed);
  retKeys.forEach(key => {//key可能是stateKey, 也可能是依赖列表的自定义结果key

    let _fn = computed[key];
    if (!_fn) throw new Error(FN_MSG);

    if (moduleState.hasOwnProperty(key)) {//is stateKey
      const originalValue = moduleState[key];
      if (originalValue !== undefined) {
        const moduleComputedFn = safeGetObjectFromObject(rootComputedFn, module);


        if (typeof _fn !== 'function') {
          if (typeof _fn !== 'object') {
            throw new Error(FN_MSG);
          }
          if (_fn.hasOwnProperty('depKeys')) {
            throw new Error('computedKey is stateKey, computedFn can not declare with depKeys, rename your computedKey');
          }

          _fn = _fn.fn;// consider: export name = {fn: ()=>{}}
          if (typeof _fn !== 'function') {
            throw new Error(FN_MSG);
          }
        }
        moduleComputedFn[key] = _fn;

        // 计算并存储modelComputed
        const computedValue = _fn(originalValue, originalValue, moduleState);
        const moduleComputedValue = safeGetObjectFromObject(rootComputedValue, module);
        moduleComputedValue[key] = computedValue;
      } else {
        //strict?
        util.justWarning(`computed.${module}'s key[${key}] is not declared in store.${module}!`);
      }
    } else {
      if (typeof _fn !== 'object') throw new Error(FN_MSG2);
      const { fn, depKeys } = _fn;
      if (typeof fn !== 'function') throw new Error(FN_MSG2);

      let _depKeys;
      if (depKeys === '*') {
        _depKeys = ['*'];
      } else {
        if (!Array.isArray(depKeys)) throw new Error(FN_MSG2);
        if(depKeys.includes('*')) throw new Error('depKeys can not include *');
        _depKeys = depKeys;
      }

      const { stateKey_retKeys_, retKey_fn_ } = moduleComputedDep;
      retKey_fn_[key] = fn;
      moduleComputedDep.fnCount++;
      _depKeys.forEach(sKey => {
        const retKeys = safeGetArrayFromObject(stateKey_retKeys_, sKey);
        retKeys.push(key);
      });

      const computedValue = fn(moduleState, moduleState);
      const moduleComputedValue = safeGetObjectFromObject(rootComputedValue, module);
      moduleComputedValue[key] = computedValue;
    }

  });

}