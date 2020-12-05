import { CU_KEY } from '../../support/priv-constant';
import { makeCuPackedValue, okeys, justWarning } from '../../support/util';

/**
 * 提供给用户使用，从存储的打包计算结果里获取目标计算结果的容器
 * ------------------------------------------------------------------------------------
 * 触发get时，会从打包对象里获取目标计算结果，
 * 打包对象按 ${retKey} 放置在originalCuContainer里，
 * 对于refComputed，originalCuContainer 是 ctx.refComputedOri
 * 对于moduleComputed，originalCuContainer 是  concentContext.ccComputed._computedValueOri.{$module}
 */
export default function (computed, originalCuContainer) {
  const moduleComputedValue = {};
  okeys(computed).forEach(key => {
    // 用这个对象来存其他信息, 避免get无限递归，
    originalCuContainer[key] = makeCuPackedValue();

    Object.defineProperty(moduleComputedValue, key, {
      get: function () {
        // 防止用户传入未定义的key
        const value = originalCuContainer[key] || {};
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
