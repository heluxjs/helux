import { strictWarning } from '../../support/share';
import pickOneRef from '../ref/pick-one-ref';

export default function (module, state, renderKey, delay = -1, skipMiddleware) {
  try {
    const ref = pickOneRef(module);
    const option = { ccKey: '[[top api:setState]]', module, renderKey, delay, skipMiddleware };
    ref.ctx.changeState(state, option);
  } catch (err) {
    strictWarning(err);
  }
}