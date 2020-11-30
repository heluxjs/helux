
export default function (watchFns, immediateWatchKeys = []) {
  const hasFn = Object.keys(watchFns).length > 0;
  return { watchFns, immediateWatchKeys, hasFn };
}
