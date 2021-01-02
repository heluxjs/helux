/* eslint-disable camelcase */
/** @typedef {import('../../types-inner').IRef} Ref */
import ccContext from '../../cc-context';
import * as util from '../../support/util';

export default function (classKey) {
  const refs = [];
  const ccUKey2ref = ccContext.ccUKey2ref;
  const ccKeys = util.okeys(ccUKey2ref);
  ccKeys.forEach(k => {
    /** @type Ref */
    const ref = ccUKey2ref[k];
    if (ref && !ref.__$$isUnmounted) {
      if (!classKey) return refs.push(ref);
      ref.ctx.ccClassKey === classKey && refs.push(ref);
    }
  });
  return refs;
}
