import { Dict, IMiddlewareCtx, Middleware, MutableDraft } from '../../types/base';
import type { TInternal } from '../creator/buildInternal';
import { getRootCtx } from '../root';

export function addMiddleware(mid: Middleware) {
  const { middlewares } = getRootCtx();
  middlewares.push(mid);
}

/**
 * middle only support sync call, so no next fn handler in middleware fn args
 */
export function runMiddlewares(internal: TInternal, draft: MutableDraft, sn: number) {
  const { middlewares } = getRootCtx();
  if (!middlewares.length) {
    return;
  }

  const data: Dict = {};
  const { sharedKey, moduleName } = internal;
  const setData = (key: string, value: any) => (data[key] = value);
  const midCtx: IMiddlewareCtx = { draft, sharedKey, moduleName, setData, idx: 0, sn };
  middlewares.forEach((fn, idx) => {
    fn({ ...midCtx, idx });
  });
}
