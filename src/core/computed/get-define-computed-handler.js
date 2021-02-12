/** @typedef {import('../../types-inner').IRefCtx} IRefCtx */
import configureDepFns from '../base/configure-dep-fns';
import { CATE_REF, FN_CU } from '../../support/constant';

export default function (/** @type IRefCtx */refCtx) {
  return (computedItem, computedHandler, depKeysOrOpt) => {
    const confMeta = {
      type: FN_CU, refCtx,
      stateKeys: refCtx.stateKeys, retKeyFns: refCtx.computedRetKeyFns,
      module: refCtx.module, connect: refCtx.connect, dep: refCtx.computedDep
    };

    refCtx.__$$cuOrWaCalled = true;
    configureDepFns(CATE_REF, confMeta, computedItem, computedHandler, depKeysOrOpt);
    return refCtx.refComputed;
  };
}
