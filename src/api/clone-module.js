import configure from './configure';
import ccContext from '../cc-context';
import { evalState, okeys } from '../support/util';
import * as checker from '../core/param/checker';
import getLifecycle from '../core/param/get-lifecycle';

function tagReducerFn(reducerFns, moduleName) {
  const taggedReducer = {};
  if (reducerFns) {
    okeys(reducerFns).forEach(fnName => {
      const oldFn = reducerFns[fnName];
      const fn = (...args) => oldFn(...args);
      fn.__fnName = fnName;
      fn.__stateModule = moduleName;
      taggedReducer[fnName] = fn;
    });
  }
  return taggedReducer;
}

/**
 * @param {string} newModule
 * @param {string} existingModule
 */
export default (newModule, existingModule, moduleOverideConf = {}) => {
  const { state, reducer, computed, watch } = moduleOverideConf;
  if (!ccContext.isStartup) {
    throw new Error('cc is not startup yet');
  }
  checker.checkModuleNameBasically(newModule);
  checker.checkModuleName(existingModule, false);

  const stateFn = ccContext.moduleName2stateFn[existingModule];
  if (!stateFn) {
    throw new Error(`target module[${existingModule}] state must be a function when use cloneModule`);
  }
  const stateCopy = stateFn();
  Object.assign(stateCopy, evalState(state));

  const originalReducer = ccContext.reducer._reducer[existingModule];
  // attach  __fnName  __stateModule, 不能污染原函数的dispatch逻辑里需要的__stateModule
  const taggedReducerCopy = Object.assign(tagReducerFn(originalReducer, newModule), tagReducerFn(reducer, newModule));
  const computedCopy = Object.assign({}, ccContext.computed._computedRaw[existingModule], computed);
  const watchCopy = Object.assign({}, ccContext.watch._watchRaw[existingModule], watch);
  const lifecycleCopy = Object.assign(
    {}, ccContext.lifecycle._lifecycle[existingModule], getLifecycle(moduleOverideConf)
  );

  const confObj = {
    state: stateCopy,
    reducer: taggedReducerCopy,
    computed: computedCopy,
    watch: watchCopy,
    lifecycle: lifecycleCopy,
  };

  configure(newModule, confObj);
}
