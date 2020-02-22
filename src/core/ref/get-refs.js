import ccContext from '../../cc-context';
import * as util from '../../support/util';

export default function () {
  let refs = [];
  const ccUkey_ref_ = ccContext.ccUkey_ref_;
  const ccKeys = util.okeys(ccUkey_ref_);
  ccKeys.forEach(k => {
    const ref = ccUkey_ref_[k];
    if (ref && !ref.__$$isUnmounted) refs.push(ref);
  });
  return refs;
}