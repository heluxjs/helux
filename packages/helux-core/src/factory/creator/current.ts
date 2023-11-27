import { newMutateCtx } from '../common/util';

const fakeDraftRoot = { val: null, isFake: true };
const fakeMutateCtx = newMutateCtx({});
/** 正在执行中的 rootDrft */
let CURRENT_DRAFT_ROOT = fakeDraftRoot;
/** 正在执行中的 mutateCtx */
let CURRENT_MUTATE_CTX = fakeMutateCtx;

export function setAtomVal(val: any) {
  CURRENT_DRAFT_ROOT.val = val;
}

export function currentDraftRoot() {
  return CURRENT_DRAFT_ROOT;
}

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
