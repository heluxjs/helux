/* eslint-disable camelcase */
import ccContext from '../../cc-context';
import * as util from '../../support/util';

export default function () {
  const refs = [];
  const ccUKey2ref = ccContext.ccUKey2ref;
  const ccKeys = util.okeys(ccUKey2ref);
  ccKeys.forEach(k => {
    const ref = ccUKey2ref[k];
    if (ref && !ref.__$$isUnmounted) refs.push(ref);
  });
  return refs;
}
