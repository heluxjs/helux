import util from '../support/util';
import { BROADCAST_TRIGGERED_BY_CC_API_SET_STATE } from '../support/constant';
import cc from '../cc-context';
import * as helper from './helper';
export default function (module, state, throwError) {
  if (throwError === void 0) {
    throwError = false;
  }

  try {
    var ref = helper.pickOneRef(module);
    ref.setState(state, BROADCAST_TRIGGERED_BY_CC_API_SET_STATE);
  } catch (err) {
    if (throwError) throw err;else util.justWarning(err.message);
  }
}