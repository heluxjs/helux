import { FROM, STATE_TYPE } from '../consts';
import { useAtom, useShared } from '../hooks/useShared';
import type { Dict, Fn, IAtomCreateOptions, IAtomCtx, ICreateOptions, ISharedCtx } from '../types';
import { action, actionAsync, atomAction, atomActionAsync } from './createAction';
import { atomMutate, mutate } from './createMutate';
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

export function ensureGlobal(inputStateType?: string) {
  const stateType = inputStateType || USER_STATE;
  if (USER_STATE === stateType && !getGlobalEmpty()) {
    initGlobalEmpty(createSharedLogic);
    initGlobalLoading(createSharedLogic);
  }
}

export function createSharedLogic(innerOptions: IInnerOptions, createOptions?: any): any {
  ensureGlobal(innerOptions.stateType);
  const { sharedState: state, internal } = buildSharedObject(innerOptions, createOptions);
  const { syncer, sync, forAtom, setDraft: setState } = internal;
  const { useFn, actionCreator, asyncActionCreator, mutateCreator } = getFns(state, forAtom);
  const { getLoading: getMutateLoading, useLoading: useMutateLoading } = initLoadingCtx(createSharedLogic, internal, MUTATE);
  const { getLoading: getActionLoading, useLoading: useActionLoading } = initLoadingCtx(createSharedLogic, internal, ACTION);

  return {
    state,
    setState,
    mutate: mutateCreator,
    action: actionCreator,
    asyncAction: asyncActionCreator,
    call: (fn: Fn, ...args: any[]) => actionCreator(fn)(...args),
    asyncCall: (fn: Fn, ...args: any[]) => asyncActionCreator(fn)(...args),
    useState: (options?: any) => useFn(state, options),
    getMutateLoading,
    useMutateLoading,
    getActionLoading,
    useActionLoading,
    sync,
    syncer,
  };
}

/** expose share ctx as object */
export function shareState<T = Dict, O extends ICreateOptions<T> = ICreateOptions<T>>(
  rawState: T | (() => T),
  options?: O,
): ISharedCtx<T, O> {
  return createSharedLogic({ rawState }, options);
}

/** expose atom ctx as object */
export function shareAtom<T = any, O extends IAtomCreateOptions<T> = IAtomCreateOptions<T>>(
  rawState: any | (() => any),
  options?: O,
): IAtomCtx<T, O> {
  return createSharedLogic({ rawState, forAtom: true }, options);
}

/** expose share ctx as tuple */
export function share<T = Dict, O extends ICreateOptions<T> = ICreateOptions<T>>(rawState: T | (() => T), options?: O) {
  const ctx = createSharedLogic({ rawState }, options) as ISharedCtx<T, O>;
  return [ctx.state, ctx.setState, ctx] as const;
}

/**
 * expose atom ctx as tuple，支持共享 primitive 类型值
 */
export function atom<T = any, O extends IAtomCreateOptions<T> = IAtomCreateOptions<T>>(rawState: T | (() => T), options?: O) {
  const ctx = createSharedLogic({ rawState, forAtom: true }, options) as IAtomCtx<T, O>;
  return [ctx.state, ctx.setState, ctx] as const;
}
