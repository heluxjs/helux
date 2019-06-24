import util from '../../support/util';
import { STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE } from '../../support/constant';
import pickOneRef from '../ref/pick-one-ref';

export default function (module, state, delay = -1, identity, skipMiddleware, throwError = false) {
  try {
    const ref = pickOneRef(module);
    ref.$$changeState(state, {
      ccKey: '[[top api:cc.setState]]', module, stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
      delay, identity, skipMiddleware
    });
  } catch (err) {
    if (throwError) throw err;
    else util.justWarning(err.message);
  }
}