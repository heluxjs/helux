import deh from '../base/define-handler-to-fns';

export default function (refCtx) {
  return (computedItem, computedHandler, depStateKeys) => {
    deh(refCtx, computedItem, computedHandler, refCtx.computedFns, true, depStateKeys, refCtx.computedDep, 1);
  };
} 