
import getState from './get-state';
import extractStateByCcsync from '../core/state/extract-state-by-ccsync';

// todo, what this api mean?
export default function (moduledKeyPath, val) {
  if (!moduledKeyPath.includes('/')) {
    throw new Error(`keyPath must start with module`);
  }
  const [targetModule] = moduledKeyPath.split('/');
  const fullState = getState(targetModule);
  const { state } = extractStateByCcsync(moduledKeyPath, val, false, fullState, false);
  return state;
}