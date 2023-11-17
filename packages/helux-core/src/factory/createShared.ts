import { FROM, STATE_TYPE } from '../consts';
import { useAtom, useShared } from '../hooks/useShared';
import type { CoreApiCtx } from '../types/api-ctx';
import type { Dict, Fn, IAtomCreateOptions, IAtomCtx, ICreateOptions, IRunMutateOptions, ISharedCtx } from '../types/base';
import { action, actionAsync, atomAction, atomActionAsync } from './createAction';
import { atomMutate, mutate, runMutate, runMutateTask } from './createMutate';
import { buildSharedObject } from './creator';
import { getGlobalEmpty, initGlobalEmpty } from './creator/globalId';
import { initGlobalLoading, initLoadingCtx } from './creator/loading';
import type { IInnerOptions } from './creator/parse';

const { USER_STATE } = STATE_TYPE;
const { MUTATE, ACTION } = FROM;

function getFns(state: any, forAtom: boolean) {
  if (forAtom) {
    return {
      useFn: useAtom,
      actionCreator: atomAction(state),
      asyncActionCreator: atomActionAsync(state),
      mutateCreator: atomMutate(state),
    };
  }
  return {
    useFn: useShared,
    actionCreator: action(state),
    asyncActionCreator: actionAsync(state),
    mutateCreator: mutate(state),
  };
}

export function ensureGlobal(apiCtx: CoreApiCtx, inputStateType?: string) {
  const stateType = inputStateType || USER_STATE;
  if (USER_STATE === stateType && !getGlobalEmpty()) {
    initGlobalEmpty(apiCtx, createSharedLogic);
    initGlobalLoading(apiCtx, createSharedLogic);
  }
}

export function createSharedLogic(innerOptions: IInnerOptions, createOptions?: any): any {
  const { stateType, apiCtx } = innerOptions;
  ensureGlobal(apiCtx, stateType);
  const { sharedState: state, internal } = buildSharedObject(innerOptions, createOptions);
  const { syncer, sync, forAtom, setDraft: setState } = internal;
  const { useFn, actionCreator, asyncActionCreator, mutateCreator } = getFns(state, forAtom);
  const opt = { internal, from: MUTATE, apiCtx };
  const ldMutate = initLoadingCtx(createSharedLogic, opt);
  const ldAction = initLoadingCtx(createSharedLogic, { ...opt, from: ACTION });

  return {
    state,
    setState,
    mutate: mutateCreator,
    runMutate: (descOrOptions: string | IRunMutateOptions) => runMutate(state, descOrOptions),
    runMutateTask: (descOrOptions: string | IRunMutateOptions) => runMutateTask(state, descOrOptions),
    action: actionCreator,
    asyncAction: asyncActionCreator,
    call: (fn: Fn, ...args: any[]) => actionCreator(fn)(...args),
    asyncCall: (fn: Fn, ...args: any[]) => asyncActionCreator(fn)(...args),
    useState: (options?: any) => useFn(apiCtx, state, options),
    getMutateLoading: ldMutate.getLoading,
    useMutateLoading: ldMutate.useLoading,
    getActionLoading: ldAction.getLoading,
    useActionLoading: ldAction.useLoading,
    sync,
    syncer,
  };
}

/** expose share ctx as object */
export function shareState<T = Dict, O extends ICreateOptions<T> = ICreateOptions<T>>(
  apiCtx: CoreApiCtx,
  rawState: T | (() => T),
  options?: O,
): ISharedCtx<T, O> {
  return createSharedLogic({ apiCtx, rawState }, options);
}

/** expose atom ctx as object */
export function shareAtom<T = any, O extends IAtomCreateOptions<T> = IAtomCreateOptions<T>>(
  apiCtx: CoreApiCtx,
  rawState: any | (() => any),
  options?: O,
): IAtomCtx<T, O> {
  return createSharedLogic({ apiCtx, rawState, forAtom: true }, options);
}

/** expose share ctx as tuple */
export function share<T = Dict, O extends ICreateOptions<T> = ICreateOptions<T>>(apiCtx: CoreApiCtx, rawState: T | (() => T), options?: O) {
  const ctx = createSharedLogic({ apiCtx, rawState }, options) as ISharedCtx<T, O>;
  return [ctx.state, ctx.setState, ctx] as const;
}

/**
 * expose atom ctx as tuple，支持共享 primitive 类型值
 */
export function atom<T = any, O extends IAtomCreateOptions<T> = IAtomCreateOptions<T>>(
  apiCtx: CoreApiCtx,
  rawState: T | (() => T),
  options?: O,
) {
  const ctx = createSharedLogic({ apiCtx, rawState, forAtom: true }, options) as IAtomCtx<T, O>;
  return [ctx.state, ctx.setState, ctx] as const;
}
