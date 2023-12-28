import { FROM, STATE_TYPE } from '../consts';
import { innerRunDerive, innerRunDeriveTask } from '../helpers/fnRunner';
import { useAtom, useDerived, useGlobalForceUpdate, useLocalForceUpdate, useMutable, useReactive } from '../hooks';
import type { CoreApiCtx } from '../types/api-ctx';
import type { Action, ActionTask, Dict, Fn, IAtomCtx, ICreateOptions, IRunMutateOptions, ISharedCtx } from '../types/base';
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

function defineMutate(options: { state: any; ldMutate: Dict; mutateFnDict: Dict }) {
  const { state, ldMutate, mutateFnDict } = options;
  const witnessDict = mutateDict(state)(mutateFnDict);

  return {
    witnessDict,
    getLoading: () => ldMutate.getLoading(witnessDict),
    useLoading: () => ldMutate.useLoading(witnessDict)[0],
    useLoadingInfo: () => ldMutate.useLoading(witnessDict),
  };
}

function defineMutateDerive(options: { apiCtx: CoreApiCtx; ldMutate: Dict; inital: Dict; mutateFnDict: Dict }) {
  const { apiCtx, ldMutate, inital, mutateFnDict } = options;
  const [state, , ctx] = share(apiCtx, inital);
  const result = defineMutate({ state, ldMutate, mutateFnDict });
  const useDerivedState = (options: any) => {
    const [state, , info] = ctx.useState(options);
    return [state, info];
  };

  return { derivedState: state, useDerivedState, ...result };
}

function defineFullDerive(options: { apiCtx: CoreApiCtx; deriveFnDict: Dict; throwErr?: boolean }) {
  const { apiCtx, deriveFnDict, throwErr } = options;
  const derivedResult: Dict = {};
  const helper: Dict = {};
  Object.keys(deriveFnDict).forEach((key) => {
    const result = derive(deriveFnDict[key]);
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

export function createSharedLogic(innerOptions: IInnerOptions, createOptions?: any): any {
  const { stateType, apiCtx } = innerOptions;
  ensureGlobal(apiCtx, stateType);
  const { sharedRoot: state, sharedState: stateVal, internal } = buildSharedObject(innerOptions, createOptions);
  const { syncer, sync, forAtom, setState, setDraft, sharedKey, sharedKeyStr, rootValKey, reactive, reactiveRoot } = internal;
  const actionCreator = action(state);
  const actionTaskCreator = actionCreator(); // 注意此处是柯里化调用后才是目标 actionCreator
  const opt = { internal, from: MUTATE, apiCtx };
  const createFn = createSharedLogic;
  const ldAction = initLoadingCtx(createFn, { ...opt, from: ACTION });
  const ldMutate = initLoadingCtx(createFn, opt);
  const setOnReadHook = (onRead: Fn) => (internal.onRead = onRead);
  const common = { createFn, internal, apiCtx };
  const acCommon = { ...common, ldAction, actionCreator };

  return {
    state, // 指向 root
    stateVal, // atom 的话 stateVal 是拆箱后的值，share 对象的话，stateVal 指向 root 自身
    setState,
    setDraft,
    defineActions: (throwErr?: boolean) => (actionDict: Dict<ActionTask>) => defineActions({ ...acCommon, actionDict }, throwErr),
    defineTpActions: (throwErr?: boolean) => (actionDict: Dict<Action>) =>
      defineActions({ ...acCommon, actionDict, forTp: true }, throwErr),
    defineMutateDerive: (inital: Dict) => (mutateFnDict: Dict) => defineMutateDerive({ ...common, ldMutate, inital, mutateFnDict }),
    defineMutateSelf: () => (mutateFnDict: Dict) => defineMutate({ ldMutate, state, mutateFnDict }),
    defineFullDerive: (throwErr?: boolean) => (deriveFnDict: Dict) => defineFullDerive({ apiCtx, deriveFnDict, throwErr }),
    mutate: mutate(state),
    runMutate: (descOrOptions: string | IRunMutateOptions) => runMutate(state, descOrOptions),
    runMutateTask: (descOrOptions: string | IRunMutateOptions) => runMutateTask(state, descOrOptions),
    action: actionCreator,
    call: (fn: Fn, payload: any, desc: string, throwErr: boolean) => actionTaskCreator(fn, desc, throwErr)(payload),
    useState: (options?: any) => useAtom(apiCtx, state, options),
    useForceUpdate: (presetDeps?: (sharedState: any) => any[]) => useGlobalForceUpdate(apiCtx, state, presetDeps),
    useLocalState: (initialState: any) => useMutable(apiCtx, initialState),
    useLocalForceUpdate: () => useLocalForceUpdate(apiCtx),
    getMutateLoading: ldMutate.getLoading,
    useMutateLoading: ldMutate.useLoading,
    getActionLoading: ldAction.getLoading,
    useActionLoading: ldAction.useLoading,
    sync,
    syncer,
    setOnReadHook,
    sharedKey,
    sharedKeyStr,
    rootValKey,
    reactive,
    reactiveRoot,
    reactiveDesc: (desc: string) => reactiveDesc(state, desc),
    useReactive: (options?: any) => useReactive(apiCtx, state, options),
    flush: (desc?: string) => flush(state, desc),
    isAtom: forAtom,
  };
}

/** expose share ctx as tuple */
export function share<T = Dict, O extends ICreateOptions<T> = ICreateOptions<T>>(apiCtx: CoreApiCtx, rawState: T | (() => T), options?: O) {
  const ctx = createSharedLogic({ apiCtx, rawState }, options) as ISharedCtx<T>;
  return [ctx.state, ctx.setState, ctx] as const;
}

/** expose share ctx as object */
export function sharex<T = Dict, O extends ICreateOptions<T> = ICreateOptions<T>>(
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
  return [ctx.state, ctx.setState, ctx] as const;
}

/** expose atom ctx as object */
export function atomx<T = any, O extends ICreateOptions<T> = ICreateOptions<T>>(
  apiCtx: CoreApiCtx,
  rawState: any | (() => any),
  options?: O,
): IAtomCtx<T> {
  return createSharedLogic({ apiCtx, rawState, forAtom: true }, options);
}
