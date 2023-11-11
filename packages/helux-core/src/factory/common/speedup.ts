import { getRootCtx, RootCtx } from '../root';

const ctx = getRootCtx(); // ready after calling initHeluxContext
type ScopeKey = keyof typeof ctx;

function getCtxVal<K extends ScopeKey>(key: K): RootCtx[K] {
  const safeCtx = getRootCtx();
  const val = safeCtx[key];
  ctx[key] = val;
  return val;
}

export function getBlockScope() {
  return ctx.blockScope || getCtxVal('blockScope');
}

export function getFnScope() {
  return ctx.fnScope || getCtxVal('fnScope');
}

export function getSharedScope() {
  return ctx.sharedScope || getCtxVal('sharedScope');
}

export function getInsScope() {
  return ctx.insScope || getCtxVal('insScope');
}
