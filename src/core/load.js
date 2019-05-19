import startup from './startup';
import util from '../support/util';

/**
 * load will call startup
 * @param {{ [moduleName:string]: config:{state:object, reducer:object, watch:object, computed:object, init:object, sharedToGlobalMapping:object, isClassSingle:boolean} }} store
 * @param option
 */

export default function (store = {}, option = {}) {
  if (!util.isPlainJsonObject(store)) {
    throw new Error('[[load]]: param error, store is not a plain json object');
  }
  if (!util.isPlainJsonObject(option)) {
    throw new Error('[[load]]: param error, option is not a plain json object');
  }

  const _store = {};
  const _reducer = {};
  const _watch = {};
  const _computed = {};
  let _init = {};
  const _sharedToGlobalMapping = {};
  const _moduleSingleClass = {};
  const moduleNames = Object.keys(store);
  moduleNames.forEach(m => {
    const config = store[m];
    const { state, reducer, watch, computed, init, sharedToGlobalMapping, isClassSingle } = config;
    if (state) _store[m] = state;
    if (reducer) _reducer[m] = reducer;
    if (watch) _watch[m] = watch;
    if (computed) _computed[m] = computed;
    if (init) _init[m] = init;
    if (sharedToGlobalMapping) _sharedToGlobalMapping[m] = sharedToGlobalMapping;
    if (typeof isClassSingle === 'boolean') _moduleSingleClass[m] = isClassSingle;
  });

  if (!util.isObjectNotNull(_init)) _init = null;
  const startupOption = {
    isModuleMode: true,
    store: _store,
    reducer: _reducer,
    watch: _watch,
    computed: _computed,
    init: _init,
    sharedToGlobalMapping: _sharedToGlobalMapping,
    moduleSingleClass: _moduleSingleClass,
  }

  const { middlewares, isStrict, isDebug, errorHandler, isHot, autoCreateDispatcher, reducer } = option;
  if (reducer) {
    if (!util.isPlainJsonObject(reducer)) {
      throw new Error('[[load]]: param option.reducer error, it is not a plain json object');
    }
    Object.keys(reducer).forEach(reducerModule => {
      _reducer[reducerModule] = reducer[reducerModule];
    });
  }

  const mergedOption = Object.assign(startupOption, { middlewares, isStrict, isDebug, errorHandler, isHot, autoCreateDispatcher });

  startup(mergedOption);
}