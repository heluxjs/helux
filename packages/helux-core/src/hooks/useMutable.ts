import { react } from '../react';
import { createDraft, finishDraft } from 'limu';
import type { PlainObject, PartialStateCb } from '../types';
import { isFn, isObj } from '../utils';
import { useObjectLogic } from './useObject';

export function useMutable<T extends PlainObject>(initialState: T | (() => T)) {
  const [state, setFullState] = react.useState<T>(initialState);
  const stateRef = react.useRef(state);
  stateRef.current = state;

  const setState = react.useCallback((partialStateOrCb: Partial<T> | PartialStateCb<T>) => {
    const prevState = stateRef.current;
    let final = prevState;
    if (isFn(partialStateOrCb)) {
      const draft = createDraft(prevState);
      const mayPartial = partialStateOrCb(draft);
      final = finishDraft(draft);
      if (isObj(mayPartial)) {
        Object.assign(final, mayPartial); // call assign is ok here, cause final is already a new state
      }
    } else if (isObj(partialStateOrCb)) {
      final = { ...final, ...partialStateOrCb };
    }
    setFullState(final);
  }, [stateRef]);

  return useObjectLogic(state, setState, true);
}
