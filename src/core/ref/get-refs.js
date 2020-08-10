import ccContext from '../../cc-context';
import * as util from '../../support/util';

export default function () {
  let refs = [];
  const ccUKey_ref_ = ccContext.ccUKey_ref_;
  const ccKeys = util.okeys(ccUKey_ref_);
  ccKeys.forEach(k => {
    const ref = ccUKey_ref_[k];
    if (ref && !ref.__$$isUnmounted) refs.push(ref);
  });
  return refs;
}
