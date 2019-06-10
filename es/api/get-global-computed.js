import ccContext from '../cc-context';
import { MODULE_GLOBAL } from '../support/constant';

const _computedValue = ccContext.computed._computedValue;

export default () => {
  return _computedValue[MODULE_GLOBAL];
}