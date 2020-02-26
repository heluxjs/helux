import startup from './startup';
import * as util from '../support/util';
import { NOT_A_JSON } from '../support/priv-constant';

const { isPJO, okeys, isObjectNull, evalState } = util;
const pError = label => {
  throw new Error(`[[run]]: param error, ${label} ${NOT_A_JSON}`);
}

// option:
// middlewares, plugins, isStrict, isDebug, errorHandler, isHot,
// autoCreateDispatcher, bindCtxToMethod,
// computedCompare, watchCompare, watchImmediate, alwaysGiveState

/**
 * run will call startup
 * @param {{ [moduleName:string]: config:{state:object, reducer:object, watch:object, computed:object, init:object, isClassSingle:boolean} }} store
 * @param {{isStrict:boolean}} option
 */

export default function (store = {}, option = {}) {
  if (!isPJO(store)) pError('store');
  if (!isPJO(option)) pError('option');

  const storeConf = {
    store: {},
    reducer: {},
    watch: {},
    computed: {},
    init: {},
    moduleSingleClass: {},
  }

  // traversal moduleNames
  okeys(store).forEach(m => {
    const moduleConf = store[m];
    const { state, reducer, watch, computed, init, isClassSingle } = moduleConf;
    storeConf.store[m] = evalState(state);
    if (reducer) storeConf.reducer[m] = reducer;
    if (watch) storeConf.watch[m] = watch;
    if (computed) storeConf.computed[m] = computed;
    if (init) storeConf.init[m] = init;
    storeConf.moduleSingleClass[m] = isClassSingle === true;
  });

  if (isObjectNull(storeConf.init)) storeConf.init = null;

  startup(storeConf, option);
}