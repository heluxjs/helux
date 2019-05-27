import util from '../support/util';
import { CC_FRAGMENT_PREFIX } from '../support/constant';
import ccContext from '../cc-context';
import pickOneRef from '../core/ref/pick-one-ref';
export default function (action, payLoadWhenActionIsString, identity, _temp) {
  if (identity === void 0) {
    identity = '';
  }

  var _ref = _temp === void 0 ? [] : _temp,
      ccClassKey = _ref[0],
      ccKey = _ref[1],
      throwError = _ref[2];

  if (action === undefined && payLoadWhenActionIsString === undefined) {
    throw new Error("api doc: cc.dispatch(action:Action|String, payload?:any), when action is String, second param means payload");
  }

  try {
    if (ccClassKey && ccKey) {
      var uKey = util.makeUniqueCcKey(ccClassKey, ccKey);
      var targetRef = ccContext.refs[uKey];

      if (!targetRef) {
        throw new Error("no ref found for uniqueCcKey:" + uKey + "!");
      } else {
        targetRef.$$dispatch(action, payLoadWhenActionIsString);
      }
    } else {
      var module = '';

      if (typeof action == 'string' && action.includes('/')) {
        module = action.split('/')[0];
      }

      var ref = pickOneRef(module);

      if (ref.cc.ccState.ccClassKey.startsWith(CC_FRAGMENT_PREFIX)) {
        ref.__fragmentParams.dispatch(action, payLoadWhenActionIsString, identity);
      } else {
        ref.$$dispatchForModule(action, payLoadWhenActionIsString, identity);
      }
    }
  } catch (err) {
    if (throwError) throw err;else util.justWarning(err.message);
  }
}