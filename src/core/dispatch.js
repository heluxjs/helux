import util from '../support/util';
import ccContext from '../cc-context';
import pickOneRef from './helper/pick-one-ref';

export default function (action, payLoadWhenActionIsString, [ccClassKey, ccKey, throwError] = []) {
  if (action === undefined && payLoadWhenActionIsString === undefined) {
    throw new Error(`api doc: cc.dispatch(action:Action|String, payload?:any), when action is String, second param means payload`);
  }
  
  try {
    if (ccClassKey && ccKey) {
      const uKey = util.makeUniqueCcKey(ccClassKey, ccKey);
      const targetRef = ccContext.refs[uKey];
      if (!targetRef) {
        throw new Error(`no ref found for uniqueCcKey:${uKey}!`);
      } else {
        targetRef.$$dispatch(action, payLoadWhenActionIsString);
      }
    } else {
      const ref = pickOneRef();
      ref.$$dispatchForModule(action, payLoadWhenActionIsString);
    }
  } catch (err) {
    if (throwError) throw err;
    else util.justWarning(err.message);
  }
}