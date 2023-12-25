import { atomx } from 'helux';
import type { IActionTaskParams, DraftType, UnconfirmedArg, IMutateTaskParam, IMutateFnItem, IMutateFnParams } from 'helux';

export function getInitial() {
  return {
    loading: false,
    list: [
      { id: 1, name: 'helux1', age: 11 },
      { id: 2, name: 'helux2', age: 12 },
      { id: 3, name: 'helux3', age: 13 },
    ],
    a: {
      b: { c: 1 },
      b1: { c1: 1 },
    },
    info: { name: 'helux', age: 1 },
    desc: 'awesome lib',
    extra: {
      mark: 'extra',
      toBeDrive: 0,
      prefixedMark: '',
      newName: '',
    },
    f: 1,
    g: 1,
    h: 1,
    j: 1,
    k: 1,
  };
}

export const ctx = atomx(getInitial, { moduleName: 'CompWithModule' });

export type State = typeof ctx.state;
export type Draft = DraftType<State>;
export type ActionTaskParams<P = UnconfirmedArg> = IActionTaskParams<State, P>;
export type MutateTaskParam<P = UnconfirmedArg> = IMutateTaskParam<State, P>;
export type MutateFnItem<P = any[]> = IMutateFnItem<State, P>;
export type MutateFnParams<P = any[]> = IMutateFnParams<State, P>;

export const {
  state,
} = ctx;
