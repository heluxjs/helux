import ccContext from '../cc-context';
import util from '../support/util';
import { ERR } from '../support/constant';
var vbi = util.verboseInfo;
var PICK_RANDOM_INS = 1;
var PICK_SPECIFIED_INS = 2;
var PICK_SINGLETON_INS = 3;
/**
 * @description
 * @author zzk
 * @export
 * @param {string} keyDesc '{ccClassKey}' |  '{ccClassKey}/'  | '{ccClassKey}/{ccKey}'
 * @param {string} method
 * @param {any[]} args
 * @returns
 */

export default function (keyDesc, method) {
  var _ref$method;

  var ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_,
      ccKey_ref_ = ccContext.ccKey_ref_;
  var ccClassKey = '',
      ccKey = '';

  if (keyDesc.includes('/')) {
    var _keyDesc$split = keyDesc.split('/'),
        key1 = _keyDesc$split[0],
        key2 = _keyDesc$split[1];

    ccClassKey = key1, ccKey = key2;
  } else {
    ccClassKey = keyDesc;
  }

  var classContext = ccClassKey_ccClassContext_[ccClassKey];

  if (!classContext) {
    var err = util.makeError(ERR.CC_CLASS_NOT_FOUND, vbi(" ccClassKey:" + ccClassKey));
    if (ccContext.isStrict) throw err;else return console.error(err);
  }

  var ref;

  if (ccKey) {
    var ccUniKey = util.makeUniqueCcKey(ccClassKey, ccKey);
    ref = ccKey_ref_[ccUniKey];
  } else {
    var ccKeys = classContext.ccKeys;
    ref = ccKey_ref_[ccKeys[0]]; // pick first one
  }

  if (!ref) {
    var _err = util.makeError(ERR.CC_CLASS_INSTANCE_NOT_FOUND, vbi(" ccClassKey:" + ccClassKey + " ccKey:" + ccKey)); // only error, the target instance may has been unmounted really!


    return console.error(_err.message);
  }

  var fn = ref[method];

  if (!fn) {
    var _err2 = util.makeError(ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND, vbi(" method:" + method)); // only error


    return console.error(_err2.message);
  }

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  (_ref$method = ref[method]).call.apply(_ref$method, [ref].concat(args));
}