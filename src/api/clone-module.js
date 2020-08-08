import configure from './configure';
import ccContext from '../cc-context';
import { evalState, okeys } from '../support/util';
import * as checker from '../core/param/checker';

function tagReducerFn(reducerFns, moduleName) {
  const taggedReducer = {};
  okeys(reducerFns).forEach(fnName => {
    const oldFn = reducerFns[fnName];
    const fn = (...args) => oldFn(...args);
    fn.__fnName = fnName;
    fn.__stateModule = moduleName;
    taggedReducer[fnName] = fn;
  });
  return taggedReducer;
}

/**
 * @param {string} newModule
 * @param {string} existingModule
 */
export default (newModule, existingModule, { state, reducer, computed, watch, init } = {}) => {
  if (!ccContext.isStartup) {
    throw new Error('cc is not startup yet');
  }
  checker.checkModuleNameBasically(newModule);
  checker.checkModuleName(existingModule, false);

  const stateFn = ccContext.moduleName_stateFn_[existingModule];
  if (!stateFn){
    throw new Error(`target module[${existingModule}] state must be a function when use cloneModule`);
  }
  let stateCopy = stateFn();
  Object.assign(stateCopy, evalState(state));

  let reducerOriginal = ccContext.reducer._reducer[existingModule] || {};
  // attach  __fnName  __stateModule, 不能污染原函数的dispatch逻辑里需要的__stateModule
  const taggedReducerOriginal = tagReducerFn(reducerOriginal, newModule);
  if (reducer) Object.assign(taggedReducerOriginal, tagReducerFn(reducer, newModule));

  let computedEx = ccContext.computed._computedRaw[existingModule] || {};
  if (computed) Object.assign(computedEx, computed);

  let watchEx = ccContext.watch._watchRaw[existingModule] || {};
  if (watch) Object.assign(watchEx, watch);

  let initEx = ccContext.init._init[existingModule];
  if (init) initEx = init;

  const confObj = {
    state: stateCopy,
    reducer: taggedReducerOriginal,
    computed: computedEx,
    watch: watchEx,
  };
  if (initEx) confObj.init = initEx;

  configure(newModule, confObj);
}