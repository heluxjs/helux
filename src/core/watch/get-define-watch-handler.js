import deh from '../base/define-handler-to-fns';

export default function (refCtx) {
  return (watchItem, watchHandler, immediate, depStateKeys) => {
    deh(refCtx, watchItem, watchHandler, refCtx.watchFns, immediate, depStateKeys, refCtx.watchDep, 2);
  };
} 