import ccContext from '../cc-context';
import { ERR, MODULE_GLOBAL, SIG_MODULE_CONFIGURED } from '../support/constant';
import util, { makeError, verboseInfo, isPlainJsonObject, okeys } from '../support/util';
import initModuleState from '../core/state/init-module-state';
import initModuleReducer from '../core/reducer/init-module-reducer';
import initModuleComputed from '../core/computed/init-module-computed';
import initModuleWatch from '../core/watch/init-module-watch';
import * as checker from '../core/checker';
import { send } from '../core/plugin';
import { makeSetStateHandler } from '../core/state/handler-factory';

const ccGlobalStateKeys = ccContext.globalStateKeys;

function setGlobalState(storedGlobalState, inputGlobalState) {
  if (inputGlobalState) {
    if (!util.isPlainJsonObject(inputGlobalState)) {
      throw new Error(`option.globalState is not a plain json object`);
    }

    const gKeys = okeys(inputGlobalState);
    gKeys.forEach(gKey => {
      if (storedGlobalState.hasOwnProperty(gKey)) {
        throw new Error(`key[${gKey}] duplicated in globalState`);
      }
      ccGlobalStateKeys.push(gKey);
      storedGlobalState[gKey] = inputGlobalState[gKey];
    });
  }
}

/**
 * @description configure module、state、option to cc
 * @author zzk
 * @export
 * @param {string} module
 * @param {{state:object, reducer:object, watch:object, computed:object, init:object, isClassSingle:boolean}} config
 * @param {object} [option] reducer、init
 * @param {{[reducerModuleName:string]:{[fnName:string]:function}}} [option.reducer]
 * @param {object} [option.globalState] will been merged to $$global module state
 * @param {object} [option.globalWatch] will been merged to $$global module watch
 * @param {object} [option.globalComputed] will been merged to $$global module computed
 * @param {function[]} [option.middlewares]
 */
export default function(module, config, option = {}) {
  if (!ccContext.isCcAlreadyStartup) {
    throw new Error('cc is not startup yet, you can not call cc.configure!');
  }
  if (!util.isPlainJsonObject(config)) {
    throw new Error('[[configure]] param type error, config is not plain json object!');
  }
  if (module === MODULE_GLOBAL) {
    throw new Error('cc do not allow configure global module');
  }

  const { state, reducer, computed, watch, init, isClassSingle } = config;
  const { reducer: optionReducer, globalState, globalWatch, globalComputed, middlewares } = option;

  initModuleState(module, state);
  initModuleReducer(module, reducer);

  const _state = ccContext.store._state;
  const _reducer = ccContext.reducer._reducer;
  _state[module] = state;

  if (computed) {
    initModuleComputed(module, computed);
  }
  if (watch) {
    initModuleWatch(module, watch);
  }

  if (isClassSingle === true) {
    ccContext.moduleSingleClass[module] = true;
  }

  if (optionReducer) {
    if (!isPlainJsonObject(optionReducer)) {
      throw makeError(ERR.CC_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID, verboseInfo(`module[${module}] 's moduleReducer is invalid`));
    }
    const reducerModuleNames = Object.keys(optionReducer);
    reducerModuleNames.forEach(rmName => {
      checker.checkModuleName(rmName);
      const moduleReducer = optionReducer[rmName];
      if (!isPlainJsonObject(moduleReducer)) {
        throw makeError(ERR.CC_REDUCER_VALUE_IN_CC_CONFIGURE_OPTION_IS_INVALID, verboseInfo(`module[${module}] reducer 's value is invalid`));
      }

      if (rmName === MODULE_GLOBAL) {//merge input globalReducer to existed globalReducer
        const typesOfGlobal = Object.keys(moduleReducer);
        const globalReducer = _reducer[MODULE_GLOBAL];
        typesOfGlobal.forEach(type => {
          if (globalReducer[type]) {
            throw makeError(ERR.CC_REDUCER_ACTION_TYPE_DUPLICATE, verboseInfo(`type ${type}`));
          }
          var reducerFn = moduleReducer[type];
          if (typeof reducerFn !== 'function') {
            throw makeError(ERR.CC_REDUCER_NOT_A_FUNCTION);
          }
          globalReducer[type] = reducerFn;
        });
      } else {
        _reducer[rmName] = moduleReducer;
      }
    });
  }

  if (reducer) {
    if (!isPlainJsonObject(reducer)) {
      throw makeError(ERR.CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID, verboseInfo(`config.reducer is not a plain json object`));
    }
    _reducer[module] = reducer;
  }

  const storedGlobalState = _state[MODULE_GLOBAL];
  //这里的设置顺序很重要，一定是先设置State，再设置Computed，因为Computed会触发计算
  setGlobalState(storedGlobalState, globalState, 'State');
  if (globalComputed) initModuleComputed(MODULE_GLOBAL, globalComputed, true);
  if (globalWatch) initModuleWatch(MODULE_GLOBAL, globalWatch, true);

  if (init) {
    if (typeof init !== 'function') {
      throw new Error('init value must be a function!');
    }
    init(makeSetStateHandler(module));
  }

  if (middlewares && middlewares.length > 0) {
    const ccMiddlewares = ccContext.middlewares;
    middlewares.forEach(m => {
      if (typeof m !== 'function') throw new Error('one item of option.middlewares is not a function');
      ccMiddlewares.push(m)
    });
  }

  send(SIG_MODULE_CONFIGURED, module);
}
