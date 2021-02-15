import { okeys } from '../../support/util';

export default function (watchFns, immediateWatchKeys = []) {
  const hasFn = okeys(watchFns).length > 0;
  return { watchFns, immediateWatchKeys, hasFn };
}
