import { noop } from '@helux/utils';
import { FROM, STATE_TYPE } from '../consts';
import { useAtom } from '../hooks/useAtom';
import { useReactive } from '../hooks/useReactive';
import type { CoreApiCtx } from '../types/api-ctx';
import type { Dict, Fn, IAtomCtx, ICreateOptions, IRunMutateOptions, ISharedCtx } from '../types/base';
import { action } from './createAction';
import { mutate, mutateDict, runMutate, runMutateTask } from './createMutate';
import { buildSharedObject } from './creator';
import { flush, reactiveDesc } from './creator/buildReactive';
import { setAtomVal } from './creator/current';
import { getGlobalEmpty, initGlobalEmpty } from './creator/globalId';
import { initGlobalLoading, initLoadingCtx } from './creator/loading';
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

function defineActions(actionCreator: any, actionDict: Dict) {
  const actions: Dict = {};
  Object.keys(actionDict).forEach((key) => {
    actions[key] = actionCreator(actionDict[key], key);
  });
  return actions;
}

function defineMutateDerives(apiCtx: CoreApiCtx, initalState: Dict, deriveDict: Dict) {
  const [state] = share(apiCtx, initalState);
  const resultDict = mutateDict(state)(deriveDict);
  return resultDict;
}

export function createSharedLogic(innerOptions: IInnerOptions, createOptions?: any): any {
  const { stateType, apiCtx } = innerOptions;
  ensureGlobal(apiCtx, stateType);
  const { sharedState: state, internal } = buildSharedObject(innerOptions, createOptions);
  const { syncer, sync, forAtom, setState, sharedKey, sharedKeyStr, rootValKey, reactive, reactiveRoot } = internal;
  const actionCreator = action(state);
  const opt = { internal, from: MUTATE, apiCtx };
  const ldMutate = initLoadingCtx(createSharedLogic, opt);
  const ldAction = initLoadingCtx(createSharedLogic, { ...opt, from: ACTION });
  const setOnReadHook = (onRead: Fn) => (internal.onRead = onRead);
  // TODO
  // add defineActions defineMutates defineWatches

  return {
    state,
    setState,
    defineActions: () => (actionDict: Dict) => defineActions(actionCreator, actionDict),
    defineMutateDerives: (initalState: Dict, deriveDict: Dict) => defineMutateDerives(apiCtx, initalState, deriveDict),
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
