import { strictWarning } from '../../support/util';
import pickOneRef from '../ref/pick-one-ref';

function _setState(state, options) {
  try {
    const ref = pickOneRef(options.module);
    ref.ctx.changeState(state, options);
  } catch (err) {
    strictWarning(err);
  }
}

export function innerSetState(module, state, stateChangedCb) {
  _setState(state, { module, stateChangedCb });
}

export default function (module, state, renderKey, delay = -1, skipMiddleware) {
  _setState(state, { ccKey: '[[top api:setState]]', module, renderKey, delay, skipMiddleware });
};