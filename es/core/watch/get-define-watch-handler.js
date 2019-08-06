import deh from '../base/define-handler-to-fns';

export default function (watchFns, immediateWatchKeys) {
  return (watchItem, watchHandler, immediate) => {
    if (immediate) deh(watchItem, watchHandler, watchFns, immediateWatchKeys);
    else deh(watchItem, watchHandler, watchFns);
  };
} 