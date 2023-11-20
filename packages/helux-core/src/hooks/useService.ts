import type { MutableRefObject } from '@helux/types';
import { isFn, isObj } from '@helux/utils';
import type { CoreApiCtx } from '../types/api-ctx';
import type { Srv } from '../types/base';

// 如 props 上存在 srvRef 函数，则暴露服务出去
export function useExposeService(apiCtx: CoreApiCtx, srv: any, mayProps?: any) {
  const props = isObj(mayProps) ? mayProps : {};
  apiCtx.react.useEffect(() => {
    const { srvRef } = props;
    isFn(srvRef) && srvRef(srv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function useService<T = any>(apiCtx: CoreApiCtx, serviceImpl: T, props?: object) {
  const srv = apiCtx.hookImpl.useStable(serviceImpl);
  useExposeService(apiCtx, srv, props);
  return srv;
}

export function storeSrv(ref: MutableRefObject<any>) {
  return <S extends Srv>(srv: S) => (ref.current = srv);
}
