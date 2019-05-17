import util from '../support/util';
import {CC_FRAGMENT_PREFIX} from '../support/constant';
import ccContext from '../cc-context';
import pickOneRef from './helper/pick-one-ref';

export default function (action, payLoadWhenActionIsString, identity='', [ccClassKey, ccKey, throwError] = []) {
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
      let module = '';
      if(typeof action == 'string' && action.includes('/')){
        module = action.split('/')[0];
      }

      const ref = pickOneRef(module);
      if (ref.cc.ccState.ccClassKey.startsWith(CC_FRAGMENT_PREFIX)) {
        ref.__fragmentParams.dispatch(action, payLoadWhenActionIsString, identity);
      } else {
        ref.$$dispatchForModule(action, payLoadWhenActionIsString, identity);
      }
    }
  } catch (err) {
    if (throwError) throw err;
    else util.justWarning(err.message);
  }
}