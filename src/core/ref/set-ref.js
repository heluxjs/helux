import ccContext from '../../cc-context';
import { ERR } from '../../support/constant'
import * as util from '../../support/util'

const { justWarning, makeError: me, verboseInfo: vbi, styleStr: ss, color: cl } = util;
const { runtimeVar, ccUKey_ref_ } = ccContext;
const ccUKey_insCount = {};


function setCcInstanceRef(ccUniqueKey, ref, delayMs) {
  const setRef = () => {
    ccUKey_ref_[ccUniqueKey] = ref;
  }

  if (ccContext.isHotReloadMode()) incCcKeyInsCount(ccUniqueKey);
  
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


export default function (ref) {
  const { ccClassKey, ccKey, ccUniqueKey } = ref.ctx;
  if (runtimeVar.isDebug) {
    console.log(ss(`register ccKey ${ccUniqueKey} to CC_CONTEXT`), cl());
  }

  const isHot = ccContext.isHotReloadMode();
  if (ccUKey_ref_[ccUniqueKey]) {
    const dupErr = () => {
      throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi(`ccClass:${ccClassKey},ccKey:${ccKey}`));
    }
    if (isHot) {
      // get existed ins count
      const insCount = getCcKeyInsCount(ccUniqueKey);
      if (insCount > 1) {// now cc can make sure the ccKey duplicate
        dupErr();
      }
      // just warning
      justWarning(`
        found ccKey[${ccKey}] duplicated in hot reload mode, please make sure your ccKey is unique manually,
        ${vbi(`ccClassKey:${ccClassKey} ccKey:${ccKey} ccUniqueKey:${ccUniqueKey}`)}
      `);

      // in webpack hot reload mode, cc works not very well,
      // cc can't set ref immediately, because the ccInstance of ccKey will ummount right now in unmount func, 
      // cc call unsetCcInstanceRef will lost the right ref in CC_CONTEXT.refs
      // so cc set ref later
      setCcInstanceRef(ccUniqueKey, ref, 600);
    } else {
      dupErr();
    }
  } else {
    setCcInstanceRef(ccUniqueKey, ref);
  }
}
