
import * as util from '../../support/util';
import { MODULE_GLOBAL, MODULE_DEFAULT, MODULE_CC } from '../../support/constant';
import ccContext from '../../cc-context';
import * as checker from '../checker';
import initModuleState from '../state/init-module-state';
import makeSetStateHandler from '../state/make-set-state-handler';
import initModuleReducer from '../reducer/init-module-reducer';
import initModuleWatch from '../watch/init-module-watch';
import initModuleComputed from '../computed/init-module-computed';
import co from 'co';
import configure from '../../api/configure';

const { isPlainJsonObject, okeys } = util;
const { store: { getState } } = ccContext;

/** 对已有的store.$$global状态追加新的state */
export function appendGlobalState(globalState) {
  // todo
}

export function configStoreState(storeState) {
  if (!isPlainJsonObject(storeState)) {
    throw new Error(`the storeState is not a plain json object!`);
  }
  const store = ccContext.store;
  store.initStateDangerously(MODULE_CC, {});

  if (storeState[MODULE_GLOBAL] === undefined) storeState[MODULE_GLOBAL] = {};
  if (storeState[MODULE_DEFAULT] === undefined) storeState[MODULE_DEFAULT] = {};

  const moduleNames = okeys(storeState);
  const len = moduleNames.length;
  for (let i = 0; i < len; i++) {
    const moduleName = moduleNames[i];
    const moduleState = storeState[moduleName];
    initModuleState(moduleName, moduleState);
  }
}

/**
 * 
 * @param {{[reducerModuleName:string]:{[reducerFnType:string]:function}}} rootReducer 
 */
export function configRootReducer(rootReducer) {
  if (rootReducer[MODULE_DEFAULT] === undefined) rootReducer[MODULE_DEFAULT] = {};
  if (rootReducer[MODULE_GLOBAL] === undefined) rootReducer[MODULE_GLOBAL] = {};
  const moduleNames = okeys(rootReducer);

  const len = moduleNames.length;
  for (let i = 0; i < len; i++) {
    const moduleName = moduleNames[i];
    initModuleReducer(moduleName, rootReducer[moduleName]);
  }
}

export function configRootComputed(computed) {
  if (!isPlainJsonObject(computed)) {
    throw new Error(`StartUpOption.computed is not a plain json object!`);
  }
  const moduleNames = okeys(computed);
  moduleNames.forEach(m => initModuleComputed(m, computed[m]));
}

export function configRootWatch(watch) {
  if (!isPlainJsonObject(watch)) {
    throw new Error(`StartUpOption.watch is not a plain json object!`);
  }
  const moduleNames = Object.keys(watch);
  moduleNames.forEach(m => initModuleWatch(m, watch[m]));
}

export function executeRootInit(init) {
  if (!init) return;

  if (!isPlainJsonObject(init)) {
    throw new Error('StartupOption.init is valid, it must be a object like {[module:string]:Function}!');
  }

  const moduleNames = okeys(init);
  moduleNames.forEach(moduleName => {
    checker.checkModuleName(moduleName, false, `there is no module state defined in store for init.${moduleName}`);
    const initFn = init[moduleName];
    if (initFn) {
      co(initFn).then(state => {
        makeSetStateHandler(moduleName)(state)
      });
    }
  });
  ccContext.init._init = init;
}


export function configModuleSingleClass(moduleSingleClass) {
  if (!isPlainJsonObject(moduleSingleClass)) {
    throw new Error(`StartupOption.moduleSingleClass is not a plain json object!`);
  }
  util.safeAssignObjectValue(ccContext.moduleSingleClass, moduleSingleClass);
}

export function configMiddlewares(middlewares) {
  if (middlewares.length > 0) {
    const ccMiddlewares = ccContext.middlewares;
    ccMiddlewares.length = 0;//防止热加载重复多次载入middlewares
    middlewares.forEach(m => ccMiddlewares.push(m));
  }
}

export function configPlugins(plugins) {
  if (plugins.length > 0) {
    const ccPlugins = ccContext.plugins;
    ccPlugins.length = 0;//防止热加载重复多次载入plugins

    plugins.forEach(p => {
      ccPlugins.push(p);
      if (p.getConf) {
        const pluginConf = p.getConf();
        if(pluginConf.module)configure(pluginConf.module, pluginConf.conf, {noOpPlugins:true});
      }else{
        throw new Error('a plugin must export getConf handler!');
      }
    });
  }
}

export default {
  configStoreState,
  configRootReducer,
  configRootComputed,
  configRootWatch,
  executeRootInit,
  configModuleSingleClass,
  configMiddlewares,
  configPlugins,
}