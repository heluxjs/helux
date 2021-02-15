import { okeys } from '../../support/util';

export default function (computedFns, module) {
  const hasFn = okeys(computedFns).length > 0;
  return { computedFns, module, hasFn };
}
