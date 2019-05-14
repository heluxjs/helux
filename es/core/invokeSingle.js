import ccContext from '../cc-context';
import invoke from './invoke';
import util from '../support/util';
import { ERR } from '../support/constant';
var vbi = util.verboseInfo;
var ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_,
    ccKey_ref_ = ccContext.ccKey_ref_;
export default function (ccClassKey, method) {
  var classContext = ccClassKey_ccClassContext_[ccClassKey];

  if (!classContext.isSingle) {
    var err = util.makeError(ERR.CC_CLASS_IS_NOT_SINGLE_BUT_YOU_CALL_INVOKE_SINGLE, vbi("ccClassKey:" + ccClassKey)); // only error, the target instance may has been unmounted really!

    return console.error(err.message);
  }

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  invoke.apply(void 0, [ccClassKey, ccClassKey, method].concat(args));
}