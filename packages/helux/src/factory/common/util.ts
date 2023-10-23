import { HAS_SYMBOL, IS_ATOM } from '../../consts';
import { getHelp, getMarkAtomMap } from '../root';

export function isAtomProxy(mayAtomProxy: any) {
  if (!mayAtomProxy) {
    return false;
  }
  if (!HAS_SYMBOL) {
    return getMarkAtomMap().get(mayAtomProxy);
  }
  return mayAtomProxy[IS_ATOM];
}

export function getRenderSN() {
  const help = getHelp();
  const renderSN = help.renderSN;
  const nextNo = renderSN === Number.MAX_VALUE ? 1 : renderSN + 1;
  help.renderSN = nextNo;
  return nextNo;
}
