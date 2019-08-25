import configureDepFns from '../base/configure-dep-fns';
import { CATE_REF } from '../../support/constant';

export default function (refCtx) {
  return (watchItem, watchHandler) => {
    const confMeta = { type:'watch', refCtx, state: refCtx.state, module: refCtx.module, connect: refCtx.connect, dep: refCtx.watchDep };
    configureDepFns(CATE_REF, confMeta, watchItem, watchHandler);
  };
} 