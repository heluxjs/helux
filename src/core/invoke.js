import ccContext from '../cc-context';
import util from '../support/util';
import { ERR } from '../support/constant';

const vbi = util.verboseInfo;

/**
 * @description
 * @author zzk
 * @export
 * @param {*} ccClassKey must pass to invoke!
 * @param {*} ccInstanceKey must pass to invoke but you can pass null or undefined or '', cc will pick one instance of this CcClass
 * @param {*} method
 * @param {*} args
 * @returns
 */
export default function (ccClassKey, ccInstanceKey, method, ...args) {
  const { ccClassKey_ccClassContext_, ccKey_ref_ } = ccContext;
  const classContext = ccClassKey_ccClassContext_[ccClassKey];
  if (!classContext) {
    const err = util.makeError(ERR.CC_CLASS_NOT_FOUND, vbi(` ccClassKey:${ccClassKey}`));
    if (ccContext.isStrict) throw err;
    else return console.error(err);
  }

  let ref;
  if (ccInstanceKey) {
    const ccKey = util.makeUniqueCcKey(ccClassKey, ccInstanceKey);
    ref = ccKey_ref_[ccKey];
  } else {
    const ccKeys = classContext.ccKeys;
    ref = ccKey_ref_[ccKeys[0]];// pick first one
  }

  if (!ref) {
    const err = util.makeError(ERR.CC_CLASS_INSTANCE_NOT_FOUND, vbi(` ccClassKey:${ccClassKey} ccKey:${ccInstanceKey}`));
    // only error, the target instance may has been unmounted really!
    return console.error(err.message);
  }

  var fn = ref[method];
  if (!fn) {
    const err = util.makeError(ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND, vbi(` method:${method}`));
    // only error
    return console.error(err.message);
  }
  ref[method].call(ref, ...args);
}