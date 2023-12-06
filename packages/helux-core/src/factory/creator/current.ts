import type { InsCtxDef } from '../../factory/creator/buildInternal';
import { newMutateCtx } from '../common/util';

const fakeDraftRoot = { val: null, isFake: true };
const fakeMutateCtx = newMutateCtx({});
/** 正在执行中的 rootDrft */
let CURRENT_DRAFT_ROOT = fakeDraftRoot;
/** 正在执行中的 mutateCtx */
let CURRENT_MUTATE_CTX = fakeMutateCtx;

/**
 * let code below works
 * ```ts
 * const [dict] = useAtom(dictAtom);
 * useWatch(()=>{}, ()=>[dict]);
 *
 * const [state] = useShared(dictShared);
 * useWatch(()=>{}, ()=>[state]);
 * ```
 */
const CURRENT_INS_CTX = new Map<any, InsCtxDef>();

export function setAtomVal(val: any) {
  CURRENT_DRAFT_ROOT.val = val;
}

export function currentDraftRoot() {
  return CURRENT_DRAFT_ROOT;
}

let CURRENT_INS_ON_READ: any = null;

export const INS_ON_READ = {
  current: () => CURRENT_INS_ON_READ,
  set: (onRead: any) => (CURRENT_INS_ON_READ = onRead),
};

export const INS_CTX = {
  current: (rootVal: any) => CURRENT_INS_CTX.get(rootVal),
  set: (rootVal: any, insCtx: InsCtxDef) => CURRENT_INS_CTX.set(rootVal, insCtx),
  del: (rootVal: any) => CURRENT_INS_CTX.delete(rootVal),
};

export const DRAFT_ROOT = {
  /** may use ' get current(){}...' in the future */
  current: () => CURRENT_DRAFT_ROOT,
  set: (draftRoot: any) => (CURRENT_DRAFT_ROOT = draftRoot),
  del: () => (CURRENT_DRAFT_ROOT = fakeDraftRoot),
};

export const MUTATE_CTX = {
  /** may use ' get current(){}...' in the future */
  current: () => CURRENT_MUTATE_CTX,
  set: (mctx: any) => (CURRENT_MUTATE_CTX = mctx),
  del: () => (CURRENT_MUTATE_CTX = fakeMutateCtx),
};
