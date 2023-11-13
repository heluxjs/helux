/**
 * react like lib
 */
import { UseCallback, UseMemo, UseRef, UseState } from './types-react';
import { asType, noop } from './utils';

// this is a mock lib, it will be replaced to real react lib later
export const react = {
  useState: asType<UseState>(noop),
  useRef: asType<UseRef>(noop),
  useEffect: noop,
  useLayoutEffect: noop,
  useMemo: asType<UseMemo>(noop),
  createElement: noop,
  memo: noop,
  useCallback: asType<UseCallback>(noop),
  // for react 18
  useSyncExternalStore: noop,
};

export function setReactLib(lib: any) {
  Object.assign(react, lib);
}
