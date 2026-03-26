import { noop } from '@helux/utils';
import type { IEnhanceOptions } from '../../types/api'
import type { Dict } from '../../types/base'

export function enhanceStore(store: Dict, options?: IEnhanceOptions): Dict & IEnhanceOptions {
  const { useLoading = noop, actions = {}, da = {}, mut = {} } = options || {};
  // @ts-ignore
  const enhancedStore = Object.assign(store, { useLoading, actions, da, mut });
  // @ts-ignore
  return enhancedStore;
}
