import configureDepFns from '../base/configure-dep-fns';
import { CATE_REF, FN_WATCH } from '../../support/constant';

export default function (refCtx) {
  return (watchItem, watchHandler, depKeysOrOpt) => {
    const confMeta = {
      type: FN_WATCH, refCtx, stateKeys: refCtx.stateKeys, retKeyFns: refCtx.watchRetKeyFns,
      module: refCtx.module, connect: refCtx.connect, dep: refCtx.watchDep
    };

    refCtx.__$$cuOrWaCalled = true;
    configureDepFns(CATE_REF, confMeta, watchItem, watchHandler, depKeysOrOpt);
  };
}
