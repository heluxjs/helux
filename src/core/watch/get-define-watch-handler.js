import configureDepFns from '../base/configure-dep-fns';
import { CATE_REF } from '../../support/constant';

export default function (refCtx) {
  return (watchItem, watchHandler, depKeys, compare, immediate) => {
    const confMeta = {
      type: 'watch', refCtx, stateKeys: refCtx.stateKeys, retKeyFns: refCtx.watchRetKeyFns,
      module: refCtx.module, connect: refCtx.connect, dep: refCtx.watchDep
    };
    configureDepFns(CATE_REF, confMeta, watchItem, watchHandler, depKeys, compare, immediate);
  };
} 