import startup from './startup';
import * as util from '../support/util';
import { NOT_A_JSON } from '../support/priv-constant';
import ccContext from '../cc-context';
import pendingModules from '../cc-context/pending-modules';

const { isPJO, okeys, isObjectNull, evalState } = util;
const pError = label => {
  throw new Error(`[[run]]: param error, ${label} ${NOT_A_JSON}`);
}

// option:
// middlewares, plugins, isStrict, isDebug, errorHandler, isHot,
// autoCreateDispatcher, bindCtxToMethod,
// computedCompare, watchCompare, watchImmediate

/**
 * run will call startup
 * @param {{ [moduleName:string]: config:{state:object|()=>object, reducer:object, watch:object, computed:object, init:object} }} store
 * @param {{isStrict:boolean}} options
 */

export default function (store = {}, options = {}) {
  if (!isPJO(store)) pError('store');
  if (!isPJO(options)) pError('options');

  const storeConf = {
    store: {},
    reducer: {},
    watch: {},
    computed: {},
    init: {},
    initPost: {},
  }

  const buildStoreConf = (m, moduleConf)=>{
    const { state, reducer = {}, watch, computed, init, initPost } = moduleConf;
    if(storeConf.store[m]){
      throw new Error(`run api error: module${m} duplicate`);
    }

    storeConf.store[m] = evalState(state);
    if (typeof state === 'function') ccContext.moduleName_stateFn_[m] = state;
    
    storeConf.reducer[m] = reducer;
    if (watch) storeConf.watch[m] = watch;
    if (computed) storeConf.computed[m] = computed;
    if (init) storeConf.init[m] = init;
    if (initPost) storeConf.initPost[m] = initPost;
  }

  // traversal moduleNames
  okeys(store).forEach(m => buildStoreConf(m, store[m]));

  // push by configure api
  pendingModules.forEach(({ module, config }) => {
    util.justTip(`configure pending module[${module}]`);
    buildStoreConf(module, config)
  });

  pendingModules.length = 0;// clear pending modules

  if (isObjectNull(storeConf.init)) storeConf.init = null;

  startup(storeConf, options);
}
