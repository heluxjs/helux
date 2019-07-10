import util from '../../support/util';
import ccContext from '../../cc-context';
import { ERR } from '../../support/constant'

const { makeError: me, verboseInfo: vbi } = util;

export default function (moduleName, ccClassKey) {
  const { moduleName_ccClassKeys_, moduleSingleClass } = ccContext;
  const ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, moduleName);
  if (ccClassKeys.includes(ccClassKey)) {
    ccContext.throwCcHmrError(ERR.CC_CLASS_KEY_DUPLICATE, `ccClassKey:${ccClassKey} duplicate`);
  }
  if (moduleSingleClass[moduleName] === true && ccClassKeys.length >= 1) {
    throw me(ERR.CC_CLASS_IS_NOT_ALLOWED_REGISTER_TO_A_SINGLE_CLASS_MODULE, vbi(`module ${moduleName}, ccClassKey ${ccClassKey}`));
  }
  // to avoid ccClassKeys include duplicate key in hmr mode
  if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey);
}