import type { ApiCtx } from '@helux/types';

export function useForceUpdate(apiCtx: ApiCtx) {
  const [, setState] = apiCtx.react.useState({});
  return () => setState({});
}
