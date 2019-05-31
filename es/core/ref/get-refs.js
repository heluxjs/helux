import ccContext from '../../cc-context';
import * as util from '../../support/util';

export default function () {
  let refs = [];
  const ccKey_ref_ = ccContext.ccKey_ref_;
  const ccKeys = util.okeys(ccKey_ref_);
  ccKeys.forEach(k => {
    const ref = ccKey_ref_[k];
    if (ref) refs.push(ref);
  });
  return refs;
}