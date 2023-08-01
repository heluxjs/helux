import React from 'react';
import type { Dict } from '../types';

// 如 props 上存在 exposeService 函数，则暴露服务出去
export function useExposeService(props: any, srv: any) {
  const depArr: string[] = [];
  Object.keys(props).forEach((key) => {
    if (key !== 'exposeService') {
      // 默认排除 exposeService 项的变化
      depArr.push(props[key]);
    }
  });

  React.useEffect(() => {
    props.exposeService?.(srv);
  }, depArr);
}

export function uesStableProps(props: any) {
  // trust me, just for give props a ref
  // eslint-disable-next-line
  const propsRef = React.useRef(props);
  propsRef.current = props;
  return () => propsRef.current;
}

export function uesStableState<T extends Dict = Dict>(state: T) {
  // trust me, just for give state a ref
  // eslint-disable-next-line
  const stateRef = React.useRef(state);
  stateRef.current = state;
  return () => stateRef.current;
}

// TODO: implement NoCtxDict
// type NoCtxDict = { [K in Exclude<string, 'ctx'>]: any }

export function useService<P extends Dict = Dict, S extends Dict = Dict, T extends Dict = Dict>(
  compCtx: {
    props: P;
    state: S;
    setState: (partialState: Partial<S>) => void;
  },
  serviceImpl: T,
) {
  const getProps = uesStableProps(compCtx.props);
  const getState = uesStableState(compCtx.state);
  type Srv = T & {
    ctx: {
      setState: (partialState: Partial<S>) => void;
      getState: () => S;
      getProps: () => P;
    };
  };
  // now srv's all method is stable
  const srv = React.useMemo<Srv>(
    () => ({
      ...serviceImpl,
      ctx: {
        setState: compCtx.setState,
        getState,
        getProps,
      },
    }),
    [],
  );

  useExposeService(compCtx.props, srv);
  return srv;
}
