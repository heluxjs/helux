import { MODULE_GLOBAL, MODULE_CC, MODULE_DEFAULT, MODULE_VOID } from '../support/constant';

const _computedValues = {// 辅助暴露给用户使用来获取计算结果的容器
  [MODULE_GLOBAL]: {},
  [MODULE_DEFAULT]: {},
  [MODULE_CC]: {},
  [MODULE_VOID]: {},
};
const _computedRawValues = {// 辅助存储计算结果的容器
  [MODULE_GLOBAL]: {},
  [MODULE_DEFAULT]: {},
  [MODULE_CC]: {},
  [MODULE_VOID]: {},
};
const _computedDep = {};
const _computedRaw = {};

export default {
  _computedRawValues,
  // 在 init-module-computed 时，会将key对应的值赋为经defineProperty处理过的对象
  _computedValues,
  _computedRaw,
  _computedDep,
  getRootComputedValue: () => _computedValues,
  getRootComputedDep: () => _computedDep,
  getRootComputedRaw: () => _computedRaw,
};
