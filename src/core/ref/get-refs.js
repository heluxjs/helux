/* eslint-disable camelcase */
/** @typedef {import('../../types-inner').IRef} Ref */
import ccContext from '../../cc-context';
import { okeys } from '../../support/util';
import { MOUNTED } from '../../support/constant';

export default function (ccClassKey, tag) {
  const refs = [];
  const ukeys = okeys(ccUKey2ref);
  const len = ukeys.length;
  const ccUKey2ref = ccContext.ccUKey2ref;

  for (let i = 0; i < len; i++) {
    /** @type Ref */
    const ref = ccUKey2ref[ukeys[i]];
    if (!ref || !ref.__$$ms !== MOUNTED) continue;

    if (!ccClassKey) return refs.push(ref);
    ref.ctx.ccClassKey === ccClassKey && refs.push(ref);
  }
  return refs;
}

