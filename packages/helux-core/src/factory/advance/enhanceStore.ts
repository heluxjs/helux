
export function enhanceStore<T extends any, A extends any, U extends any>(
  store: T,
  options: { actions: A, useLoading: U },
): T & { actions: A, useLoading: U } {
  // @ts-ignore
  const enhancedStore = Object.assign(store, options);
  // @ts-ignore
  return enhancedStore;
}
