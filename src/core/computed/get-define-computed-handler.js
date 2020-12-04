import configureDepFns from '../base/configure-dep-fns';
import { CATE_REF, FN_CU } from '../../support/constant';
import ccContext from '../../cc-context';

const { runtimeHandler } = ccContext

export default function (refCtx) {
  return (computedItem, computedHandler, depKeysOrOpt) => {
    const confMeta = {
      type: FN_CU, refCtx,
      stateKeys: refCtx.stateKeys, retKeyFns: refCtx.computedRetKeyFns,
      module: refCtx.module, connect: refCtx.connect, dep: refCtx.computedDep
    };

    refCtx.__$$cuOrWaCalled = true;
    try {
      configureDepFns(CATE_REF, confMeta, computedItem, computedHandler, depKeysOrOpt);
    } catch (err) {
      runtimeHandler.errorHandler(err);
    }
  };
}
