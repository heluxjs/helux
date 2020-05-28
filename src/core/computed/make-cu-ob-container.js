import { CU_KEY } from '../../support/priv-constant';
import { makeCuObValue, okeys, justWarning } from '../../support/util';

export default function (computed, originalCuContainer) {
  const moduleComputedValue = {};
  okeys(computed).forEach(key => {
    // 避免get无限递归，用这个对象来存其他信息
    originalCuContainer[key] = makeCuObValue();

    Object.defineProperty(
      moduleComputedValue, key, {
      get: function () {
        const value = originalCuContainer[key] || {};//防止用户传入未定义的key
        const { needCompute, fn, newState, oldState, fnCtx, isLazy, result } = value;
        if (!isLazy) {
          return result;
        }
  
        if (isLazy && needCompute) {
          const ret = fn(newState, oldState, fnCtx);
          value.result = ret;
          value.needCompute = false;
        }
  
        return value.result;
      },
      set: function (input) {
        const value = originalCuContainer[key];
        if (!input[CU_KEY]) {
          justWarning(`computed value can not been changed manually`);
          return;
        }
        if (input.isLazy) {
          value.isLazy = true;
          value.needCompute = true;
          value.newState = input.newState;
          value.oldState = input.oldState;
          value.fn = input.fn;
          value.fnCtx = input.fnCtx;
        } else {
          value.isLazy = false;
          value.result = input.result;
        }
      }
    })
  });
  return moduleComputedValue;
}