import { HAS_SYMBOL, IS_ATOM } from '../../consts';
import { getHelp, getMarkAtomMap } from '../root';

const insDepScope = getHelp().insDepScope;
const markAtomMap = getMarkAtomMap();

export function getInsKey() {
  let keySeed = insDepScope.keySeed;
  keySeed = keySeed === Number.MAX_SAFE_INTEGER ? 1 : keySeed + 1;
  insDepScope.keySeed = keySeed;
  return keySeed;
}

export function isAtomProxy(mayAtomProxy: any) {
  if (!mayAtomProxy) {
    return false;
  }
  if (!HAS_SYMBOL) {
    return markAtomMap.get(mayAtomProxy);
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
