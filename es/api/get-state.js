import ccContext from '../cc-context';

export default module => {
  return ccContext.store.getState(module);
};
