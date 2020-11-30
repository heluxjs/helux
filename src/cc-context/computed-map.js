import { MODULE_GLOBAL, MODULE_CC, MODULE_DEFAULT } from '../support/constant';

const _computedValue = {// 辅助暴露给用户使用来获取计算结果的容器
  [MODULE_GLOBAL]: {},
  [MODULE_DEFAULT]: {},
  [MODULE_CC]: {},
};
const _computedValueOri = {// 辅助存储计算结果的容器
  [MODULE_GLOBAL]: {},
  [MODULE_DEFAULT]: {},
  [MODULE_CC]: {},
};
const _computedDep = {};
const _computedRaw = {};

export default {
  _computedValueOri,
  _computedValue,
  _computedRaw,
  _computedDep,
  getRootComputedValue: () => _computedValue,
  getRootComputedDep: () => _computedDep,
  getRootComputedRaw: () => _computedRaw,
};
