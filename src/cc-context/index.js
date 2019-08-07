import { MODULE_GLOBAL, MODULE_CC, MODULE_DEFAULT } from '../support/constant';
import * as util from '../support/util';

const refs = {};
const setStateByModule = (module, committedState) => {
  const moduleState = getState(module);
  const prevModuleState = getPrevState(module);
  const moduleComputedFns = _computedFn[module];
  const moduleComputedValue = _computedValue[module];
  const watchFns = _watch[module];

  Object.keys(committedState).forEach(key => {
    /** setStateByModuleAndKey */
    const value = committedState[key];

    const oldValue = moduleState[key];
    prevModuleState[key] = oldValue;
  
    const fnCtx = { key, module, moduleState, committedState };
    if (moduleComputedFns) {
      const fn = moduleComputedFns[key];
      if (fn) {
        const computedValue = fn(value, oldValue, fnCtx);
        moduleComputedValue[key] = computedValue;
      }
    }
  
    if (watchFns) {
      const fn = watchFns[key];
      if (fn) fn(value, oldValue, fnCtx);//fn(newValue, oldValue)
    }
    moduleState[key] = value;
  });
}

const getState = (module) => {
  return _state[module];
}

const getPrevState = (module) => {
  return _prevState[module];
}

const _computedValue = {
  [MODULE_GLOBAL]: {},
  [MODULE_DEFAULT]: {},
  [MODULE_CC]: {},
};
const _computedFn = {
  [MODULE_GLOBAL]: {},
  [MODULE_DEFAULT]: {},
  [MODULE_CC]: {},
};
const computed = {
  _computedValue,
  _computedFn,
  getRootComputedValue: () => _computedValue,
  getRootComputedFn: () => _computedFn,
};

/** watch section */
const _watch = {};
const watch = {
  _watch,
  getRootWatch: () => _watch,
  getModuleWatch: module => _watch[module],
};

function hotReloadWarning(err){
  const message = err.message || err;
  const st = 'color:green;border:1px solid green';
  console.log(`%c error detected ${message}, cc found app is maybe running in hot reload mode, so cc will silent this error...`, st);
  console.log(`%c but if this is not as your expectation ,maybe you can reload your whole app to avoid this error message`, st);
}

/** ccContext section */
const _state = {};
const _prevState = {};
const ccContext = {
  isHotReloadMode: function() {
    if (ccContext.isHot) return true;
    
    let result = false;
    if (window) {
      console.log(`%c[[isHotReloadMode]] window.name:${window.name}`, 'color:green;border:1px solid green');
      if (window.webpackHotUpdate 
        || window.name === 'previewFrame' //for stackblitz
        || window.__SANDBOX_DATA__ // for codesandbox
        ) {
        result = true;
      }
    }
    console.log('result is ', result);
    return result;
  },
  throwCcHmrError: function(err){
    if(ccContext.isHotReloadMode()){
      hotReloadWarning(err);
    }else throw err;
  },
  isDebug: false,
  // if isStrict is true, every error will be throw out instead of console.error, 
  // but this may crash your app, make sure you have a nice error handling way,
  // like componentDidCatch in react 16.*
  isStrict: false,
  returnRootState: false,
  isCcAlreadyStartup: false,
  //  cc allow multi react class register to a module by default, but if want to control some module 
  //  to only allow register one react class, flag the module name as true in this option object
  //  example:  {fooModule: true, barModule:true}
  moduleSingleClass: {
  },
  moduleName_ccClassKeys_: {
  },
  // 映射好模块的状态所有key并缓存住，用于提高性能
  moduleName_stateKeys_: {
  },
  // 记录某个模块作为其他被哪些ccClass连接
  connectedModuleName_ccClassKeys_: {

  },
  /**
    ccClassContext:{
      module,
      watchedKeys,
      connectedState:{},
      connectedComputed:{},
      ccKeys: [],
      connectedModuleduleKeyMapping: null,
      connectedModuledule:{}
    }
  */
  ccClassKey_ccClassContext_: {
  },
  // globalStateKeys is maintained by cc automatically,
  // when user call cc.setGlobalState, or ccInstance.setGlobalState,
  // commit state will be checked strictly by cc with globalStateKeys,
  // all the keys of commit state must been included in globalStateKeys
  globalStateKeys: [
  ],
  //store里的setState行为会自动触发模块级别的computed、watch函数
  store: {
    appendState: function (module, state) {
      const moduleName_stateKeys_ = ccContext.moduleName_stateKeys_;
      const stateKeys = util.safeGetArrayFromObject(moduleName_stateKeys_, module);
      util.okeys(state).forEach(k => {
        if (!stateKeys.includes(k)) {
          stateKeys.push(k);
        }
      });
      ccContext.store.setState(module, state);
    },
    _state,
    _prevState,//辅助CcFragment defineEffect之用
    getState: function (module) {
      if (module) return getState(module);
      else return _state;
    },
    getPrevState: function (module) {
      if (module) return getPrevState(module);
      else return _prevState;
    },
    setState: function (module, partialSharedState) {
      setStateByModule(module, partialSharedState);
    },
    setGlobalState: function (partialGlobalState) {
      setStateByModule(MODULE_GLOBAL, partialGlobalState);
    },
    getGlobalState: function () {
      return _state[MODULE_GLOBAL];
    },
    //对state直接赋值，cc启动的时候某些场景需要调用此函数
    initStateDangerously: (module, state)=>{
      _state[module] = state;
    },
  },
  reducer: {
    _reducer: {
      [MODULE_GLOBAL]: {
      },
      [MODULE_CC]: {
      }
    },
    _reducerCaller: {},
    _lazyReducerCaller: {},
    _reducerFnName_fullFnNames_: {},
    _reducerModule_fnNames_: {}
  },
  computed,
  watch,
  refStore: {
    _state: {},
    setState: function (ccUniqueKey, partialStoredState) {
      const _state = ccContext.refStore._state;
      const fullStoredState = _state[ccUniqueKey];
      const mergedState = Object.assign({}, fullStoredState, partialStoredState);
      _state[ccUniqueKey] = mergedState;
    },
  },
  init: {
    _init: {}
  },
  ccUkey_ref_: refs,
  //  key:eventName,  value: Array<{ccKey, identity,  handlerKey}>
  event_handlers_: {},
  ccUKey_handlerKeys_: {},
  // to avoid memory leak, the handlerItem of event_handlers_ just store handlerKey, 
  // it is a ref that towards ccUniqueKeyEvent_handler_'s key
  // when component unmounted, it's handler will been removed
  handlerKey_handler_: {},
  ccUkey_option_: {},
  refs,
  info: {
    startupTime: Date.now(),
    version: '1.5.8',
    author: 'fantasticsoul',
    emails: ['624313307@qq.com', 'zhongzhengkai@gmail.com'],
    tag: 'destiny',
  },

  // fragment association
  fragmentNameCount: 0,
  featureStr_classKey_: {},
  userClassKey_featureStr_: {},
  errorHandler: null,
  middlewares: [],
  plugins:[],
}

export function getCcContext() {
  return ccContext;
}

const lsLen = localStorage.length;
const _refStoreState = ccContext.refStore._state;
for (var i = 0; i < lsLen; i++) {
  const lsKey = localStorage.key(i);
  if (lsKey.startsWith('CCSS_')) {
    try {
      _refStoreState[lsKey.substr(5)] = JSON.parse(localStorage.getItem(lsKey));
    } catch (err) {
      console.error(err);
    }
  }
}

export default ccContext;
