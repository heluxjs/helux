import configureDepFns from '../base/configure-dep-fns';
import { CATE_REF } from '../../support/constant';

export default function (refCtx, isLazyComputed = false) {
  return (computedItem, computedHandler, depKeys, compare) => {
    const confMeta = {
      type: 'computed', isLazyComputed, refCtx,
      stateKeys: refCtx.stateKeys, retKeyFns: refCtx.computedRetKeyFns,
      module: refCtx.module, connect: refCtx.connect, dep: refCtx.computedDep
    };
    configureDepFns(CATE_REF, confMeta, computedItem, computedHandler, depKeys, compare);
  };
} 