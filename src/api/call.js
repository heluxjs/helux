import ccContext from '../cc-context';
import util from '../support/util';
import { ERR } from '../support/constant';

const vbi = util.verboseInfo;

/**
 * @description
 * @author zzk
 * @export
 * @param {string} keyDesc '{ccClassKey}' |  '{ccClassKey}/'  | '{ccClassKey}/{ccKey}'
 * @param {string} method
 * @param {any[]} args
 * @returns
 */
export default function (keyDesc, method, ...args) {
  const { ccClassKey_ccClassContext_, ccUkey_ref_ } = ccContext;

  let ccClassKey = ''; 
  let ccKey = '';
  if (keyDesc.includes('/')) {
    const [key1, key2] = keyDesc.split('/');
    ccClassKey = key1;
    ccKey = key2;
  }else{
    ccClassKey = keyDesc;
  }

  const classContext = ccClassKey_ccClassContext_[ccClassKey];
  if (!classContext) {
    const err = util.makeError(ERR.CC_CLASS_NOT_FOUND, vbi(`ccClassKey:${ccClassKey}`));
    if (ccContext.isStrict) throw err;
    else return console.error(err);
  }

  let ref;
  if (ccKey) {
    const ccUniKey = util.makeUniqueCcKey(ccClassKey, ccKey);
    ref = ccUkey_ref_[ccUniKey];
  } else {
    const ccKeys = classContext.ccKeys;
    ref = ccUkey_ref_[ccKeys[0]];// pick first one
  }

  if (!ref) {
    const err = util.makeError(ERR.CC_CLASS_INSTANCE_NOT_FOUND, vbi(`ccClassKey:${ccClassKey} ccKey:${ccKey}`));
    // only error, the target instance may has been unmounted really!
    return console.error(err.message);
  }

  var fn = ref[method];
  if (!fn) {
    const err = util.makeError(ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND, vbi(`method:${method}`));
    // only error
    return console.error(err.message);
  }
  ref[method].call(ref, ...args);
}