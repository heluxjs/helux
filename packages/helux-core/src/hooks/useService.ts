import { react } from '../react';
import type { Dict, Srv } from '../types';
import type { MutableRefObject } from '../types-react';
import { isFn } from '../utils';
import { useEffect } from './useEffect';

// 如 props 上存在 srvRef 函数，则暴露服务出去
export function useExposeService(props: any, srv: any) {
  const depArr: string[] = [];
  Object.keys(props).forEach((key) => {
    if (key !== 'srvRef') {
      // 默认排除 srvRef 项的变化
      depArr.push(props[key]);
    }
  });

  useEffect(() => {
    const { srvRef } = props;
    if (isFn(srvRef)) {
      srvRef?.(srv);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, depArr);
}

export function uesStableDict<T = Dict>(dict: T) {
  // trust me, just for give state a ref
  // eslint-disable-next-line
  const dictRef = react.useRef(dict);
  dictRef.current = dict;
  return () => dictRef.current;
}

export function useService<S = Dict, P = Dict, E = Dict>(serviceImpl: S, options?: { props?: P; extra?: E }) {
  const { props = {} as P, extra = {} as E } = options || {};
  const getProps = uesStableDict(props);
  const getExtra = uesStableDict(extra);
  // now srv's all method is stable
  const srv = react.useMemo<Srv<S, P, E>>(
    () => ({
      ...serviceImpl,
      inner: {
        getExtra,
        getProps,
      },
    }),
    [],
  );

  useExposeService(props, srv);
  return srv;
}

export function storeSrv(ref: MutableRefObject<any>) {
  return <S extends Srv>(srv: S) => (ref.current = srv);
}
