import type {
  Atom,
  Call,
  Dict,
  Fn,
  ICreateOptionsType,
  IInnerSetStateOptions,
  ISetStateOptions,
  NextState,
  SetAtom,
  SetState,
  SharedDict,
} from '../types';
import { asType, isFn } from '../utils';
import { buildSharedObject, handleDeepMutate, handleNormalMutate, parseOptions } from './creator';

export function createSharedLogic<T extends Dict = Dict>(
  params: { rawState: T | (() => T); forAtom?: boolean; forGlobal?: boolean },
  createOptions?: ICreateOptionsType<T>,
): { state: SharedDict<T>; setState: SetState<T>; call: Call<T> } {
  const options = parseOptions(createOptions);
  const { rawState, forAtom = false, forGlobal = false } = params;
  const { sharedState: state, internal } = buildSharedObject(rawState, { ...options, forAtom, forGlobal });
  const setState = forAtom ? internal.setAtom : internal.setState;

  return {
    state,
    setState,
    call: (srvFn: Fn, ...args: any[]): NextState<any> => {
      let ctx: { draft: Dict; finishMutate: any };
      const handleOpts = { ...options, forAtom, internal, sharedState: state };
      if (internal.isDeep) {
        ctx = handleDeepMutate(handleOpts);
      } else {
        ctx = handleNormalMutate(handleOpts);
      }
      const { draft, finishMutate } = ctx;

      const customOptions: IInnerSetStateOptions = { desc: null }; // 此处是源头，故设置 desc 初始值 null
      const setOptions = (options: ISetStateOptions) => {
        Object.assign(customOptions, options); // 此处是源头，故写 desc 即可
      };

      // TODO, pass uncaught err to global err handler
      return Promise.resolve(srvFn({ state, draft, setState, args, setOptions })).then((partialState) => {
        const nextState = finishMutate(partialState, customOptions);
        return forAtom ? nextState.val : nextState;
      });
    },
  };
}

/** expose as object */
export function createShared<T extends Dict = Dict>(
  rawState: T | (() => T),
  createOptions?: ICreateOptionsType<T>,
): { state: SharedDict<T>; setState: SetState<T>; call: Call<T> } {
  return createSharedLogic({ rawState }, createOptions);
}

/** expose as tuple */
export function share<T extends Dict = Dict>(rawState: T | (() => T), createOptions?: ICreateOptionsType<T>) {
  const { state, setState, call } = createSharedLogic<T>({ rawState }, createOptions);
  return [state, setState, call] as const; // expose as tuple
}

/**
 * 支持共享 primitive 类型值的接口
 */
export function atom<T extends any = any>(rawState: T | (() => T), createOptions?: ICreateOptionsType<Atom<T>>) {
  let atomState = asType<Atom<T>>({ val: rawState });
  if (isFn(rawState)) {
    atomState = asType<Atom<T>>({ val: rawState() });
  }

  const { state, setState, call } = createSharedLogic<Atom<T>>({ rawState: atomState, forAtom: true }, createOptions);
  const setAtom = asType<SetAtom<T>>(setState);
  return [state, setAtom, call] as const;
}
