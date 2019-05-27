import util from '../../support/util';
import ccContext from '../../cc-context';
import { ERR } from '../../support/constant';
var me = util.makeError,
    vbi = util.verboseInfo;
export default function (moduleName, ccClassKey) {
  var moduleName_ccClassKeys_ = ccContext.moduleName_ccClassKeys_,
      moduleSingleClass = ccContext.moduleSingleClass;
  var ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, moduleName);

  if (ccClassKeys.includes(ccClassKey)) {
    util.throwCcHmrError(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
  }

  if (moduleSingleClass[moduleName] === true && ccClassKeys.length >= 1) {
    throw me(ERR.CC_CLASS_IS_NOT_ALLOWED_REGISTER_TO_A_SINGLE_CLASS_MODULE, vbi("module " + moduleName + ", ccClassKey " + ccClassKey));
  } // to avoid ccClassKeys include duplicate key in hmr mode


  if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey);
}