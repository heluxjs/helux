import util from '../../support/util';
import {
  BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE,
} from '../../support/constant';
import pickOneRef from '../ref/pick-one-ref';

/****
 * if you are sure the input state is really belong to global state, call cc.setGlobalState,
 * note! cc will filter the input state to meet global state shape and only pass the filtered state to global module
 */
export default function (state, lazyMs = -1, throwError = false) {
  try {
    const ref = pickOneRef();
    ref.setGlobalState(state, lazyMs, BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE);
  } catch (err) {
    if (throwError) throw err;
    else util.justWarning(err.message);
  }
}