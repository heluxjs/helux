import { IS_ATOM, HAS_SYMBOL } from '../../consts';
import { getMarkAtomMap } from '../root';

export function isAtomProxy(mayAtomProxy: any) {
  if (!mayAtomProxy) {
    return false;
  }
  if (!HAS_SYMBOL) {
    return getMarkAtomMap().get(mayAtomProxy);
  }
  return mayAtomProxy[IS_ATOM];
}
