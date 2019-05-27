import util from '../../support/util';
import { BROADCAST_TRIGGERED_BY_CC_API_SET_STATE, STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE } from '../../support/constant';
import pickOneRef from '../ref/pick-one-ref';
export default function (module, state, lazyMs, throwError) {
  if (lazyMs === void 0) {
    lazyMs = -1;
  }

  if (throwError === void 0) {
    throwError = false;
  }

  try {
    var ref = pickOneRef(module);
    ref.$$changeState(state, {
      ccKey: '[[top api:cc.setState]]',
      module: module,
      stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
      broadcastTriggeredBy: BROADCAST_TRIGGERED_BY_CC_API_SET_STATE,
      lazyMs: lazyMs
    });
  } catch (err) {
    if (throwError) throw err;else util.justWarning(err.message);
  }
}