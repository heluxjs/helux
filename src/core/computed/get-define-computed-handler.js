import configureDepFns from '../base/configure-dep-fns';
import { CATE_REF } from '../../support/constant';

let sortFactor = 1;

export default function (refCtx, isLazyComputed = false) {
  return (computedItem, computedHandler, depKeys, compare, sort) => {
    // if user don't pass sort explicitly, computed fn will been called orderly by sortFactor
    // sort param may in computedHandler when it is an object like {fn:()=>{}, sort:10}
    const _sort = (sort || sortFactor++);

    const confMeta = {
      type: 'computed', isLazyComputed, refCtx, sort: _sort,
      stateKeys: refCtx.stateKeys, retKeyFns: refCtx.computedRetKeyFns,
      module: refCtx.module, connect: refCtx.connect, dep: refCtx.computedDep
    };
    configureDepFns(CATE_REF, confMeta, computedItem, computedHandler, depKeys, compare);
  };
} 