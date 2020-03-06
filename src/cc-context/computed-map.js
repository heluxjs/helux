import { MODULE_GLOBAL, MODULE_CC, MODULE_DEFAULT } from '../support/constant';

const _computedValue = {
  [MODULE_GLOBAL]: {},
  [MODULE_DEFAULT]: {},
  [MODULE_CC]: {},
};
const _computedDep = {};
const _computedRaw = {};

export default {
  _computedValue,
  _computedRaw,
  _computedDep,
  getRootComputedValue: () => _computedValue,
  getRootComputedDep: () => _computedDep,
  getRootComputedRaw: () => _computedRaw,
};