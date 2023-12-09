import { noop } from '@helux/utils';
import { FROM, STATE_TYPE } from '../consts';
import { runDerive, runDeriveTask } from '../helpers/fnRunner';
import { useAtom } from '../hooks/useAtom';
import { useDerived } from '../hooks/useDerived';
import { useReactive } from '../hooks/useReactive';
import type { CoreApiCtx } from '../types/api-ctx';
import type { Dict, Fn, IAtomCtx, ICreateOptions, IRunMutateOptions, ISharedCtx } from '../types/base';
import { action } from './createAction';
import { derive } from './createDerived';
import { mutate, mutateDict, runMutate, runMutateTask } from './createMutate';
import { buildSharedObject } from './creator';
import type { TInternal } from './creator/buildInternal';
import { flush, reactiveDesc } from './creator/buildReactive';
import { setAtomVal } from './creator/current';
import { getGlobalEmpty, initGlobalEmpty } from './creator/globalId';
import { getLoadingInfo, initGlobalLoading, initLoadingCtx } from './creator/loading';
import type { IInnerOptions } from './creator/parse';

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
  options: { internal: TInternal; apiCtx: CoreApiCtx; createFn: any; ldAction: Dict; actionCreator: any; actionDict: Dict },
  throwErr?: boolean,
) {
  const { createFn, ldAction, actionDict, actionCreator, internal, apiCtx } = options;
  // 提前触发伴生loading状态创建
  getLoadingInfo(createFn, { internal, from: 'Action', apiCtx });
  const actions: Dict = {};
  Object.keys(actionDict).forEach((key) => {
    actions[key] = actionCreator(actionDict[key], key, throwErr);
  });
  return {
    actions,
    getLoading: () => ldAction.getLoading(actions),
    useLoading: () => ldAction.useLoading(actions),
  };
}

function defineMutateDerive(options: { apiCtx: CoreApiCtx; ldMutate: Dict; inital: Dict; mutateFnDict: Dict }) {
  const { apiCtx, ldMutate, inital, mutateFnDict } = options;
  const [state] = share(apiCtx, inital);
  const witnessDict = mutateDict(state)(mutateFnDict);
  return {
    derivedState: state,
    witnessDict,
    getLoading: () => ldMutate.getLoading(witnessDict),
    useLoading: () => ldMutate.useLoading(witnessDict),
  };
}

function defineFullDerive(options: { apiCtx: CoreApiCtx; deriveFnDict: Dict; throwErr?: boolean }) {
  const { apiCtx, deriveFnDict, throwErr } = options;
  const derivedResult: Dict = {};
  const helper: Dict = {};
  Object.keys(deriveFnDict).forEach((key) => {
    const result = derive(deriveFnDict[key]);
    derivedResult[key] = result;
    helper[key] = {
      runDerive: (te?: boolean) => runDerive(result, te ?? throwErr),
      runDeriveTask: (te?: boolean) => runDeriveTask(result, te ?? throwErr),
      useDerived: (options: any) => useDerived(apiCtx, result, options),
    };
  });
  return {
    derivedResult,
    helper,
  };
}

export function createSharedLogic(innerOptions: IInnerOptions, createOptions?: any): any {
  const { stateType, apiCtx } = innerOptions;
  ensureGlobal(apiCtx, stateType);
  const { sharedState: state, internal } = buildSharedObject(innerOptions, createOptions);
  const { syncer, sync, forAtom, setState, sharedKey, sharedKeyStr, rootValKey, reactive, reactiveRoot } = internal;
  const actionCreator = action(state);
  const opt = { internal, from: MUTATE, apiCtx };
  const createFn = createSharedLogic;
  const ldAction = initLoadingCtx(createFn, { ...opt, from: ACTION });
  const ldMutate = initLoadingCtx(createFn, opt);
  const setOnReadHook = (onRead: Fn) => (internal.onRead = onRead);
  const common = { createFn, internal, apiCtx };

  return {
    state,
    setState,
    defineActions: (throwErr?: boolean) => (actionDict: Dict) =>
      defineActions({ ...common, ldAction, actionCreator, actionDict }, throwErr),
    defineMutateDerive: (inital: Dict, mutateFnDict: Dict) => defineMutateDerive({ ...common, ldMutate, inital, mutateFnDict }),
    defineFullDerive: (throwErr?: boolean) => (deriveFnDict: Dict) => defineFullDerive({ apiCtx, deriveFnDict, throwErr }),
    mutate: mutate(state),
    runMutate: (descOrOptions: string | IRunMutateOptions) => runMutate(state, descOrOptions),
    runMutateTask: (descOrOptions: string | IRunMutateOptions) => runMutateTask(state, descOrOptions),
    action: actionCreator,
    call: (fn: Fn, payload: any) => actionCreator(fn)(payload),
    useState: (options?: any) => useAtom(apiCtx, state, options),
    getMutateLoading: ldMutate.getLoading,
    useMutateLoading: ldMutate.useLoading,
    getActionLoading: ldAction.getLoading,
    useActionLoading: ldAction.useLoading,
    sync,
    syncer,
    setAtomVal: forAtom ? setAtomVal : noop,
    setOnReadHook,
    sharedKey,
    sharedKeyStr,
    rootValKey,
    reactive,
    reactiveRoot,
    reactiveDesc: (desc: string) => reactiveDesc(state, desc),
    useReactive: (options?: any) => useReactive(apiCtx, options),
    flush: (desc?: string) => flush(state, desc),
  };
}

/** expose share ctx as object */
export function shareState<T = Dict, O extends ICreateOptions<T> = ICreateOptions<T>>(
  apiCtx: CoreApiCtx,
  rawState: T | (() => T),
  options?: O,
): ISharedCtx<T> {
  return createSharedLogic({ apiCtx, rawState }, options);
}

/** expose atom ctx as object */
export function shareAtom<T = any, O extends ICreateOptions<T> = ICreateOptions<T>>(
  apiCtx: CoreApiCtx,
  rawState: any | (() => any),
  options?: O,
): IAtomCtx<T> {
  return createSharedLogic({ apiCtx, rawState, forAtom: true }, options);
}

/** expose share ctx as tuple */
export function share<T = Dict, O extends ICreateOptions<T> = ICreateOptions<T>>(apiCtx: CoreApiCtx, rawState: T | (() => T), options?: O) {
  const ctx = createSharedLogic({ apiCtx, rawState }, options) as ISharedCtx<T>;
  return [ctx.state, ctx.setState, ctx] as const;
}

/**
 * expose atom ctx as tuple，支持共享 primitive 类型值
 */
export function atom<T = any, O extends ICreateOptions<T> = ICreateOptions<T>>(apiCtx: CoreApiCtx, rawState: T | (() => T), options?: O) {
  const ctx = createSharedLogic({ apiCtx, rawState, forAtom: true }, options) as IAtomCtx<T>;
  return [ctx.state, ctx.setState, ctx] as const;
}
