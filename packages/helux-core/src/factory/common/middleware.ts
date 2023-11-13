import { Dict, IMiddlewareCtx, Middleware, MutableDraft } from '../../types';
import type { TInternal } from '../creator/buildInternal';
import { getRootCtx } from '../root';


export function addMiddleware(mid: Middleware) {
  const { middlewares } = getRootCtx();
  middlewares.push(mid);
}

/**
 * middle only support sync call, so no next fn handler in middleware fn args
 */
export function runMiddlewares(draft: MutableDraft, internal: TInternal) {
  const { middlewares } = getRootCtx();
  if (!middlewares.length) {
    return;
  }

  const data: Dict = {};
  const { sharedKey, moduleName } = internal;
  const setData = (key: string, value: any) => (data[key] = value);
  const midCtx: IMiddlewareCtx = { draft, sharedKey, moduleName, setData, idx: 0 };
  middlewares.forEach((fn, idx) => {
    midCtx.idx = idx;
    fn(midCtx);
  });
}
