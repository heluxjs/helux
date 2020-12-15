import ccContext from '../cc-context';

const _computedValues = ccContext.computed._computedValues;

export default module => {
  if (module) return _computedValues[module];
  else return _computedValues;
}
