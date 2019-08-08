import deh from '../base/define-handler-to-fns';

export default function (refCtx, watchFns) {
  return (computedItem, computedHandler) => {
    deh(refCtx, computedItem, computedHandler, watchFns);
  };
} 