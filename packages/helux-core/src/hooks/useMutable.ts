import { isFn, isObj } from 'helux-utils';
import { createDraft, finishDraft } from 'limu';
import type { CoreApiCtx } from '../types/api-ctx';
import type { PartialStateCb, PlainObject } from '../types/base';

export function useMutable<T extends PlainObject>(apiCtx: CoreApiCtx, initialState: T | (() => T)) {
  const { useState, useRef, useCallback } = apiCtx.react;
  const [state, setFullState] = useState<T>(initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const setState = useCallback(
    (partialStateOrCb: Partial<T> | PartialStateCb<T>) => {
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
    },
    [stateRef],
  );

  return apiCtx.hookImpl.useObjectLogic(state, setState, true);
}
