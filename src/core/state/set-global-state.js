import util from '../../support/util';
import pickOneRef from '../ref/pick-one-ref';

/****
 * if you are sure the input state is really belong to global state, call cc.setGlobalState,
 * note! cc will filter the input state to meet global state shape and only pass the filtered state to global module
 */
export default function (state, delayMs = -1, throwError = false) {
  try {
    const ref = pickOneRef();
    ref.ctx.setGlobalState(state, delayMs);
  } catch (err) {
    if (throwError) throw err;
    else util.justWarning(err.message);
  }
}