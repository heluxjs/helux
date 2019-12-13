import ccContext from '../cc-context';
import { ERR, MODULE_GLOBAL, SIG_MODULE_CONFIGURED } from '../support/constant';
import * as util from '../support/util';
import initModuleState from '../core/state/init-module-state';
import initModuleReducer from '../core/reducer/init-module-reducer';
import initModuleComputed from '../core/computed/init-module-computed';
import initModuleWatch from '../core/watch/init-module-watch';
import * as checker from '../core/checker';
import { send } from '../core/plugin';
import { makeSetStateHandler } from '../core/state/handler-factory';

const ccGlobalStateKeys = ccContext.globalStateKeys;
const { makeError, verboseInfo, isPlainJsonObject, okeys } = util;

function setGlobalState(storedGlobalState, inputGlobalState) {
  if (inputGlobalState) {
    if (!isPlainJsonObject(inputGlobalState)) {
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
  if (!isPlainJsonObject(config)) {
    throw new Error('[[configure]] param type error, config is not plain json object!');
  }
  if (module === MODULE_GLOBAL) {
    throw new Error('cc do not allow configure global module');
  }

  const { state, reducer, computed, watch, init, isClassSingle } = config;
  const { reducer: optionReducer, globalState, globalWatch, globalComputed, middlewares } = option;

  if (reducer && !isPlainJsonObject(reducer)) {
    throw makeError(ERR.CC_MODULE_REDUCER_INVALID, verboseInfo(`module[${module}]`));
  }

  initModuleState(module, state, true, 'configure');
  initModuleReducer(module, reducer, true, 'configure');

  const _state = ccContext.store._state;
  const _reducer = ccContext.reducer._reducer;
  _state[module] = state;

  computed && initModuleComputed(module, computed);
  watch && initModuleWatch(module, watch);
  ccContext.moduleSingleClass[module] = isClassSingle === true;

  if (optionReducer) {
    if (!isPlainJsonObject(optionReducer)) {
      throw makeError(ERR.CC_OPTION_REDUCER_INVALID, verboseInfo(`configure module[${module}]`));
    }
    const reducerModuleNames = Object.keys(optionReducer);
    reducerModuleNames.forEach(rmName => {
      checker.checkModuleName(rmName);
      const moduleReducer = optionReducer[rmName];
      if (!isPlainJsonObject(moduleReducer)) {
        throw makeError(ERR.CC_OPTION_REDUCER_FVALUE_INVALID, verboseInfo(`configure module[${module}], option.reducer.${rmName}`));
      }

      if (rmName === MODULE_GLOBAL) {//merge input globalReducer to existed globalReducer
        const fnNames = Object.keys(moduleReducer);
        const globalReducer = _reducer[MODULE_GLOBAL];
        fnNames.forEach(fnName => {
          if (globalReducer[fnName]) {
            throw makeError(ERR.CC_REDUCER_ACTION_TYPE_DUPLICATE, verboseInfo(`type ${fnName}`));
          }
          var reducerFn = moduleReducer[fnName];
          if (typeof reducerFn !== 'function') {
            throw makeError(ERR.CC_REDUCER_NOT_A_FUNCTION);
          }
          globalReducer[fnName] = reducerFn;
        });
      } else {
        _reducer[rmName] = moduleReducer;
      }
    });
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

  ccContext.moduleName_isConfigured_[module] = true;
  send(SIG_MODULE_CONFIGURED, module);
}
