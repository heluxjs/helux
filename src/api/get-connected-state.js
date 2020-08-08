import ccContext from '../cc-context';

const ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_;

export default ccClassKey => {
  const clsCtx = ccClassKey_ccClassContext_[ccClassKey];
  return clsCtx.connectedState || {};
}