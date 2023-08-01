import type { Dict, IBaseCreateOptionsFull, ICreateOptionsType, ModuleName, SharedObject } from '../types';
import { buildSharedObject, parseOptions } from './creator';

type Mutable<T extends Dict = Dict> = T;
type NextState<T extends Dict = Dict> = T;

function buildReturn(rawState: any, inputOptions: any, isDeep: boolean) {
  const options = parseOptions(inputOptions);
  const [state, setState] = buildSharedObject(rawState, { ...options, isDeep });
  return {
    state,
    call: (srvFn: any, ...args: any[]) => {
      Promise.resolve(srvFn({ state, setState, args })).then((partialState) => {
        partialState && setState(partialState);
      });
    },
    setState,
  };
}

export function createShared<T extends Dict = Dict>(
  rawState: T | (() => T),
  strBoolOrCreateOptions?: ICreateOptionsType,
): {
  state: SharedObject<T>;
  call: <A extends any[] = any[]>(
    srvFn: (ctx: { args: A; state: T; setState: (partialState: Partial<T>) => void }) => Promise<Partial<T>> | Partial<T> | void,
    ...args: A
  ) => void;
  setState: (partialState: Partial<T>) => void;
} {
  return buildReturn(rawState, strBoolOrCreateOptions, false);
}

export function createDeepShared<T extends Dict = Dict>(
  rawState: T | (() => T),
  createOptions?: ModuleName | IBaseCreateOptionsFull,
): {
  state: SharedObject<T>;
  call: <A extends any[] = any[]>(
    srvFn: (ctx: {
      args: A;
      state: T;
      setState: (recipe: (mutable: Mutable<T>) => void) => NextState;
    }) => Promise<Partial<T>> | Partial<T> | void,
    ...args: A
  ) => void;
  setState: (recipe: (mutable: Mutable<T>) => void) => NextState;
} {
  return buildReturn(rawState, createOptions, true);
}
