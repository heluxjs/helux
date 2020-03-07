import ccContext from '../../cc-context';

const { ccUKey_ref_, ccClassKey_ccClassContext_ } = ccContext;

export default function (ccClassKey) {
  let refs = [];
  const ccClassContext = ccClassKey_ccClassContext_[ccClassKey];
  if (!ccClassContext) {
    return refs;
  }
  const ccKeys = ccClassContext.ccKeys;
  ccKeys.forEach(k => {
    const ref = ccUKey_ref_[k];
    if (ref) refs.push(ref);
  });
  return refs;
}