import ccContext from '../cc-context';

const _computedValue = ccContext.computed._computedValue;

export default module =>{
  return _computedValue[module];
}