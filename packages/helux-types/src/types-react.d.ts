/**
 * helux 底层本身并不直接依赖 react，但需要 adapter 库注入 react 运行时来构建出视频不同类 react 框架的包，
 * 故此处独立声明一些内部需要的 react 相关类型依赖
 */
import { Fn, FnVoid } from './types';

export type CleanUpCb = () => void;

export type EffectCb = () => void | CleanUpCb;

export type ReactNode = any;

export type PropsWithChildren<P> = P & { children?: ReactNode | undefined };

export type ReactElement = any;

export interface FunctionComponent<P = {}> {
  (props: PropsWithChildren<P>, context?: any): ReactElement | null;
  propTypes?: any;
  contextTypes?: any;
  defaultProps?: Partial<P> | undefined;
  displayName?: string | undefined;
}

export interface MutableRefObject<T> {
  current: T;
}

export type ForwardedRef<T> = ((instance: T | null) => void) | MutableRefObject<T | null> | null;

export type UseCallback = <T extends (...args: any[]) => any>(callback: T, deps: any[]) => T;

export type UseState = <T extends any = any>(initial: T | (() => T)) => [state: T, setState: (stateOrCb: T | ((state: T) => T)) => void];

export type UseRef = <T = any>(initial: T) => { current: T };

export type UseMemo = <T = any>(factory: () => T, deps?: any[]) => T;

/** 目前 helux-core 只需要调用 react api */
export type ReactLike = {
  useState: UseState;
  useRef: UseRef;
  useEffect: FnVoid;
  useLayoutEffect: FnVoid;
  useMemo: UseMemo;
  createElement: Fn;
  PureComponent: any;
  Fragment: Fn;
  memo: Fn;
  useCallback: UseCallback;
  forwardRef: Fn;
};

export type React18Like = ReactLike & {
  // for react 18
  useSyncExternalStore: FnVoid;
};

export type ApiCtx = { react: ReactLike };
