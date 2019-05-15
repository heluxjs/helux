import React from 'react';
import ReactDOM from 'react-dom';
import util, { verboseInfo, styleStr, color, justWarning, isPlainJsonObject, clearObject } from '../support/util';
import { ERR, MODULE_CC, MODULE_GLOBAL, MODULE_DEFAULT, CC_DISPATCHER_BOX, CC_DISPATCHER } from '../support/constant';
import * as helper from './helper';
import ccContext from '../cc-context';
import createDispatcher from './create-dispatcher';

const vbi = verboseInfo;
const ss = styleStr;
const cl = color;

function keysWarning(keyWord) {
  justWarning(`now cc is startup with non module mode, cc only allow you define ${keyWord} like {"$$default":{}, "$$global":{}}, cc will ignore other module keys`);
}

function bindStoreToCcContext(store, sharedToGlobalMapping, isModuleMode) {
  if (!isPlainJsonObject(store)) {
    throw new Error(`the store is not a plain json object!`);
  }
  if (!isPlainJsonObject(sharedToGlobalMapping)) {
    throw new Error(`the sharedToGlobalMapping is not a plain json object!`);
  }
  ccContext.sharedToGlobalMapping = sharedToGlobalMapping;
  const globalStateKeys = ccContext.globalStateKeys;
  const pureGlobalStateKeys = ccContext.pureGlobalStateKeys;

  const _state = ccContext.store._state;
  let globalState = store[MODULE_GLOBAL];
  _state[MODULE_CC] = {};

  if (isModuleMode) {
    const moduleNames = Object.keys(store);
    if (globalState) {
      if (!util.isModuleStateValid(globalState)) {
        throw util.makeError(ERR.CC_STORE_STATE_INVALID, vbi(`moduleName:${MODULE_GLOBAL}'s state is invalid!`));
      } else {
        console.log(ss('$$global module state found while startup cc!'), cl());
        Object.keys(globalState).forEach(key => {
          globalStateKeys.push(key);
        });
      }
    } else {
      console.log(ss('$$global module state not found, cc will generate one for user automatically!'), cl());
      globalState = {};
    }
    _state[MODULE_GLOBAL] = globalState;

    const len = moduleNames.length;
    let isDefaultModuleExist = false;
    for (let i = 0; i < len; i++) {
      const moduleName = moduleNames[i];
      if (moduleName !== MODULE_GLOBAL) {
        helper.checkModuleName(moduleName);
        const moduleState = store[moduleName];
        helper.checkModuleState(moduleState, moduleName);

        if (moduleName === MODULE_DEFAULT) {
          isDefaultModuleExist = true;
          console.log(ss('$$default module state found while startup cc!'), cl());
        }
        _state[moduleName] = moduleState;

        const sharedKey_globalKey_ = sharedToGlobalMapping[moduleName];
        if (sharedKey_globalKey_) {
          helper.handleModuleSharedToGlobalMapping(moduleName, sharedKey_globalKey_);
        }
      }
    }

    if (!isDefaultModuleExist) {
      _state[MODULE_DEFAULT] = {};
      console.log(ss('$$default module state not found,cc will generate one for user automatically!'), cl());
    }
  } else {// non module mode
    if (sharedToGlobalMapping && util.isObjectNotNull(sharedToGlobalMapping)) {
      throw util.makeError(ERR.CC_STORE_MAPPING_IS_NOT_ALLOWED_IN_NON_MODULE);
    }

    const includeDefaultModule = store.hasOwnProperty(MODULE_DEFAULT);
    const includeGlobalModule = store.hasOwnProperty(MODULE_GLOBAL);
    let invalidKeyCount = 0;

    if (includeDefaultModule || includeGlobalModule) {
      if (includeDefaultModule) {
        if (!util.isModuleStateValid(store[MODULE_DEFAULT])) {
          throw util.makeError(ERR.CC_STORE_STATE_INVALID, vbi(` moduleName:${MODULE_DEFAULT}'s state is invalid!`));
        }
        _state[MODULE_DEFAULT] = store[MODULE_DEFAULT];
        invalidKeyCount += 1;
        console.log(ss('$$default module state found while startup cc with non module mode!'), cl());
      } else {
        _state[MODULE_DEFAULT] = {};
      }

      if (includeGlobalModule) {
        if (!util.isModuleStateValid(store[MODULE_GLOBAL])) {
          throw util.makeError(ERR.CC_STORE_STATE_INVALID, vbi(` moduleName:${MODULE_GLOBAL}'s state is invalid!`));
        }
        globalState = store[MODULE_GLOBAL];
        Object.keys(globalState).forEach(key => globalStateKeys.push(key));
        invalidKeyCount += 1;
        console.log(ss('$$global module state found while startup cc with non module mode!'), cl());
        _state[MODULE_GLOBAL] = globalState;
      } else {
        _state[MODULE_GLOBAL] = {};
      }

      if (Object.keys(store).length > invalidKeyCount) {
        keysWarning('store');
      }
    } else {// treat store as $$default module store
      if (!util.isModuleStateValid(store)) {
        throw util.makeError(ERR.CC_STORE_STATE_INVALID, vbi(` moduleName:${MODULE_DEFAULT}'s state  is invalid!`));
      }
      _state[MODULE_DEFAULT] = store;
    }
  }

  const globalMappingKey_sharedKey_ = ccContext.globalMappingKey_sharedKey_;
  globalStateKeys.reduce((pKeys, gKey) => {
    if (!globalMappingKey_sharedKey_[gKey]) pKeys.push(gKey);
    return pKeys;
  }, pureGlobalStateKeys);

}

/**
 * @description
 * @author zzk
 * @param {*} reducer may like: {user:{getUser:()=>{}, setUser:()=>{}}, product:{...}}
 */
function bindReducerToCcContext(reducer) {
  const _reducer = ccContext.reducer._reducer;
  const moduleNames = Object.keys(reducer);

  const len = moduleNames.length;
  let isDefaultReducerExist = false, isGlobalReducerExist = false;
  for (let i = 0; i < len; i++) {
    const moduleName = moduleNames[i];
    helper.checkModuleName(moduleName, true);
    _reducer[moduleName] = reducer[moduleName];
    if (moduleName === MODULE_DEFAULT) isDefaultReducerExist = true;
    if (moduleName === MODULE_GLOBAL) isGlobalReducerExist = true;
  }
  if (!isDefaultReducerExist) _reducer[MODULE_DEFAULT] = {};
  if (!isGlobalReducerExist) _reducer[MODULE_GLOBAL] = {};
}

function bindComputedToCcContext(computed, isModuleMode) {
  if (!isPlainJsonObject(computed)) {
    throw new Error(`the computed value of StartUpOption is not a plain json object!`);
  }

  function mapComputed(m, moduleComputed) {
    const moduleState = _state[m];
    if (!moduleState) {
      throw util.makeError(ERR.CC_COMPUTED_MODULE_INVALID_IN_STARTUP_OPTION, vbi(` moduleName in computed: ${m}`));
    }
    if (!isPlainJsonObject(moduleComputed)) {
      throw new Error(`the value of one key of the computed object is not a plain json object!`);
    }
    const stateKeys = Object.keys(moduleComputed);
    stateKeys.forEach(key => {
      const originalValue = moduleState[key];
      if (originalValue !== undefined) {
        const moduleComputedFn = util.safeGetObjectFromObject(_computedFn, m);
        const fn = moduleComputed[key];
        moduleComputedFn[key] = fn;

        const computedValue = fn(originalValue, moduleState);
        const moduleComputedValue = util.safeGetObjectFromObject(_computedValue, m);
        moduleComputedValue[key] = computedValue;
      } else {
        //strict?
        justWarning(`key:${key} of module:${m} of computed object is not declared in module:${m} of store!`);
      }
    });
  }

  const { _computedFn, _computedValue } = ccContext.computed;
  const _state = ccContext.store._state;
  if (isModuleMode) {
    const moduleNames = Object.keys(computed);
    moduleNames.forEach(m => {
      mapComputed(m, computed[m]);
    });
  } else {
    mapToCcContextForNonModule(computed, mapComputed, 'computed');
  }
}

function mapToCcContextForNonModule(startOptionConfig, mapFn, configLabel){
  const includeDefaultKey = startOptionConfig.hasOwnProperty(MODULE_DEFAULT);
  const includeGlobalKey = startOptionConfig.hasOwnProperty(MODULE_GLOBAL);
  if (includeDefaultKey || includeGlobalKey) {
    let invalidKeyCount = 0;
    if (includeDefaultKey) {
      invalidKeyCount++;
      mapFn(MODULE_DEFAULT, startOptionConfig[MODULE_DEFAULT]);
    }
    if (includeGlobalKey) {
      invalidKeyCount++;
      mapFn(MODULE_GLOBAL, startOptionConfig[MODULE_GLOBAL]);
    }
    if (Object.keys(startOptionConfig).length > invalidKeyCount) {
      keysWarning(configLabel);
    }
  } else {
    mapFn(MODULE_DEFAULT, startOptionConfig);
  }
}

function bindWatchToCcContext(inputWatch, isModuleMode) {
  if (!isPlainJsonObject(inputWatch)) {
    throw new Error(`StartUpOption.watch is not a plain json object!`);
  }
  const ccWatch = ccContext.watch;
  const _state = ccContext.store._state;

  function mapWatch(moduleName, moduleWatch){
    const stateKeys = Object.keys(moduleWatch);
    stateKeys.forEach(key => {
      const moduleState = _state[moduleName];
      const originalValue = moduleState[key];
      if (originalValue !== undefined) {
        const moduleWatchFn = moduleWatch[key];
        if (typeof moduleWatchFn !== 'function') {
          throw new Error(`watch.${m}.${key} 's value is not a function`);
        }
        const ccModuleWatch = util.safeGetObjectFromObject(ccWatch, moduleName);
        ccModuleWatch[key] = moduleWatchFn;
      } else {
        //strict?
        justWarning(`key:${key} in watch.${moduleName} is not declared in store.${moduleName}!`);
      }
    });
  }

  if (isModuleMode) {
    const moduleNames = Object.keys(inputWatch);
    moduleNames.forEach(m => {
      const moduleState = _state[m];
      if (!moduleState) {
        throw util.makeError(ERR.CC_WATCH_MODULE_INVALID_IN_STARTUP_OPTION, vbi(` moduleName in watch is ${m}`));
      }
      const moduleWatch = inputWatch[m];
      mapWatch(m, moduleWatch);
    });
  }else{
    mapToCcContextForNonModule(inputWatch, mapWatch, 'watch');
  }
}

function executeInitializer(isModuleMode, store, init) {
  const stateHandler = helper.getStateHandlerForInit;
  if (init === undefined) return;

  if (!isModuleMode) {
    if (isPlainJsonObject(init)) {
      const includeDefaultModule = init.hasOwnProperty(MODULE_DEFAULT);
      const includeGlobalModule = init.hasOwnProperty(MODULE_GLOBAL);
      if (includeDefaultModule || includeGlobalModule) {
        if (includeDefaultModule) {
          const defaultInit = init[MODULE_DEFAULT];
          if (defaultInit) {
            if (typeof defaultInit !== 'function') {
              throw new Error('init.$$default value must be a function when cc startup in nonModuleMode!');
            } else {
              defaultInit(stateHandler(MODULE_DEFAULT));
            }
          }
        }

        if (includeGlobalModule) {
          const globalInit = init[MODULE_GLOBAL];
          if (globalInit) {
            if (typeof globalInit !== 'function') {
              throw new Error('init.$$global value must be a function when cc startup in nonModuleMode!');
            } else {
              globalInit(stateHandler(MODULE_GLOBAL));
            }
          }
        }

      } else {
        throw new Error('init value must be a function or a object like {$$default:Function, $$global:Function} when cc startup in nonModuleMode!');
      }
    } else {
      if (typeof init !== 'function') {
        throw new Error('init value must be a function or a object like {$$default:Function, $$global:Function} when cc startup in nonModuleMode!');
      }
      init(stateHandler(MODULE_DEFAULT));
    }
  } else {
    if (!isPlainJsonObject(init)) {
      throw new Error('init value must be a object like { ${moduleName}:Function } when cc startup in moduleMode!');
    }

    const moduleNames = Object.keys(init);
    moduleNames.forEach(moduleName => {
      if (!store[moduleName]) {
        throw new Error(`module ${moduleName} not found, check your ccStartupOption.init object keys`);
      }
      const initFn = init[moduleName];
      if (initFn) {
        initFn(stateHandler(moduleName));
      }
    });
  }
}

/* 
store in CC_CONTEXT may like:
 {
  $$global:{
 
  },
  module1:{
    books:[],
    user:{},
    color:'red',
    readCount:5,
  },
  module2:{
    books:[],
    colors:[],
    followCount:15,
  }
}
reducer = {
  [moduleName1]:{
    [actionType1]:callback(setState, {type:'',payload:''})
    [actionType2]:callback(setState, {type:'',payload:''})
  },
  [moduleName2]:{
    [actionType1]:callback(setState, {type:'',payload:''})
  }
}
init = {
  global:(setState)=>{}
}
*/
export default function ({
  isModuleMode = false,
  store = {},
  reducer = {},
  init = null,
  computed = {},
  watch = {},
  sharedToGlobalMapping = {},
  moduleSingleClass = {},
  middlewares = [],
  isStrict = false,//consider every error will be throwed by cc? it is dangerous for a running react app
  isDebug = false,
  errorHandler = null,
  isHot = false,
  autoCreateDispatcher = true,
} = {}) {
  try {
    util.justTip(`cc version ${ccContext.info.version}`);

    if (ccContext.isCcAlreadyStartup) {
      const err = util.makeError(ERR.CC_ALREADY_STARTUP);
      if (util.isHotReloadMode()) {
        clearObject(ccContext.reducer._reducer);
        clearObject(ccContext.store._state);
        clearObject(ccContext.computed._computedFn);
        clearObject(ccContext.computed._computedValue);
        clearObject(ccContext.event_handlers_);
        clearObject(ccContext.ccUniqueKey_handlerKeys_);
        const cct = ccContext.ccClassKey_ccClassContext_;
        Object.keys(cct).forEach(ccClassKey => {
          const ctx = cct[ccClassKey];
          clearObject(ctx.ccKeys);
        });
        clearObject(ccContext.handlerKey_handler_);
        clearObject(ccContext.ccKey_ref_, [CC_DISPATCHER]);
        clearObject(ccContext.refs, [CC_DISPATCHER]);
        clearObject(ccContext.fragmentCcKeys);
        clearObject(ccContext.ccKey_option_);
        util.hotReloadWarning(err);
      }
      else throw err;
    }

    if (autoCreateDispatcher) {
      if (!ccContext.refs[CC_DISPATCHER]) {
        const Dispatcher = createDispatcher();
        let box = document.querySelector(`#${CC_DISPATCHER_BOX}`);
        if (!box) {
          box = document.createElement('div');
          box.id = CC_DISPATCHER_BOX;
          box.style.position = 'fixed';
          box.style.left = 0;
          box.style.top = 0;
          box.style.display = 'none';
          box.style.zIndex = -888666;
          document.body.append(box);
        }
        ReactDOM.render(React.createElement(Dispatcher), box);
        util.justTip(`[[startUp]]: cc create a CcDispatcher automatically`);
      } else {
        util.justTip(`[[startUp]]: CcDispatcher existed already`);
      }
    } else {
      throw 'customizing Dispatcher is not allowed in current version cc';
    }

    if (window) {
      window.CC_CONTEXT = ccContext;
      window.ccc = ccContext;
    }

    ccContext.isModuleMode = isModuleMode;
    ccContext.isStrict = isStrict;
    ccContext.isDebug = isDebug;
    util.safeAssignObjectValue(ccContext.sharedToGlobalMapping, sharedToGlobalMapping);
    util.safeAssignObjectValue(ccContext.moduleSingleClass, moduleSingleClass);

    bindStoreToCcContext(store, sharedToGlobalMapping, isModuleMode);
    bindReducerToCcContext(reducer);
    bindComputedToCcContext(computed, isModuleMode);
    bindWatchToCcContext(watch, isModuleMode);

    if (init) {
      const computedStore = ccContext.store._state;
      executeInitializer(isModuleMode, computedStore, init);
    }

    if (middlewares.length > 0) {
      const ccMiddlewares = ccContext.middlewares;
      middlewares.forEach(m => ccMiddlewares.push(m));
    }

    ccContext.isCcAlreadyStartup = true;
    ccContext.isHot = isHot;
    ccContext.errorHandler = errorHandler;
  } catch (err) {
    if (errorHandler) errorHandler(err);
    else throw err;
  }
}