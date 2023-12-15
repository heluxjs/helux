import { getSafeNext, isMax } from '@helux/utils';
import { SCOPE_TYPE } from '../../consts';
import type { ScopeType } from '../../types/base';
import { getRootCtx } from '../root';
import { getBlockScope, getFnScope, getInsScope } from './speedup';

const fnKeyPrefix = {
  Mutate: '',
  Reactive: 'r',
  [SCOPE_TYPE.STATIC]: 's',
  [SCOPE_TYPE.HOOK]: 'h',
};

export function genInsKey() {
  const insScope = getInsScope();
  const nextKey = getSafeNext(insScope.keySeed);
  insScope.keySeed = nextKey;
  return nextKey;
}

export function genBlockKey() {
  const blockScope = getBlockScope();
  const { keySeed, keyPrefix } = blockScope;
  const nextKey = getSafeNext(keySeed);
  blockScope.keySeed = nextKey;

  let prefix = keyPrefix;
  if (isMax(keySeed)) {
    prefix = getSafeNext(keyPrefix);
    blockScope.keyPrefix = prefix;
  }
  return `${prefix}_${nextKey}`;
}

export function genRenderSN() {
  const ctx = getRootCtx();
  const renderSN = ctx.renderSN;
  const nextNo = renderSN === Number.MAX_VALUE ? 1 : renderSN + 1;
  ctx.renderSN = nextNo;
  return nextNo;
}

export function genFnKey(keyType: ScopeType | 'Mutate' | 'Reactive') {
  const prefix = fnKeyPrefix[keyType];
  const fnScope = getFnScope();
  const keyMap = fnScope.keySeed;
  const keySeed = getSafeNext(keyMap[keyType]);
  keyMap[keyType] = keySeed;
  return `${prefix}${keySeed}`;
}

export function getReactiveKey() {
  return genFnKey('Reactive');
}
