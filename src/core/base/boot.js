
import * as util from '../../support/util';
import { NOT_A_JSON } from '../../support/priv-constant';
import { MODULE_GLOBAL, MODULE_DEFAULT, MODULE_CC, MODULE_VOID } from '../../support/constant';
import ccContext from '../../cc-context';
import * as checker from '../checker';
import initModuleState from '../state/init-module-state';
import { makeSetStateHandler } from '../state/handler-factory';
import initModuleReducer from '../reducer/init-module-reducer';
import initModuleWatch from '../watch/init-module-watch';
import initModuleComputed from '../computed/init-module-computed';
import { on, clearCbs } from '../plugin';

const { isPJO, okeys } = util;

function checkObj(rootObj, tag) {
  if (!isPJO(rootObj)) {
    throw new Error(`${tag} ${NOT_A_JSON}`);
  }
}

/** 对已有的store.$$global状态追加新的state */
// export function appendGlobalState(globalState) {
//   // todo
// }

export function configStoreState(storeState) {
  checkObj(storeState, 'state');

  delete storeState[MODULE_VOID];
  delete storeState[MODULE_CC];

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
 * @param {{[moduleName:string]:{[reducerFnType:string]:function}}} rootReducer 
 */
export function configRootReducer(rootReducer) {
  checkObj(rootReducer, 'reducer');
  if (rootReducer[MODULE_DEFAULT] === undefined) rootReducer[MODULE_DEFAULT] = {};
  if (rootReducer[MODULE_GLOBAL] === undefined) rootReducer[MODULE_GLOBAL] = {};
  okeys(rootReducer).forEach(m => initModuleReducer(m, rootReducer[m]));
}

export function configRootComputed(rootComputed) {
  checkObj(rootComputed, 'computed');
  okeys(rootComputed).forEach(m => initModuleComputed(m, rootComputed[m]));
}

export function configRootWatch(rootWatch) {
  checkObj(rootWatch, 'watch');
  Object.keys(rootWatch).forEach(m => initModuleWatch(m, rootWatch[m]));
}

export function executeRootInit(init, initPost) {
  if (!init) return;
  if (!isPJO(init)) {
    throw new Error(`init ${NOT_A_JSON}`);
  }

  okeys(init).forEach(moduleName => {
    checker.checkModuleName(moduleName, false);
    const initFn = init[moduleName];
    if (initFn) {
      Promise.resolve().then(initFn).then(state => {
        makeSetStateHandler(moduleName, initPost[moduleName])(state)
      });
    }
  });
  ccContext.init._init = init;
}


export function configModuleSingleClass(moduleSingleClass) {
  if (!isPJO(moduleSingleClass)) {
    throw new Error(`StartupOption.moduleSingleClass ${NOT_A_JSON}`);
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
    clearCbs();//清理掉已映射好的插件回调

    const pluginNameMap = {};
    plugins.forEach(p => {
      ccPlugins.push(p);
      if (p.install) {
        const pluginInfo = p.install(on);
        const e = new Error('plugin.install must return result:{name:string, options?:object}');
        if (!pluginInfo) throw e;
        const pluginName = pluginInfo.name;
        if (!pluginName) throw e;
        if (pluginNameMap[pluginName]) throw new Error(`pluginName[${pluginName}] duplicate`);
        pluginNameMap[pluginName] = 1;
      } else {
        throw new Error('a plugin must export install handler!');
      }
    });
    ccContext.pluginNameMap = pluginNameMap;
    
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