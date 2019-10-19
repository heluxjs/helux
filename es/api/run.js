import startup from './startup';
import * as util from '../support/util';

const { isPlainJsonObject, okeys, isObjectNotNull } = util;
const pError = label => {
  throw new Error(`[[run]]: param error, ${label} is not a plain json object`);
}

/**
 * run will call startup
 * @param {{ [moduleName:string]: config:{state:object, reducer:object, watch:object, computed:object, init:object, isClassSingle:boolean} }} store
 * @param {{isStrict:boolean}} option
 */

export default function (store = {}, option = {}) {
  if (!isPlainJsonObject(store)) pError('store');
  if (!isPlainJsonObject(option)) pError('option');

  const _store = {};
  const _reducer = {};
  const _watch = {};
  const _computed = {};
  let _init = {};
  const _moduleSingleClass = {};

  // traversal moduleNames
  okeys(store).forEach(m => {
    const config = store[m];
    const { state, reducer, watch, computed, init, isClassSingle } = config;
    if (state) _store[m] = state;
    if (reducer) _reducer[m] = reducer;
    if (watch) _watch[m] = watch;
    if (computed) _computed[m] = computed;
    if (init) _init[m] = init;
    _moduleSingleClass[m] = isClassSingle === true;
  });

  if (!isObjectNotNull(_init)) _init = null;
  const startupOption = {
    store: _store,
    reducer: _reducer,
    watch: _watch,
    computed: _computed,
    init: _init,
    moduleSingleClass: _moduleSingleClass,
  }

  const {
    middlewares, plugins, isStrict, isDebug, errorHandler, isHot,
    autoCreateDispatcher, reducer, bindCtxToMethod,
    computedCompare, watchCompare, watchImmediate,
  } = option;

  if (reducer) {
    if (!isPlainJsonObject(reducer)) pError('option.reducer');
    okeys(reducer).forEach(reducerModule => {
      if (_reducer[reducerModule]) throw new Error(`reducerModule[${reducerModule}] has been declared in store`);
      const reducerFns = reducer[reducerModule];
      Object.keys(k => {
        reducerFns[k].__reducerModule = reducerModule;// tag reducer fn
      });
      _reducer[reducerModule] = reducerFns;
    });
  }

  // merge startupOption
  Object.assign(startupOption, {
    middlewares, plugins, isStrict, isDebug, errorHandler, isHot, autoCreateDispatcher, bindCtxToMethod,
    computedCompare, watchCompare, watchImmediate,
  });

  startup(startupOption);
}