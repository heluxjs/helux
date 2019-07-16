import { strictWarning } from '../../support/util';
import pickOneRef from '../ref/pick-one-ref';

export default function (module, state, delay = -1, identity, skipMiddleware) {
  try {
    const ref = pickOneRef(module);
    const option = { ccKey: '[[top api:cc.setState]]', module, delay, identity, skipMiddleware };
    if (!ref.$$changeState) {
      ref.__fragmentParams.changeState(state, option);
      return;
    }
    ref.$$changeState(state, option);
  } catch (err) {
    strictWarning(err);
  }
}