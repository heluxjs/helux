import type { CoreApiCtx } from '../types/api-ctx';

// injected by apiFactory
let apiCtx = null as unknown as CoreApiCtx;

export function getApiCtx() {
  return apiCtx;
}

export function setApiCtx(ctx: CoreApiCtx) {
  apiCtx = ctx;
}
