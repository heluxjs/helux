import ccContext from '../../cc-context';
import { ERR } from '../../support/constant'
import * as util from '../../support/util'

const { justWarning, makeError: me, verboseInfo: vbi, styleStr: ss, color: cl } = util;
const ccUKey_insCount = {};

function setCcInstanceRef(ccUniqueKey, ref, ccKeys, delayMs) {
  function setRef() {
    ccContext.ccUkey_ref_[ccUniqueKey] = ref;
    ccKeys.push(ccUniqueKey);
  }
  incCcKeyInsCount(ccUniqueKey);
  if (delayMs) {
    setTimeout(setRef, delayMs);
  } else {
    setRef();
  }
}

export function incCcKeyInsCount(ccUniqueKey) {
  if (ccUKey_insCount[ccUniqueKey] === undefined) ccUKey_insCount[ccUniqueKey] = 1;
  else ccUKey_insCount[ccUniqueKey] += 1;
}
export function decCcKeyInsCount(ccUniqueKey) {
  if (ccUKey_insCount[ccUniqueKey] === undefined) ccUKey_insCount[ccUniqueKey] = 0;
  else ccUKey_insCount[ccUniqueKey] -= 1;
}
export function getCcKeyInsCount(ccUniqueKey) {
  if (ccUKey_insCount[ccUniqueKey] === undefined) return 0;
  else return ccUKey_insCount[ccUniqueKey];
}


export default function (ref, isSingle, ccClassKey, ccKey, ccUniqueKey) {
  const classContext = ccContext.ccClassKey_ccClassContext_[ccClassKey];
  const ccKeys = classContext.ccKeys;
  if (ccContext.isDebug) {
    console.log(ss(`register ccKey ${ccUniqueKey} to CC_CONTEXT`), cl());
  }

  const isHot = ccContext.isHotReloadMode();
  if (ccKeys.includes(ccUniqueKey)) {
    if (isHot) {
      // get existed ins count
      const insCount = getCcKeyInsCount(ccUniqueKey);
      if (isSingle && insCount > 0) throw me(ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE, vbi(`ccClass:${ccClassKey}`));
      if (insCount > 1) {// now cc can make sure the ccKey duplicate
        throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi(`ccClass:${ccClassKey},ccKey:${ccUniqueKey}`));
      }
      // just warning
      justWarning(`
        found ccKey ${ccKey} may duplicate, but now is in hot reload mode, cc can't throw the error, please make sure your ccKey is unique manually,
        ${vbi(`ccClassKey:${ccClassKey} ccKey:${ccKey} ccUniqueKey:${ccUniqueKey}`)}
      `);

      // in webpack hot reload mode, cc works not very well,
      // cc can't set ref immediately, because the ccInstance of ccKey will ummount right now, in unmount func, 
      // cc call unsetCcInstanceRef will lost the right ref in CC_CONTEXT.refs
      // so cc set ref later
      setCcInstanceRef(ccUniqueKey, ref, ccKeys, 600);
    } else {
      throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi(`ccClass:[${ccClassKey}],ccKey:[${ccUniqueKey}]`));
    }
  } else {
    setCcInstanceRef(ccUniqueKey, ref, ccKeys);
  }

  return classContext;
}