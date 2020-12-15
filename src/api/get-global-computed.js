import ccContext from '../cc-context';
import { MODULE_GLOBAL } from '../support/constant';

const _computedValues = ccContext.computed._computedValues;

export default () => {
  return _computedValues[MODULE_GLOBAL];
}
