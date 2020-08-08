/** @typedef {import('../../types').ICtxBase} ICtxBase */
import ccContext from '../../cc-context';
import { okeys } from '../../support/util';

const { ccUKey_ref_ } = ccContext;

export default function (ccClassKey) {
  const refs = [];
  const ukeys = okeys(ccUKey_ref_);
  const len = ukeys.length;

  for (let i = 0; i < len; i++) {
    /** @type {{ctx:ICtxBase}} */
    const ref = ukeys[i];
    if (ref.ctx.ccClassKey === ccClassKey) {
      refs.push(ref);
    }
  }

  return refs;
}
