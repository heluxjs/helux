import { strictWarning } from '../../support/util';
import pickOneRef from '../ref/pick-one-ref';

export default function (module, state, delay = -1, identity, skipMiddleware) {
  try {
    const ref = pickOneRef(module);
    ref.$$changeState(state, { ccKey: '[[top api:cc.setState]]', module, delay, identity, skipMiddleware });
  } catch (err) {
    strictWarning(err);
  }
}