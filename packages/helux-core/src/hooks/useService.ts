import { react } from '../react';
import type { Dict, Srv } from '../types';
import type { MutableRefObject } from '../types-react';
import { isFn, isObj } from '../utils';
import { useEffect } from './useEffect';
import { useStable } from './useStable';

// 如 props 上存在 srvRef 函数，则暴露服务出去
export function useExposeService(srv: any, mayProps?: any) {
  const props = isObj(mayProps) ? mayProps : {};
  useEffect(() => {
    const { srvRef } = props;
    isFn(srvRef) && srvRef(srv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function uesStableDict<T = Dict>(dict: T) {
  // trust me, just for give state a ref
  // eslint-disable-next-line
  const dictRef = react.useRef(dict);
  dictRef.current = dict;
  return () => dictRef.current;
}

export function useService<T = any>(serviceImpl: T, props?: object) {
  const srv = useStable(serviceImpl);
  useExposeService(srv, props);
  return srv;
}

export function storeSrv(ref: MutableRefObject<any>) {
  return <S extends Srv>(srv: S) => (ref.current = srv);
}
