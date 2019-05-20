import util from '../../support/util';
import { BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE, STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, MODULE_GLOBAL } from '../../support/constant';
import pickOneRef from './pick-one-ref';
/****
 * if you are sure the input state is really belong to global state, call cc.setGlobalState,
 * note! cc will filter the input state to meet global state shape and only pass the filtered state to global module
 */

export default function (state, lazyMs, throwError) {
  if (lazyMs === void 0) {
    lazyMs = -1;
  }

  if (throwError === void 0) {
    throwError = false;
  }

  try {
    var ref = pickOneRef();
    ref.setGlobalState(state, lazyMs, BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE);
  } catch (err) {
    if (throwError) throw err;else util.justWarning(err.message);
  }
}