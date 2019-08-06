
export default function (watchFns, immediateWatchKeys = []) {
  let hasFn = Object.keys(watchFns).length > 0;
  return { watchFns, immediateWatchKeys, hasFn };
}