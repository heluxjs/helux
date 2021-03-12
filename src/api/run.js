/** @typedef {import('../types').ModuleConfig} ModuleConfig */
import startup from './startup';
import * as util from '../support/util';
import { INAJ } from '../support/priv-constant';
import ccContext from '../cc-context';
import pendingModules from '../cc-context/pending-modules';
import getLifecycle from '../core/param/get-lifecycle';

const { isPJO, okeys, evalState, isFn } = util;
const pError = label => {
  throw new Error(`[[run]]: param error, ${label} ${INAJ}`);
};

/**
 * run will call startup
 * @param {{ [moduleName:string]: ModuleConfig }} store
 * @param {import('../types').RunOptions} options
 */
export default function (store = {}, options = {}) {
  if (!isPJO(store)) pError('store');
  if (!isPJO(options)) pError('options');

  const storeConf = {
    store: {},
    reducer: {},
    ghost: {},
    watch: {},
    computed: {},
    lifecycle: {},
  };

  const buildStoreConf = (m, moduleConf) => {
    const { state, reducer, watch, computed, ghosts = [] } = moduleConf;
    if (storeConf.store[m]) {
      throw new Error(`run api error: module[${m}] duplicate`);
    }

    storeConf.store[m] = evalState(state);
    if (isFn(state)) ccContext.moduleName2stateFn[m] = state;

    storeConf.reducer[m] = reducer;
    storeConf.ghost[m] = ghosts;
    storeConf.watch[m] = watch;
    storeConf.computed[m] = computed;
    storeConf.lifecycle[m] = getLifecycle(moduleConf);
  };

  // traversal moduleNames
  okeys(store).forEach(m => buildStoreConf(m, store[m]));

  // these modules pushed by configure api before calling run
  pendingModules.forEach(({ module, config }) => {
    // user put this module to run api 1th models param again, here just ignore this one
    if (storeConf.store[module]) return;
    // configure pending module
    buildStoreConf(module, config);
  });

  pendingModules.length = 0; // clear pending modules
  startup(storeConf, options);
}
