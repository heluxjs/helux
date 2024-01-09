import { isFn } from '@helux/utils';
import { FROM, STATE_TYPE } from '../consts';
import { innerRunDerive, innerRunDeriveTask } from '../helpers/fnRunner';
import { getBoundStateInfo, getInternal, getSnap } from '../helpers/state';
import { useAtom, useAtomX, useDerived, useGlobalForceUpdate, useLocalForceUpdate, useMutable, useReactive, useReactiveX } from '../hooks';
import type { CoreApiCtx } from '../types/api-ctx';
import type {
  Action,
  ActionTask,
  CtxCreateOptions,
  Dict,
  DictOrCb,
  Fn,
  IAtomCtx,
  ICreateOptions,
  IRunMutateOptions,
  ISharedCtx,
  MutateFnStdDict,
  SharedState,
} from '../types/base';
import { action } from './createAction';
import { derive } from './createDerived';
import { mutate, mutateDict, runMutate, runMutateTask } from './createMutate';
import { buildSharedObject } from './creator';
import type { TInternal } from './creator/buildInternal';
import { getGlobalEmpty, initGlobalEmpty } from './creator/globalId';
import { getLoadingInfo, initGlobalLoading, initLoadingCtx } from './creator/loading';
import { isTaskProm } from './creator/mutateFn';
import type { IInnerOptions } from './creator/parse';
import { flush, reactiveDesc } from './creator/reactive';

const { USER_STATE } = STATE_TYPE;
const { MUTATE, ACTION } = FROM;

interface ICommon {
  createFn: Fn;
  internal: TInternal;
  apiCtx: CoreApiCtx;
  state: any;
  stateRoot: any;
  isAtom: boolean;
}

export function ensureGlobal(apiCtx: CoreApiCtx, inputStateType?: string) {
  const stateType = inputStateType || USER_STATE;
  if (USER_STATE === stateType && !getGlobalEmpty()) {
    initGlobalEmpty(apiCtx, createSharedLogic);
    initGlobalLoading(apiCtx, createSharedLogic);
  }
}

function defineActions(
  options: {
    internal: TInternal;
    apiCtx: CoreApiCtx;
    createFn: any;
    ldAction: Dict;
    actionCreator: any;
    actionDict: Dict;
    forTp?: boolean;
  },
  throwErr?: boolean,
) {
  const { createFn, ldAction, actionDict, actionCreator, internal, apiCtx, forTp = false } = options;
  // 提前触发伴生loading状态创建
  getLoadingInfo(createFn, { internal, from: ACTION, apiCtx });
  const actions: Dict = {};
  const eActions: Dict = {};
  Object.keys(actionDict).forEach((key) => {
    const actionOrFnDef = actionDict[key];
    // defineTpActions 传入的是已经创建好的 action 函数
    // 此时 actionOrFnDef 是 action 函数，这里提取 task 重新创建
    // defineActions 传入的是 actionFnDef 定义函数即 actionTask
    const actionTask = forTp ? actionOrFnDef.__task : actionOrFnDef;
    // actions 和 eActions 都不把 return 结果当做部分状态合并到 draft 上，仅作为普通结果返回
    const eActionFn = actionCreator(false)(actionTask, key, throwErr);

    // eActions 对应函数返回原始的 { result, snap, err } 结构，故此处指向 actionFn 即可
    eActionFn.__fnName = key;
    eActions[key] = eActionFn;

    // actions 对应函数需直接返回结果，故内部做拆解处理
    const actionFn = (...args: any[]) => {
      const ret = eActionFn(...args);
      if (isTaskProm(actionTask)) {
        return Promise.resolve(ret).then((data) => data.result);
      }
      return ret.result;
    };
    actionFn.__fnName = key;
    actions[key] = actionFn;
  });

  return {
    actions,
    eActions,
    getLoading: () => ldAction.getLoading(actions),
    useLoading: () => ldAction.useLoading(actions)[0],
    useLoadingInfo: () => ldAction.useLoading(actions),
  };
}

function ensureDict(common: ICommon, dict: DictOrCb, extra?: SharedState): Dict {
  const { state, stateRoot, isAtom } = common;
  const extraBound = getBoundStateInfo(extra);
  return isFn(dict) ? dict({ state, stateRoot, isAtom, extraBound }) : dict;
}

function defineMutate(options: { common: ICommon; ldMutate: Dict; mutateFnDict: DictOrCb; extra?: SharedState }) {
  const { common, ldMutate, mutateFnDict, extra } = options;
  const dict = ensureDict(common, mutateFnDict, extra);
  const witnessDict = mutateDict(common.stateRoot, extra)(dict);

  return {
    witnessDict,
    getLoading: () => ldMutate.getLoading(witnessDict),
    useLoading: () => ldMutate.useLoading(witnessDict)[0],
    useLoadingInfo: () => ldMutate.useLoading(witnessDict),
  };
}

function defineMutateDerive(options: { common: ICommon; ldMutate: Dict; inital: Dict; mutateFnDict: DictOrCb }) {
  const { common, ldMutate, inital, mutateFnDict } = options;
  const { stateRoot, useState, state, isAtom } = sharex(common.apiCtx, inital);
  const initialCommon = { ...common, stateRoot, state, isAtom, internal: getInternal(stateRoot) };
  // 注意此处是将原 common.stateRoot 作为 extra 转移给 defineMutate
  const result = defineMutate({ common: initialCommon, ldMutate, mutateFnDict, extra: common.stateRoot });
  return { derivedState: stateRoot, useDerivedState: useState, ...result };
}

function defineFullDerive(options: { common: ICommon; deriveFnDict: DictOrCb; throwErr?: boolean }) {
  const { common, deriveFnDict, throwErr } = options;
  const dict = ensureDict(common, deriveFnDict);
  const { apiCtx, stateRoot } = common;

  const derivedResult: Dict = {};
  const helper: Dict = {};
  Object.keys(dict).forEach((key) => {
    const result = derive(dict[key], stateRoot);
    derivedResult[key] = result;
    helper[key] = {
      runDerive: (te?: boolean) => innerRunDerive(result, te ?? throwErr),
      runDeriveTask: (te?: boolean) => innerRunDeriveTask(result, te ?? throwErr),
      useDerived: (options: any) => useDerived(apiCtx, result, options)[0],
      useDerivedInfo: (options: any) => useDerived(apiCtx, result, options),
    };
  });
  /** 对提供给用户使用的结果集做自动拆箱 */
  const result = new Proxy(derivedResult, {
    get: (t: any, k: any) => derivedResult[k].val,
  });

  return { result, helper };
}

function setEnableMutate(enabled: boolean, internal: TInternal) {
  internal.enableMutate = enabled;
  if (enabled) {
    const { mutateFnDict } = internal;
    const teBeRunFns: MutateFnStdDict = {};
    Object.keys(mutateFnDict).forEach((key) => {
      const fnItem = mutateFnDict[key];
      if (!fnItem.enabled) {
        // 标记已启用，下次不会被查出来
        fnItem.enabled = true;
        teBeRunFns[key] = fnItem;
      }
    });
    mutateDict(internal.sharedState)(teBeRunFns);
  }
}

function getOptions(internal: TInternal): CtxCreateOptions {
  const { moduleName, deep, recordLoading, stopDepth, stopArrDep, alertDeadCycleErr, checkDeadCycle, enableMutate } = internal;
  return { moduleName, deep, recordLoading, stopDepth, stopArrDep, alertDeadCycleErr, checkDeadCycle, enableMutate };
}

export function createSharedLogic(innerOptions: IInnerOptions, createOptions?: any): any {
  const { stateType, apiCtx } = innerOptions;
  ensureGlobal(apiCtx, stateType);
  const { sharedRoot: stateRoot, sharedState: state, internal } = buildSharedObject(innerOptions, createOptions);
  const { syncer, sync, forAtom, setState, setDraft, sharedKey, sharedKeyStr, rootValKey, reactive, reactiveRoot } = internal;
  const actionCreator = action(stateRoot);
  const actionTaskCreator = actionCreator(); // 注意此处是柯里化调用后才是目标 actionCreator
  const opt = { internal, from: MUTATE, apiCtx };
  const createFn = createSharedLogic;
  const ldAction = initLoadingCtx(createFn, { ...opt, from: ACTION });
  const ldMutate = initLoadingCtx(createFn, opt);
  const common: ICommon = { createFn, internal, apiCtx, state, stateRoot, isAtom: forAtom };
  const acCommon = { ...common, ldAction, actionCreator };

  return {
    state, // atom 的 state 指向拆箱后的值，share 的 state 指向根值
    stateVal: state,
    stateRoot, // 指向 root
    setState,
    setDraft,
    setEnableMutate: (enabled: boolean) => setEnableMutate(enabled, internal),
    getOptions: () => getOptions(internal),
    setOnReadHook: (onRead: Fn) => (internal.onRead = onRead),
    defineActions: (throwErr?: boolean) => (actionDict: Dict<ActionTask>) => defineActions({ ...acCommon, actionDict }, throwErr),
    defineTpActions: (throwErr?: boolean) => (actionDict: Dict<Action>) =>
      defineActions({ ...acCommon, actionDict, forTp: true }, throwErr),
    defineMutateDerive: (inital: Dict) => (mutateFnDict: DictOrCb) => defineMutateDerive({ common, ldMutate, inital, mutateFnDict }),
    defineMutateSelf: () => (mutateFnDict: DictOrCb) => defineMutate({ common, ldMutate, mutateFnDict }),
    defineFullDerive: (throwErr?: boolean) => (deriveFnDict: DictOrCb) => defineFullDerive({ common, deriveFnDict, throwErr }),
    mutate: mutate(stateRoot),
    runMutate: (descOrOptions: string | IRunMutateOptions) => runMutate(stateRoot, descOrOptions),
    runMutateTask: (descOrOptions: string | IRunMutateOptions) => runMutateTask(stateRoot, descOrOptions),
    action: actionCreator,
    call: (fn: Fn, payload: any, desc: string, throwErr: boolean) => actionTaskCreator(fn, desc, throwErr)(payload),
    useState: (options?: any) => useAtom(apiCtx, stateRoot, options),
    useStateX: (options?: any) => useAtomX(apiCtx, stateRoot, options),
    useForceUpdate: (presetDeps?: (sharedState: any) => any[]) => useGlobalForceUpdate(apiCtx, stateRoot, presetDeps),
    useLocalState: (initialState: any) => useMutable(apiCtx, initialState),
    useLocalForceUpdate: () => useLocalForceUpdate(apiCtx),
    getMutateLoading: ldMutate.getLoading,
    useMutateLoading: ldMutate.useLoading,
    getActionLoading: ldAction.getLoading,
    useActionLoading: ldAction.useLoading,
    getSnap: (isPrev?: boolean) => getSnap(stateRoot, isPrev),
    sync,
    syncer,
    sharedKey,
    sharedKeyStr,
    rootValKey,
    reactive,
    reactiveRoot,
    reactiveDesc: (desc: string) => reactiveDesc(stateRoot, desc),
    useReactive: (options?: any) => useReactive(apiCtx, stateRoot, options),
    useReactiveX: (options?: any) => useReactiveX(apiCtx, stateRoot, options),
    flush: (desc?: string) => flush(stateRoot, desc),
    isAtom: forAtom,
  };
}

/** expose share ctx as tuple */
export function share<T extends Dict = Dict, O extends ICreateOptions<T> = ICreateOptions<T>>(
  apiCtx: CoreApiCtx,
  rawState: T | (() => T),
  options?: O,
) {
  const ctx = createSharedLogic({ apiCtx, rawState }, options) as ISharedCtx<T>;
  return [ctx.stateRoot, ctx.setState, ctx] as const;
}

/** expose share ctx as object */
export function sharex<T extends Dict = Dict, O extends ICreateOptions<T> = ICreateOptions<T>>(
  apiCtx: CoreApiCtx,
  rawState: T | (() => T),
  options?: O,
): ISharedCtx<T> {
  return createSharedLogic({ apiCtx, rawState }, options);
}

/**
 * expose atom ctx as tuple，支持共享 primitive 类型值
 */
export function atom<T = any, O extends ICreateOptions<T> = ICreateOptions<T>>(apiCtx: CoreApiCtx, rawState: T | (() => T), options?: O) {
  const ctx = createSharedLogic({ apiCtx, rawState, forAtom: true }, options) as IAtomCtx<T>;
  return [ctx.stateRoot, ctx.setState, ctx] as const;
}

/** expose atom ctx as object */
export function atomx<T = any, O extends ICreateOptions<T> = ICreateOptions<T>>(
  apiCtx: CoreApiCtx,
  rawState: any | (() => any),
  options?: O,
): IAtomCtx<T> {
  return createSharedLogic({ apiCtx, rawState, forAtom: true }, options);
}
