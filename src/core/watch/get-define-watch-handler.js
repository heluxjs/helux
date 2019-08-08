import deh from '../base/define-handler-to-fns';

export default function (refCtx, watchFns, immediateWatchKeys) {
  return (watchItem, watchHandler, immediate) => {
    if (immediate) deh(refCtx, watchItem, watchHandler, watchFns, immediateWatchKeys);
    else deh(refCtx, watchItem, watchHandler, watchFns);
  };
} 