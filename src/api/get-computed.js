import ccContext from '../cc-context';

const _computedValue = ccContext.computed._computedValue;

export default module => {
  if (module) return _computedValue[module];
  else return _computedValue;
}
