import { noop } from '@helux/utils';
import type { InsCtxDef } from '../../factory/creator/buildInternal';
import type { IReactiveMeta } from '../../types/inner';
import type { Fn } from '../../types/base';
import { fakeReativeMeta, fakeMutateCtx, fakeDraftRoot } from './fake';

/** 正在执行中的 rootDrft */
let CURRENT_DRAFT_ROOT = fakeDraftRoot;
/** 正在执行中的 mutateCtx */
let CURRENT_MUTATE_CTX = fakeMutateCtx;
/** 正在执行中的回调里的 reactive 对象 */
let CURRENT_CB_REACTIVE_KEY = '';

/**
 * let code below works
 * ```ts
 * const [shared] = useAtom(data);
 * useWatch(()=>{}, ()=>[shared]);
 * ```
 */
const CURRENT_INS_CTX = new Map<any, InsCtxDef>();

const CURRENT_REACTIVE_DESC = new Map<number, string>();

const CURRENT_REACTIVE_META = new Map<string, IReactiveMeta>();

let CURRENT_DEPS_CB: Fn = noop;

let CURRENT_FN_DEPS: string[] = [];

export function setAtomVal(val: any) {
  CURRENT_DRAFT_ROOT.val = val;
}

export function currentDraftRoot() {
  return CURRENT_DRAFT_ROOT;
}

export const DEPS_CB = {
  current: () => CURRENT_DEPS_CB,
  set: (cb: Fn) => CURRENT_DEPS_CB = cb,
  del: () => CURRENT_DEPS_CB = noop,
};

export const REACTIVE_DESC = {
  current: (key: number) => CURRENT_REACTIVE_DESC.get(key) || 'SetState',
  set: (key: number, desc: string) => CURRENT_REACTIVE_DESC.set(key, desc),
  del: (key: number) => CURRENT_REACTIVE_DESC.delete(key),
};


/** 记录、删除、读取 mutate fn 收集到的依赖，watchAndCallMutateDict 逻辑里需要读取 */
export const FN_DEP_KEYS = {
  current: () => CURRENT_FN_DEPS,
  set: (val: string[]) => CURRENT_FN_DEPS = val,
  del: () => CURRENT_FN_DEPS = [],
};

/** 记录、获取执行写操作的 draft 对象元数据 */
export const REACTIVE_META = {
  current: () => CURRENT_REACTIVE_META.get(CURRENT_CB_REACTIVE_KEY) || fakeReativeMeta,
  markUsing: (key: string) => CURRENT_CB_REACTIVE_KEY = key,
  set: (key: string, obj: IReactiveMeta) => CURRENT_REACTIVE_META.set(key, obj),
  del: (key: string) => CURRENT_REACTIVE_META.delete(key),
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
