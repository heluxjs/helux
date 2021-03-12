/* eslint-disable camelcase */
/** @typedef {import('../../types-inner').IRef} Ref */
import ccContext from '../../cc-context';
import { okeys, isObject } from '../../support/util';
import { MOUNTED, UNMOUNTED } from '../../support/constant';

export default function (filters) {
  const ccUKey2ref = ccContext.ccUKey2ref;
  let _filters = {};
  if (typeof filters === 'string') _filters = { ccClassKey: filters };
  else if (isObject(filters)) _filters = filters;
  
  const { ccClassKey, tag, moduleName, includeNotMount = false } = _filters;
  const refs = [];
  const ukeys = okeys(ccUKey2ref);
  const len = ukeys.length;

  const isEqual = (passedVal, ctxVal) => {
    if (!passedVal) return true;
    return passedVal === ctxVal;
  };

  for (let i = 0; i < len; i++) {
    /** @type Ref */
    const ref = ccUKey2ref[ukeys[i]];
    const mountStatus = ref.__$$ms;

    if (includeNotMount) { // allow NOT_MOUNT, MOUNTED
      if (mountStatus === UNMOUNTED) continue;
    } else { // only allow MOUNTED
      if (mountStatus !== MOUNTED) continue;
    }

    const ctx = ref.ctx;
    if (
      isEqual(ccClassKey, ctx.ccClassKey)
      && isEqual(tag, ctx.tag)
      && isEqual(moduleName, ctx.module)
    ) {
      refs.push(ref);
    }
  }
  return refs;
}
