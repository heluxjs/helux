import deh from '../base/define-handler-to-fns';

export default function (watchFns) {
  return (computedItem, computedHandler) => {
    deh(computedItem, computedHandler, watchFns);
  };
} 