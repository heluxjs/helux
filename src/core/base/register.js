
import React from 'react';
// import hoistNonReactStatic from 'hoist-non-react-statics';
import {
  MODULE_DEFAULT, MODULE_GLOBAL, ERR, CC_FRAGMENT_PREFIX, CC_DISPATCHER,
  CCSYNC_KEY, MOCKE_KEY,
  STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
  STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
  SIG_FN_START, SIG_FN_END, SIG_FN_QUIT, SIG_FN_ERR,
  SHARE_STATE_BELONG_TO_MODULE, SHARE_STATE_BELONG_TO_SHARED_STATE_KEYS,
} from '../../support/constant';
import ccContext from '../../cc-context';
import util, { isPlainJsonObject, convertToStandardEvent, okeys } from '../../support/util';
import co from 'co';
import extractStateByKeys from '../state/extract-state-by-keys';
// import setConnectedState from '../state/set-connected-state';
import buildCcClassContext from './build-cc-class-context';
import catchCcError from './catch-cc-error';
import mapModuleAndCcClassKeys from '../mapper/map-module-and-cc-class-keys';
import unsetRef from '../ref/unset-ref';
import setRef from '../ref/set-ref';
import runLater from './run-later';
import computeCcUniqueKey from './compute-cc-unique-key';
import buildMockEvent from './build-mock-event';
import getFeatureStrAndStpMapping from './get-feature-str-and-stpmapping';
import extractStateByCcsync from '../state/extract-state-by-ccsync';
import { getChainId, setChainState, setAndGetChainStateList, exitChain, removeChainState, isChainExited, setChainIdLazy, isChainIdLazy } from '../chain';
import { send } from '../plugin';
import * as checker from '../checker';
import * as ev from '../event';
import watchKeyForRef from '../watch/watch-key-for-ref';
import computeValueForRef from '../computed/compute-value-for-ref';
import getWatchSpec from '../watch/get-watch-spec';
import getComputedSpec from '../computed/get-computed-spec';
import { ok } from 'assert';

const { verifyKeys, ccClassDisplayName, styleStr, color, verboseInfo, makeError, justWarning, throwCcHmrError } = util;
const {
  store: { _state, getState, setState: ccStoreSetState },
  reducer: { _reducer }, refStore,
  computed: { _computedValue },
  moduleName_sharedStateKeys_, moduleName_stateKeys_,
  ccKey_ref_, ccKey_option_, moduleName_ccClassKeys_, ccClassKey_ccClassContext_,
  middlewares
} = ccContext;
const cl = color;
const ss = styleStr;
const me = makeError;
const vbi = verboseInfo;

const DISPATCH = 'dispatch';
const SET_STATE = 'setState';
const SET_GLOBAL_STATE = 'setGlobalState';
const FORCE_UPDATE = 'forceUpdate';

function paramCallBackShouldNotSupply(module, currentModule) {
  return `if you pass param reactCallback, param module must equal current CCInstance's module, module: ${module}, CCInstance's module:${currentModule}, now the cb will never been triggered! `;
}

function handleError(err, throwError = true) {
  if (throwError) throw err;
  else {
    handleCcFnError(err);
  }
}

function checkStoreModule(module, throwError = true) {
  try {
    checker.checkModuleName(module, false, `module[${module}] is not configured in store`);
    return true;
  } catch (err) {
    handleError(err, throwError);
    return false;
  }
}

// any error in this function will not been throwed, cc just warning, 
function isStateModuleValid(inputModule, currentModule, reactCallback, cb) {
  let targetCb = reactCallback;
  if (checkStoreModule(inputModule, false)) {
    if (inputModule != currentModule) {
      if (reactCallback) {
        justWarning(me(ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID, vbi(paramCallBackShouldNotSupply(inputModule, currentModule))));
        targetCb = null;//let user's reactCallback has no chance to be triggered
      }
    }
    cb(null, targetCb);
  } else {
    cb(new Error(`inputModule:${inputModule} invalid`), null);
  }
}

function getSharedKeys(module, ccClassKey, inputSharedStateKeys) {
  let sharedStateKeys = inputSharedStateKeys;
  if (inputSharedStateKeys === '*') {
    sharedStateKeys = Object.keys(getState(module));
  }
  const { notArray, keyElementNotString } = verifyKeys(sharedStateKeys, []);
  if (notArray) {
    throw me(ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY, vbi(`ccClassKey:${ccClassKey}`));
  }
  if (keyElementNotString) {
    throw me(ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT, vbi(`ccClassKey:${ccClassKey}`));
  }
  return sharedStateKeys;
}

function checkCcStartupOrNot() {
  if (!window.cc || ccContext.isCcAlreadyStartup !== true) {
    throw new Error('you must startup cc by call startup method before register ReactClass to cc!');
  }
}

//to let cc know a specified module are watching what sharedStateKeys
function mapModuleAndSharedStateKeys(moduleName, partialSharedStateKeys) {
  let sharedStateKeysOfModule = moduleName_sharedStateKeys_[moduleName];
  if (!sharedStateKeysOfModule) sharedStateKeysOfModule = moduleName_sharedStateKeys_[moduleName] = [];
  partialSharedStateKeys.forEach(sKey => {
    if (!sharedStateKeysOfModule.includes(sKey)) sharedStateKeysOfModule.push(sKey);
  });
}

//tell cc this ccClass is watching some sharedStateKeys of a module state
function mapCcClassKeyAndCcClassContext(ccClassKey, moduleName, originalSharedStateKeys, sharedStateKeys, connectSpec) {
  let fragmentPrefixLen = CC_FRAGMENT_PREFIX.length;
  if (ccClassKey.toLowerCase().substring(0, fragmentPrefixLen) === CC_FRAGMENT_PREFIX) {
    throw me(ERR.CC_CLASS_KEY_FRAGMENT_NOT_ALLOWED);
  }
  const { stateToPropMapping, connectedModuleNames } = getFeatureStrAndStpMapping(connectSpec);

  const contextMap = ccContext.ccClassKey_ccClassContext_;
  const ctx = contextMap[ccClassKey];
  if (ctx !== undefined) {// analyze is ccClassKey really duplicated
    if (util.isHotReloadMode()) {
      const str1 = ctx.originalSharedStateKeys.toString() + JSON.stringify(ctx.stateToPropMapping);
      const str2 = originalSharedStateKeys.toString() + JSON.stringify(stateToPropMapping);
      if (str1 !== str2) {
        throw me(ERR.CC_CLASS_KEY_DUPLICATE, `ccClassKey:${ccClassKey} duplicate`);
      } else {
        throwCcHmrError(me(ERR.CC_CLASS_KEY_DUPLICATE, `ccClassKey:${ccClassKey} duplicate`));
      }
    } else {
      throw me(ERR.CC_CLASS_KEY_DUPLICATE, `ccClassKey:${ccClassKey} duplicate`);
    }
  }

  buildCcClassContext(ccClassKey, moduleName, originalSharedStateKeys, sharedStateKeys, stateToPropMapping, connectedModuleNames);
}

/**
 * register针对sharedStateKeys设定的默认策略是
 * SHARE_STATE_BELONG_TO_MODULE：sharedStateKeys仅仅代表关心变化的key，concent允许实例调用的reducer提交不属于sharedStateKeys描述的key，但是属于这个模块的key
 */
function getSuitableSharedStateKeys(sharedStrategy, isDispatcher, stateFor, moduleName, ccClassSharedStateKeys) {
  ////dispatcher实例调用的话，本身是不携带任何***StateKeys信息的
  if (sharedStrategy == SHARE_STATE_BELONG_TO_MODULE || isDispatcher) {
    return moduleName_stateKeys_[moduleName] || []
  }

  let sharedStateKeys;
  if (stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY) {
    sharedStateKeys = ccClassSharedStateKeys;
  } else if (stateFor === STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE) {
    // user may declare module but no any class register to the module,
    // and a cc class define stateToPropMapping to watch this module's state change,
    sharedStateKeys = moduleName_sharedStateKeys_[moduleName] || [];
  } else {
    throw new Error(`stateFor is not set correctly! `)
  }
  return sharedStateKeys;
}

function mapModuleAssociateDataToCcContext(ccClassKey, stateModule, sharedStateKeys, connectSpec) {

  const targetSharedStateKeys = getSharedKeys(stateModule, ccClassKey, sharedStateKeys);

  mapCcClassKeyAndCcClassContext(ccClassKey, stateModule, sharedStateKeys, targetSharedStateKeys, connectSpec)
  mapModuleAndSharedStateKeys(stateModule, targetSharedStateKeys);

  mapModuleAndCcClassKeys(stateModule, ccClassKey);

  return targetSharedStateKeys;
}

function updateConnectedState(targetClassContext, commitModule, commitState, commitStateKeys) {
  const { stateToPropMapping, connectedModule } = targetClassContext;
  if (connectedModule[commitModule] === 1) {

    const { ccKeys } = targetClassContext;
    let isSetConnectedStateTriggered = false;
    const len = commitStateKeys.length;
    for (let i = 0; i < len; i++) {
      const moduledStateKey = `${commitModule}/${commitStateKeys[i]}`;
      if (stateToPropMapping[moduledStateKey]) {
        isSetConnectedStateTriggered = true;
        break;
        //只要感知到有一个key发生变化，就可以跳出循环了，
        //因为connectedState指向的是store里state的引用，更新动作在store里修改时就已完成
      }
    }

    // const { connectedState, ccKeys } = targetClassContext;
    // let isSetConnectedStateTriggered = false;
    // commitStateKeys.forEach(sKey => {
    //   const moduledStateKey = `${commitModule}/${sKey}`;
    //   if (stateToPropMapping[moduledStateKey]) {
    //     setConnectedState(connectedState, commitModule, sKey, commitState[sKey]);
    //     isSetConnectedStateTriggered = true;
    //   }
    // });

    //针对targetClassContext，遍历完提交的state key，触发了更新connectedState的行为，把targetClassContext对应的cc实例都强制刷新一遍
    if (isSetConnectedStateTriggered === true) {
      ccKeys.forEach(ccUniKey => {
        const ref = ccKey_ref_[ccUniKey];
        if (ref) {
          const refCc = ref.cc;
          const watchSpec = refCc.watchSpec;
          const computedSpec = refCc.computedSpec;
          const shouldCurrentRefUpdate = watchKeyForRef(commitModule, watchSpec, refCc.ccState.connect, getState(commitModule), commitState, ref.__fragmentParams);
          //如果ref是CcFragment实例，将获得ctx
          computeValueForRef(commitModule, computedSpec, refCc.refComputed, refCc.refConnectedComputed, ref.state, commitState, ref.__fragmentParams);
          if (shouldCurrentRefUpdate) refCc.reactForceUpdate();
        }
      });
    }
  }
}

function broadcastConnectedState(commitModule, commitState) {
  // if there is no any react class registered to module, here will get undefined, so use safeGetArrayFromObject
  const commitStateKeys = Object.keys(commitState);//提前把commitStateKeys拿到，省去了在updateConnectedState内部的多次获取过程
  Object.keys(moduleName_ccClassKeys_).forEach(moduleName => {
    const ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, moduleName);
    ccClassKeys.forEach(ccClassKey => {
      const ccClassContext = ccClassKey_ccClassContext_[ccClassKey];
      updateConnectedState(ccClassContext, commitModule, commitState, commitStateKeys);
    });
  });
}

function _promiseErrorHandler(resolve, reject) {
  return (err, ...args) => err ? reject(err) : resolve(...args);
}

function _promisifyCcFn(ccFn, userLogicFn, executionContext, ...args) {
  return new Promise((resolve, reject) => {
    const _executionContext = Object.assign(executionContext, { __innerCb: _promiseErrorHandler(resolve, reject) });
    ccFn(userLogicFn, _executionContext, ...args);
  }).catch(catchCcError);
}

function handleCcFnError(err, __innerCb) {
  if (err) {
    if (__innerCb) __innerCb(err);
    else {
      justWarning(err);
      if (ccContext.errorHandler) ccContext.errorHandler(err);
    }
  }
}

function getStateFor(inputModule, currentModule) {
  return inputModule === currentModule ? STATE_FOR_ONE_CC_INSTANCE_FIRSTLY : STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE;
}

export default function register(ccClassKey, {
  module = MODULE_DEFAULT,
  sharedStateKeys: inputSharedStateKeys = [],
  storedStateKeys: inputStoredStateKeys = [],
  connect = {},
  reducerModule,
  isPropsProxy = false,
  isSingle = false,
  sharedStrategy = SHARE_STATE_BELONG_TO_MODULE,
  asyncLifecycleHook = true,// is asyncLifecycleHook = false, it may block cc broadcast state to other when it takes a long time to finish
  __checkStartUp = true,
  __calledBy,
} = {}) {
  try {
    if (!ccClassKey) throw new Error(`[[register]]: ccClassKey is undefined!`)

    if (__checkStartUp === true) checkCcStartupOrNot();
    if (__calledBy !== 'cc') {
      if (ccClassKey.toLowerCase() === CC_DISPATCHER.toLowerCase()) {
        throw new Error(`${CC_DISPATCHER} is cc built-in ccClassKey name, if you want to customize your dispatcher, 
        you can set autoCreateDispatcher=false in StartupOption, and use createDispatcher then.`)
      }
    }

    const _curStateModule = module;
    const _asyncLifecycleHook = asyncLifecycleHook;
    const _reducerModule = reducerModule || _curStateModule;//if reducerModule not defined, will be equal module;

    checkStoreModule(_curStateModule);

    const sKeys = mapModuleAssociateDataToCcContext(ccClassKey, _curStateModule, inputSharedStateKeys, connect);
    const sharedStateKeys = sKeys;
    const isIssArr = Array.isArray(inputStoredStateKeys);
    if (!isIssArr && inputStoredStateKeys !== '*') {
      throw new Error(`register.option.storedStateKeys type err, it is must be an array or string *`)
    }
    if (isIssArr) {
      inputStoredStateKeys.forEach(v => {
        if (sKeys.includes(v)) {
          throw new Error(`register.option.storedStateKeys key err, the key[${v}] is already been declared in sharedStateKeys`)
        }
      });
    }

    return function (ReactClass) {
      if (ReactClass.prototype.$$changeState && ReactClass.prototype.__$$mapCcToInstance) {
        throw me(ERR.CC_REGISTER_A_CC_CLASS, vbi(`if you want to register ${ccClassKey} to cc successfully, the ReactClass can not be a CcClass!`));
      }

      const ToBeExtendedClass = isPropsProxy === false ? ReactClass : React.Component;
      const CcClass = class CcClass extends ToBeExtendedClass {

        constructor(props, context) {
          try {
            super(props, context);
            if (!this.state) this.state = {};
            const { ccKey, ccOption = {} } = props;
            const originalCcKey = ccKey;

            //这些方法是cc自己注入的
            util.bindThis(this, [
              '__$$mapCcToInstance', '$$changeState', '__$$recoverState', '$$domDispatch', '$$sync', '$$toggleBool', '$$set',
              '__$$getEffectHandler', '__$$getXEffectHandler', '__$$makeEffectHandler', '__$$sync', '$$syncInt',
              '__$$getInvokeHandler', '__$$getXInvokeHandler', '__$$makeInvokeHandler',
              '__$$getChangeStateHandler', '__$$getDispatchHandler',
              '$$attach',
            ]);

            // if you flag syncSharedState false, that means this ccInstance's state changing will not effect other ccInstance and not effected by other ccInstance's state changing
            if (ccOption.syncSharedState === undefined) ccOption.syncSharedState = true;

            if (ccOption.asyncLifecycleHook === undefined) ccOption.asyncLifecycleHook = _asyncLifecycleHook;
            const { asyncLifecycleHook } = ccOption;

            const { ccKey: newCcKey, ccUniqueKey, isCcUniqueKeyAutoGenerated } = computeCcUniqueKey(isSingle, ccClassKey, ccKey);
            const ccClassContext = ccClassKey_ccClassContext_[ccClassKey];
            setRef(this, isSingle, ccClassKey, newCcKey, ccUniqueKey, ccOption);

            if (!ccOption.storedStateKeys) {
              ccOption.storedStateKeys = inputStoredStateKeys;
            }
            if (ccOption.storedStateKeys === '*') {
              const toExcludeKeys = sharedStateKeys;
              const allKeys = Object.keys(this.state);
              const storedStateKeys = allKeys.filter(k => !toExcludeKeys.includes(k));
              ccOption.storedStateKeys = storedStateKeys;
            }

            this.__$$mapCcToInstance(
              isSingle, asyncLifecycleHook, ccClassKey, originalCcKey, newCcKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, ccOption.storedStateKeys,
              ccOption, ccClassContext, _curStateModule, _reducerModule, sharedStateKeys, connect
            );

            this.$$connectedState = this.cc.connectedState;
            this.$$globalState = this.cc.globalState;
            this.$$refComputed = this.cc.refComputed;
            this.$$refConnectedComputed = this.cc.refConnectedComputed;

            //这些方法是cc交给用户定义的，放置到cc下统一管理，因为多重装饰器模式下，这里属性是从this上取不到的
            //放在__$$recoverState之前，优先设置this.cc.computed
            if (this.$$watch) {
              this.cc.watch = this.$$watch.bind(this);
              this.cc.watchSpec = getWatchSpec(this.cc.watch);
            }
            if (this.$$computed) {
              this.cc.computed = this.$$computed.bind(this);
              this.cc.computedSpec = getComputedSpec(this.cc.computed);
            }
            if (this.$$onUrlChanged) this.cc.onUrlChanged = this.$$onUrlChanged.bind(this);
            if (this.$$execute) this.cc.execute = this.$$execute.bind(this);
            //$$cache要注意使用规范
            if (this.$$cache) {
              this.$$cache = this.$$cache.bind(this);
              this.$$refCache = this.$$cache();
            } else {
              this.$$refCache = {};
            }

            this.__$$recoverState(_curStateModule, sharedStateKeys, ccOption, ccUniqueKey, connect);
          } catch (err) {
            catchCcError(err);
          }
        }

        // 如果代理组件或者继承组件没有没有实现scu，则concent采用只比较state的方式来决定组件要不要更新，不再关心nextProps
        shouldComponentUpdate(nextProps, nextState) {
          const childRef = this.cc.childRef;
          if (childRef && childRef.shouldComponentUpdate) {
            return childRef.shouldComponentUpdate(nextProps, nextState);
          } else if (super.shouldComponentUpdate) {
            return super.shouldComponentUpdate(nextProps, nextState);
          }
          return this.state !== nextState;
        }

        __$$recoverState(currentModule, sharedStateKeys, ccOption, ccUniqueKey, connect) {
          let refStoredState = refStore._state[ccUniqueKey] || {};

          const sharedState = _state[currentModule];
          const { syncSharedState } = ccOption;

          let partialSharedState = {};
          if (syncSharedState) {
            const { partialState } = extractStateByKeys(sharedState, sharedStateKeys);
            partialSharedState = partialState;
          }

          const refState = this.state;
          const entireState = Object.assign({}, refState, refStoredState, partialSharedState);
          this.state = entireState;

          const thisCc = this.cc;
          const computedSpec = thisCc.computedSpec;
          if (computedSpec) {
            const refComputed = thisCc.refComputed, refConnectedComputed = thisCc.refConnectedComputed;
            computeValueForRef(currentModule, computedSpec, refComputed, refConnectedComputed, entireState, entireState);
            okeys(connect).forEach(m => {
              const mState = getState(m);
              computeValueForRef(m, computedSpec, refComputed, refConnectedComputed, mState, mState);
            });
          }
        }

        //!!! 存在多重装饰器时, 或者用户想使用this.props.***来用concent类时
        //!!! 必需在类的【constructor】 里调用 this.props.$$attach(this),紧接着state定义之后
        $$attach(childRef) {
          const attachMethods = [
            '$$domDispatch', '$$dispatch', '$$dispatchIdentity', '$$d', '$$di',
            '$$on', '$$onIdentity', '$$emit', '$$emitIdentity', '$$emitWith', '$$off', '$$set',
            '$$sync', '$$toggleBool', '$$syncInt', '$$invoke', '$$xinvoke', '$$effect', '$$xeffect',
            '$$forceSyncState', 'setState', 'setGlobalState', 'forceUpdate',
          ];
          attachMethods.forEach(m => {
            childRef[m] = this[m].bind(this);
          });

          //这些负责搜集结果的key，单独绑定
          childRef.$$refComputed = this.cc.refComputed;
          childRef.$$refConnectedComputed = this.cc.refConnectedComputed;
          childRef.$$connectedComputed = this.cc.connectedComputed;
          childRef.$$moduleComputed = this.cc.moduleComputed;
          childRef.$$globalComputed = this.cc.globalComputed;
          childRef.$$connectedState = this.cc.connectedState ;
          childRef.$$globalState = this.cc.globalState;
          childRef.cc = this.cc ;

          const bindChildRefCcApi = (cRef, method, ccMethod) => {
            if (cRef[method]) {
              childRef[method] = childRef[method].bind(childRef);
              this.cc[ccMethod] = childRef[method];
              if (method === '$$watch') this.cc.watchSpec = getWatchSpec(this.cc.$$watch);
              else if (method === '$$computed') this.cc.computedSpec = getComputedSpec(this.cc.$$computed);
            }
          }

          //这些方法绑定的this指向childRef
          bindChildRefCcApi(childRef, '$$watch', 'watch');
          bindChildRefCcApi(childRef, '$$computed', 'computed');
          bindChildRefCcApi(childRef, '$$onUrlChanged', 'onUrlChanged');

          if (childRef.$$cache) {
            childRef.$$cache = childRef.$$cache.bind(childRef);
            this.cc.cache = childRef.$$cache;
            childRef.$$refCache = childRef.$$cache();
          } else {
            childRef.$$refCache = {};
          }
          const childRefState = childRef.state;
          const newState = Object.assign({}, childRefState, this.state);
          this.state = newState;

          //避免提示 Warning: Expected {Component} state to match memoized state before componentDidMount
          // childRef.state = newState;//在childRef进入首次render流程前，提前赋值

          okeys(newState).forEach(key=> childRefState[key]=newState[key]);

          this.cc.childRef = childRef;
        }

        componentDidMount() {
          if(super.componentDidMount)super.componentDidMount();
          if (isPropsProxy === true) {
            if (!this.cc.childRef) {
              throw new Error('you forgot to call this.props.$$attach(this) constructor, and you must call it after super() next line!');
            } else {
              //执行到父组件的componentDidMount，可以等同于认为孩子mounted了
              this.cc.isChildRefMounted = true;
            }
          }
        }

        __$$mapCcToInstance(
          isSingle, asyncLifecycleHook, ccClassKey, originalCcKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys,
          ccOption, ccClassContext, currentModule, currentReducerModule, sharedStateKeys, connect
        ) {
          const reactSetStateRef = this.setState.bind(this);
          const reactForceUpdateRef = this.forceUpdate.bind(this);
          const isControlledByConcent = sharedStateKeys.length > 0 || util.isObjectNotNull(connect);
          const ccState = {
            renderCount: 1, isSingle, asyncLifecycleHook, ccClassKey, ccKey, originalCcKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys,
            ccOption, ccClassContext, module: currentModule, reducerModule: currentReducerModule, sharedStateKeys, initTime: Date.now(),
            connect, isControlledByConcent
          };
          const refConnectedComputed = {};
          okeys(connect).forEach(moduleName => {
            refConnectedComputed[moduleName] = {};
          });

          const { duplicate, notArray, keyElementNotString } = verifyKeys(sharedStateKeys, storedStateKeys);
          if (notArray) {
            throw me(ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY, vbi(`ccClassKey:${ccClassKey} ccKey:${ccKey}`));
          }
          if (keyElementNotString) {
            throw me(ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT, vbi(`ccClassKey:${ccClassKey} ccKey:${ccKey}`));
          }
          if (duplicate) {
            throw me(ERR.CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS, vbi(`ccClassKey:${ccClassKey} ccKey:${ccKey} sharedStateKeys:${sharedStateKeys} storedStateKeys:${storedStateKeys}`));
          }
          if (storedStateKeys.length > 0 && isCcUniqueKeyAutoGenerated) {
            throw me(ERR.CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS, vbi(`ccClassKey:${ccClassKey}`));
          }

          const connectedState = ccClassContext.connectedState || {};
          const globalState = getState(MODULE_GLOBAL);

          this.cc = {
            isChildRefMounted:false,
            onUrlChanged: null,
            watch: null,
            watchSpec: null,
            computed: null,
            computedSpec: null,
            refComputed: {},
            refConnectedComputed,//定义在类里的带模块名字的computedKey计算计算结果收集对象
            connectedComputed: {},
            globalComputed: {},
            moduleComputed: {},
            connectedState,
            globalState,
            execute: null,
            ccState,
            ccClassKey,
            originalCcKey,
            ccKey,
            ccUniqueKey,
            beforeSetState: this.$$beforeSetState,
            beforeBroadcastState: this.$$beforeBroadcastState,
            afterSetState: this.$$afterSetState,
            reactSetState: (state, cb) => {
              ccState.renderCount += 1;
              //采用此种写法的话，dispatch.ctx不能暴露state了，只能暴露getState句柄，才能保证取到最新的state
              // this.state = Object.assign(this.state, state);

              //采用okeys写法，让dispatch.ctx里的state总是指向同一个引用
              okeys(state).forEach(k => this.state[k] = state[k]);
              reactSetStateRef(state, cb);
            },
            reactForceUpdate: (cb) => {
              ccState.renderCount += 1;
              reactForceUpdateRef(cb);
            },
            setState: (state, cb, delay = -1, identity) => {
              this.$$changeState(state, { ccKey, identity, module: currentModule, stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, cb, calledBy: SET_STATE, delay });
            },
            forceSyncState: (state, cb, delay = -1, identity) => {
              this.$$changeState(state, { forceSync: true, identity, ccKey, module: currentModule, stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, cb, calledBy: SET_STATE, delay });
            },
            setGlobalState: (partialGlobalState, delay = -1, identity) => {
              this.$$changeState(partialGlobalState, { ccKey, module: MODULE_GLOBAL, calledBy: SET_GLOBAL_STATE, delay, identity });
            },
            forceUpdate: (cb, delay, identity) => {
              this.$$changeState(this.state, { ccKey, identity, stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module: currentModule, cb, calledBy: FORCE_UPDATE, delay });
            },

            // change other module's state, the difference between effect and xeffect is:
            // xeffect will take your logicFn param list's first place to put ExecutionContext
            __effect: (targetModule, userLogicFn, option, ...args) => {
              const { ccKey, ccUniqueKey, identity, delay = -1, context, methodName } = option;
              return this.cc.__promisifiedInvokeWith(userLogicFn, {
                ccKey, ccUniqueKey, stateFor: getStateFor(targetModule, currentModule), context, module: targetModule,
                calledBy: methodName, fnName: userLogicFn.name, delay, identity
              }, ...args);
            },
            __invoke: (userLogicFn, option, ...args) => {
              const { ccKey, ccUniqueKey, context = false, forceSync = false, delay, identity, methodName } = option;
              return this.cc.__promisifiedInvokeWith(userLogicFn, {
                ccKey, ccUniqueKey, stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, context, module: currentModule,
                calledBy: methodName, fnName: userLogicFn.name, delay, identity, forceSync,
              }, ...args);
            },

            __promisifiedInvokeWith: (userLogicFn, executionContext, ...args) => {
              return _promisifyCcFn(this.cc.__invokeWith, userLogicFn, executionContext, ...args);
            },
            __invokeWith: (userLogicFn, executionContext, ...args) => {
              //ccKey ccClassKey 表示调用源头组件的ccKey和ccClassKey
              const {
                ccKey, ccUniqueKey, ccClassKey, stateFor, module: targetModule = currentModule, context = false, forceSync = false,
                cb, __innerCb, type, reducerModule, calledBy, fnName, delay = -1, identity,
                refState, chainId, chainDepth, oriChainId
                // sourceModule
              } = executionContext;
              isStateModuleValid(targetModule, currentModule, cb, (err, newCb) => {
                if (err) return handleCcFnError(err, __innerCb);
                const moduleState = getState(targetModule);
                if (context) {
                  const nextChainDepth = chainDepth + 1;

                  //暂时不考虑在ctx提供lazyDispatch功能
                  const dispatch = this.__$$getDispatchHandler(
                    refState, false, ccKey, ccUniqueKey, ccClassKey, STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, targetModule, reducerModule,
                    null, null, delay, identity, chainId, nextChainDepth, oriChainId
                  );
                  const dispatchIdentity = this.__$$getDispatchHandler(
                    refState, false, ccKey, ccUniqueKey, ccClassKey, STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, targetModule, reducerModule,
                    null, null, delay, identity, chainId, nextChainDepth, oriChainId
                  );

                  const sourceClassContext = ccClassKey_ccClassContext_[ccClassKey];
                  //不能将state赋给executionContextForUser，给一个getState才能保证dispatch函数的state是最新的
                  //目前先保留state
                  const _refState = refState || this.state;//优先取透传的，再取自己的，因为有可能是Dispatcher调用
                  const executionContextForUser = Object.assign(
                    executionContext, {
                      effect: this.__$$getEffectHandler(ccKey, ccUniqueKey), xeffect: this.__$$getXEffectHandler(ccKey, ccUniqueKey),
                      invoke: this.__$$getInvokeHandler(ccKey, ccUniqueKey), xinvoke: this.__$$getXInvokeHandler(ccKey, ccUniqueKey),
                      rootState: getState(),
                      globalState: getState(MODULE_GLOBAL),
                      //指的是目标模块的state
                      moduleState,
                      //指的是目标模块的的moduleComputed
                      moduleComputed: _computedValue[targetModule],

                      //!!!指的是调用源cc类的connectedState
                      connectedState: sourceClassContext.connectedState,
                      //!!!指的是调用源cc类的connectedComputed
                      connectedComputed: sourceClassContext.connectedComputed,
                      //!!!指的是调用源cc类实例的state
                      refState: _refState,
                      dispatch, dispatchIdentity, d: dispatch, di: dispatchIdentity,
                    });
                  args.unshift(executionContextForUser);
                }

                send(SIG_FN_START, { module: targetModule, chainId, fn: userLogicFn });
                if (calledBy === DISPATCH) {
                  if (ccContext.isReducerArgsOldMode === false) args.unshift(executionContext.payload, moduleState);
                }

                co.wrap(userLogicFn)(...args).then(partialState => {
                  let commitStateList = [];
                  send(SIG_FN_END, { module: targetModule, chainId });

                  // targetModule, sourceModule相等与否不用判断了，chainState里按模块为key去记录提交到不同模块的state
                  if (isChainIdLazy(chainId)) {//来自于惰性派发的调用
                    if (chainDepth > 1) {//暂存状态，最后才提交
                      setChainState(chainId, targetModule, partialState);
                    } else {// chainDepth === 1, 合并状态一次性提交到store并派发到组件实例
                      if (isChainExited(chainId)) {
                        //丢弃本次状态，不做任何处理
                      } else {
                        commitStateList = setAndGetChainStateList(chainId, targetModule, partialState);
                        removeChainState(chainId);
                      }
                    }
                  } else {
                    commitStateList = [{ module: targetModule, state: partialState }];
                  }

                  commitStateList.forEach(v => {
                    this.$$changeState(v.state, {
                      identity, ccKey, ccUniqueKey, stateFor, module: v.module, forceSync, cb: newCb, type,
                      reducerModule, calledBy, fnName, delay
                    });
                  });

                  if (__innerCb) __innerCb(null, partialState);
                }).catch(err => {
                  send(SIG_FN_ERR, { module: targetModule, chainId });
                  handleCcFnError(err, __innerCb);
                });
              });
            },

            dispatch: ({
              refState, ccKey, ccUniqueKey, ccClassKey, stateFor, module: inputModule, reducerModule: inputReducerModule, identity,
              forceSync = false, type, payload, cb: reactCallback, __innerCb, delay = -1, chainId, chainDepth, oriChainId } = {}
            ) => {
              //if module not defined, targetStateModule will be currentModule
              const targetStateModule = inputModule || currentModule;

              //if reducerModule not defined, cc will treat targetReducerModule as targetStateModule
              const targetReducerModule = inputReducerModule || targetStateModule;

              const targetReducerMap = _reducer[targetReducerModule];
              if (!targetReducerMap) {
                return __innerCb(new Error(`no reducerMap found for reducer module:${targetReducerModule}`));
              }
              const reducerFn = targetReducerMap[type];
              if (!reducerFn) {
                const fns = Object.keys(targetReducerMap);
                return __innerCb(new Error(`no reducer defined in ccContext for reducer module:${targetReducerModule} type:${type}, maybe you want to invoke one of them:${fns}`));
              }
              // const errMsg = util.isCcActionValid({ type, payload });
              // if (errMsg) return justWarning(errMsg);

              isStateModuleValid(targetStateModule, currentModule, reactCallback, (err, newCb) => {
                if (err) return __innerCb(err);
                const executionContext = {
                  ccKey, ccClassKey, stateFor, ccUniqueKey, ccOption, module: targetStateModule, reducerModule: targetReducerModule, type,
                  payload, forceSync, cb: newCb, context: true, __innerCb, calledBy: DISPATCH, delay, identity,
                  refState, chainId, chainDepth, oriChainId
                };
                this.cc.__invokeWith(reducerFn, executionContext);
              });
            },
            prepareReactSetState: (identity, calledBy, state, stateFor, next, reactCallback) => {
              // 通过规范来约束用户，只要是可能变化的数据，都不要在$$cache里存
              // 要不然$$cache就没意义了
              // if(this.$$cache){
              //   this.$$refCache = this.$$cache();
              // }
              if (stateFor !== STATE_FOR_ONE_CC_INSTANCE_FIRSTLY) {
                if (next) next();
                return;
              }
              if (identity) {//if user specify identity
                if (this.cc.ccKey !== identity) {// current instance would have been rendered only if current instance's ccKey equal identity
                  if (next) next();
                  return;
                }
              }

              if (storedStateKeys.length > 0) {
                const { partialState, isStateEmpty } = extractStateByKeys(state, storedStateKeys);
                if (!isStateEmpty) {
                  if (ccOption.storeInLocalStorage === true) {
                    const { partialState: entireStoredState } = extractStateByKeys(this.state, storedStateKeys);
                    const currentStoredState = Object.assign({}, entireStoredState, partialState);
                    localStorage.setItem('CCSS_' + ccUniqueKey, JSON.stringify(currentStoredState));
                  }
                  refStore.setState(ccUniqueKey, partialState);
                }
              }

              //确保forceUpdate能够刷新cc实例，因为state可能是{}，此时用户调用forceUpdate也要触发render
              if (calledBy !== FORCE_UPDATE && !util.isObjectNotNull(state)) {
                if (next) next();
                return;
              }
              const thisState = this.state;
              const thisCc = this.cc;
              const { module: stateModule, connect } = thisCc.ccState;
              computeValueForRef(stateModule, thisCc.computedSpec, thisCc.refComputed, thisCc.refConnectedComputed, thisState, state);
              const shouldCurrentRefUpdate = watchKeyForRef(stateModule, thisCc.watchSpec, connect, thisState, state);

              if (shouldCurrentRefUpdate === false) {
                if (next) next();
              }

              if (this.$$beforeSetState) {
                if (asyncLifecycleHook) {
                  this.$$beforeSetState({ state });
                  this.cc.reactSetState(state, reactCallback);
                  if (next) next();
                } else {
                  // if user don't call next in ccIns's $$beforeSetState,reactSetState will never been invoked
                  // $$beforeSetState(context, next){}
                  this.$$beforeSetState({ state }, () => {
                    this.cc.reactSetState(state, reactCallback);
                    if (next) next();
                  });
                }
              } else {
                this.cc.reactSetState(state, reactCallback);
                if (next) next();
              }
            },
            syncCommittedStateToStore: (stateFor, moduleName, committedState)=>{
              const isDispatcher = this.cc.ccClassKey === CC_DISPATCHER;
              const targetSharedStateKeys = getSuitableSharedStateKeys(sharedStrategy, isDispatcher, stateFor, moduleName, sharedStateKeys);

              let skipBroadcastRefState = false;
              if (stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY) {
                if (targetSharedStateKeys.length === 0) {
                  skipBroadcastRefState = true;
                }
              }

              const { isStateEmpty: isPartialSharedStateEmpty, partialState: partialSharedState } = extractStateByKeys(committedState, targetSharedStateKeys);

              //!!! save state to store
              if (!isPartialSharedStateEmpty) ccStoreSetState(moduleName, partialSharedState);

              return { partialSharedState, skipBroadcastRefState };
            },
            prepareBroadcastState: (skipMiddleware, passToMiddleware, broadcastInfo, stateFor, moduleName, committedState, needClone, delay, identity) => {
              const { skipBroadcastRefState, partialSharedState } = broadcastInfo;
              const startBroadcastState = () => {
                if (this.$$beforeBroadcastState) {//check if user define a life cycle hook $$beforeBroadcastState
                  if (asyncLifecycleHook) {
                    this.$$beforeBroadcastState({ }, () => {
                      this.cc.broadcastState(skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, needClone, identity);
                    });
                  } else {
                    this.$$beforeBroadcastState({ });
                    this.cc.broadcastState(skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, needClone, identity);
                  }
                } else {
                  this.cc.broadcastState(skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, needClone, identity);
                }
              };

              const willBroadcast = ()=>{
                if (delay > 0) {
                  const feature = util.computeFeature(ccUniqueKey, committedState);
                  runLater(startBroadcastState, feature, delay);
                } else {
                  startBroadcastState();
                }
              }

              if (skipMiddleware) {
                willBroadcast();
                return;
              }

              const middlewaresLen = middlewares.length;
              if (middlewaresLen > 0) {
                passToMiddleware.sharedState = partialSharedState; //这个记录到store的状态也传给中间件ctx
                let index = 0;
                const next = () => {
                  if (index === middlewaresLen) {// all middlewares been executed
                    willBroadcast();
                  } else {
                    const middlewareFn = middlewares[index];
                    index++;
                    middlewareFn(passToMiddleware, next);
                  }
                }
                next();
              } else {
                willBroadcast();
              }
            },
            broadcastState: (skipBroadcastRefState, originalState, stateFor, moduleName, partialSharedState, needClone, identity) => {
              if (skipBroadcastRefState === false) {
                let _partialSharedState = partialSharedState;
                if (needClone) _partialSharedState = util.clone(partialSharedState);// this clone operation may cause performance issue, if partialSharedState is too big!!

                const { ccUniqueKey: currentCcKey } = this.cc.ccState;

                // if stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, it means currentCcInstance has triggered reactSetState
                // so flag ignoreCurrentCcKey as true;
                const ignoreCurrentCcKey = stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY;

                const ccClassKeys = moduleName_ccClassKeys_[moduleName];
                if (ccClassKeys) {
                  //  these ccClass are watching the same module's state
                  ccClassKeys.forEach(ccClassKey => {
                    const classContext = ccClassKey_ccClassContext_[ccClassKey];
                    const { ccKeys, sharedStateKeys } = classContext;
                    if (ccKeys.length === 0) return;
                    if (sharedStateKeys.length === 0) return;

                    //  extract _partialSharedState again! because different class with a same module may have different sharedStateKeys!!!
                    const {
                      partialState: sharedStateForCurrentCcClass, isStateEmpty: isSharedStateEmpty
                    } = extractStateByKeys(_partialSharedState, sharedStateKeys, true);
                    if (isSharedStateEmpty) return;

                    ccKeys.forEach(ccKey => {
                      if (ccKey === currentCcKey && ignoreCurrentCcKey) return;

                      const ref = ccKey_ref_[ccKey];
                      if (ref) {
                        const option = ccKey_option_[ccKey];
                        if (option.syncSharedState) {
                          if (ccContext.isDebug) {
                            console.log(ss(`received state for ref ${ccKey} is broadcasted from same module's other ref ${currentCcKey}`), cl());
                          }
                          ref.cc.prepareReactSetState(identity, 'broadcastState', sharedStateForCurrentCcClass, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY)
                        };
                      }
                    });

                  });
                }
              }

              broadcastConnectedState(moduleName, originalState);
            },
            emit: (event, ...args) => {
              ev.findEventHandlersToPerform(event, { identity: null }, ...args);
            },
            emitIdentity: (event, identity, ...args) => {
              ev.findEventHandlersToPerform(event, { identity }, ...args);
            },
            emitWith: (event, option, ...args) => {
              ev.findEventHandlersToPerform(event, option, ...args);
            },
            on: (event, handler) => {
              ev.bindEventHandlerToCcContext(currentModule, ccClassKey, ccUniqueKey, event, null, handler)
            },
            onIdentity: (event, identity, handler) => {
              ev.bindEventHandlerToCcContext(currentModule, ccClassKey, ccUniqueKey, event, identity, handler)
            },
            off: (event, { module, ccClassKey, identity } = {}) => {
              //  consider if module === currentModule, let off happened?
              ev.findEventHandlersToOff(event, { module, ccClassKey, identity })
            },
          }

          const thisCC = this.cc;
          // when call $$dispatch in a ccInstance, state extraction strategy will be STATE_FOR_ONE_CC_INSTANCE_FIRSTLY
          const d = this.__$$getDispatchHandler(null, false, ccKey, ccUniqueKey, ccClassKey, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, currentModule, null, null, null, -1);
          const di = this.__$$getDispatchHandler(null, false, ccKey, ccUniqueKey, ccClassKey, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, currentModule, null, null, null, -1, ccKey);//ccKey is identity by default
          this.$$lazyDispatch = this.__$$getDispatchHandler(null, true, ccKey, ccUniqueKey, ccClassKey, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, currentModule, null, null, null, -1);
          this.$$d = d;
          this.$$di = di;
          this.$$dispatch = d;
          this.$$dispatchIdentity = di;
          this.$$dispatchForModule = this.__$$getDispatchHandler(null, false, ccKey, ccUniqueKey, ccClassKey, STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, currentModule, null, null, null, -1);
          this.$$lazyDispatchForModule = this.__$$getDispatchHandler(null, true, ccKey, ccUniqueKey, ccClassKey, STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, currentModule, null, null, null, -1);

          this.$$invoke = this.__$$getInvokeHandler(ccKey, ccUniqueKey);
          this.$$xinvoke = this.__$$getXInvokeHandler(ccKey, ccUniqueKey);
          this.$$effect = this.__$$getEffectHandler(ccKey, ccUniqueKey);
          this.$$xeffect = this.__$$getXEffectHandler(ccKey, ccUniqueKey);

          this.$$emit = thisCC.emit;
          this.$$emitIdentity = thisCC.emitIdentity;
          this.$$emitWith = thisCC.emitWith;
          this.$$on = thisCC.on;
          this.$$onIdentity = thisCC.onIdentity;
          this.$$off = thisCC.off;

          this.$$moduleComputed = thisCC.moduleComputed = _computedValue[currentModule] || {};
          this.$$globalComputed = thisCC.globalComputed = _computedValue[MODULE_GLOBAL] || {};
          this.$$connectedComputed = thisCC.connectedComputed = ccClassContext.connectedComputed;

          this.$$forceSyncState = thisCC.forceSyncState;// add$$ prefix, to let user it is cc api
          this.setState = thisCC.setState;//let setState call cc.setState
          this.setGlobalState = thisCC.setGlobalState;//let setState call cc.setState
          this.forceUpdate = thisCC.forceUpdate;//let forceUpdate call cc.forceUpdate
        }

        // this method is useful only if you want to change other ccInstance's sate one time in a ccInstance which its syncSharedState is false, 
        // so make sure you know what you want, and you don't need call this method most of the time,
        // -------------------------------------------------------------------------------------------------------------------------
        // note!!! changeState do two thing, decide if it will change self's state or not, if it will broadcast state or not;
        // when ccIns's module != target module,
        //        cc will only broadcast the state to target module, and be careful: it will overwrite the target module's state!!
        // when ccIns's module == target module,
        //        if ccIns option.syncSharedState is false, cc only change it's own state, no broadcast operation happen.
        //           but if you pass forceSync=true, cc will also broadcast the state to target module, 
        //           and be careful: cc will clone this piece of state before broadcasting, so it will overwrite the target module's state !!!
        //        if ccIns option.syncSharedState is true, change it's own state and broadcast the state to target module
        $$changeState(state, {
          ccKey, ccUniqueKey, stateFor = STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module, skipMiddleware = false,
          forceSync, cb: reactCallback, type, reducerModule, calledBy, fnName, delay = -1, identity } = {}
        ) {//executionContext
          if (state == undefined) return;//do nothing
          // const isControlledByConcent = this.cc.ccState.isControlledByConcent;

          if (!isPlainJsonObject(state)) {
            justWarning(`cc found your commit state is not a plain json object!`);
            return;
          }

          const ccState = this.cc.ccState;
          const currentModule = ccState.module;

          let passToMiddleware = {};
          if (skipMiddleware !== true) {
            passToMiddleware = { calledBy, type, ccKey, ccUniqueKey, state, stateFor, module, reducerModule, forceSync, fnName };
          }

          if (module === currentModule) {
            const allowBroadcast = ccState.ccOption.syncSharedState || forceSync;
            let broadcastInfo = null;
            if (allowBroadcast) {
              //在prepareReactSetState之前把状态存储到store，
              //防止属于同一个模块的父组件套子组件渲染时，父组件修改了state，子组件初次挂载是不能第一时间拿到state
              //也防止prepareReactSetState里有异步的钩子函数，导致state同步到store有延迟而出现其他bug
              broadcastInfo = this.cc.syncCommittedStateToStore(stateFor, module, state);
            }

            // who trigger $$changeState, who will change the whole received state 
            this.cc.prepareReactSetState(identity, calledBy, state, stateFor, () => {
              if (allowBroadcast) {
                const needClone = forceSync === true; //if forceSync=true, cc clone the input state
                this.cc.prepareBroadcastState(skipMiddleware, passToMiddleware, broadcastInfo, stateFor, module, state, needClone, delay, identity);
              }
            }, reactCallback);
          } else {
            if (forceSync) justWarning(`you are trying change another module's state, forceSync=true in not allowed, cc will ignore it!` + vbi(`module:${module} currentModule${currentModule}`));
            if (reactCallback) justWarning(`callback for react.setState will be ignore`);

            const broadcastInfo = this.cc.syncCommittedStateToStore(stateFor, module, state);
            //触发修改状态的实例所属模块和目标模块不一致的时候，这里的stateFor必须是OF_ONE_MODULE
            this.cc.prepareBroadcastState(skipMiddleware, passToMiddleware, broadcastInfo, STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, module, state, true, delay, identity);
          }
        }
        //executionContext: { module:string, forceSync:boolean, cb }
        __$$getChangeStateHandler(executionContext) {
          return (state) => this.$$changeState(state, executionContext)
        }

        __$$getInvokeHandler(ccKey, ccUniqueKey) {
          return this.__$$makeInvokeHandler(ccKey, ccUniqueKey, false, 'invoke');
        }
        __$$getXInvokeHandler(ccKey, ccUniqueKey) {
          return this.__$$makeInvokeHandler(ccKey, ccUniqueKey, true, 'xinvoke');
        }
        __$$makeInvokeHandler(ccKey, ccUniqueKey, giveContextToUserLoginFn = false, methodName) {
          return (firstParam, ...args) => {
            const firstParamType = typeof firstParam;
            const err = new Error(`param type error, correct usage: ${methodName}(userFn:function, ...args:any[]) or ${methodName}(option:{fn:function, delay:number, identity:string}, ...args:any[])`);
            if (firstParamType === 'function') {
              return this.cc.__invoke(firstParam, { context: giveContextToUserLoginFn, methodName, ccKey, ccUniqueKey }, ...args);
            } else if (firstParamType === 'object') {
              //firstParam: {fn:function, delay:number, identity:string}

              // const { fn, ...option } = firstParam;//防止某些版本的create-react-app运行瓷出错，这里不采用对象延展符的写法
              const fn = firstParam.fn;
              delete firstParam.fn;
              const option = firstParam;
              if (typeof fn != 'function') {
                throw err;
              }
              option.context = giveContextToUserLoginFn;
              option.methodName = methodName;
              option.ccKey = ccKey;
              option.ccUniqueKey = ccUniqueKey;
              return this.cc.__invoke(fn, option, ...args)
            } else {
              throw err;
            }
            // return ()=>{}
          }
        }
        __$$getEffectHandler(ccKey, ccUniqueKey) {
          return this.__$$makeEffectHandler(ccKey, ccUniqueKey, false, 'effect');
        }
        __$$getXEffectHandler(ccKey, ccUniqueKey) {
          return this.__$$makeEffectHandler(ccKey, ccUniqueKey, true, 'xeffect');
        }
        __$$makeEffectHandler(ccKey, ccUniqueKey, giveContextToUserLoginFn = false, methodName) {
          return (firstParam, userLogicFn, ...args) => {
            const firstParamType = typeof firstParam;
            if (firstParamType === 'string') {
              return this.cc.__effect(firstParam, userLogicFn, { context: giveContextToUserLoginFn, ccKey, ccUniqueKey, methodName }, ...args)
            } else if (firstParamType === 'object') {
              const { module, delay = -1, identity } = firstParam;
              const option = { module, delay, identity, context: giveContextToUserLoginFn, methodName, ccKey, ccUniqueKey }
              return this.cc.__effect(module, userLogicFn, option, ...args)
            } else {
              throw new Error(`param type error, correct usage: ${methodName}(module:string, ...args:any[]) or ${methodName}(option:{module:string, delay:number, identity:string}, ...args:any[])`);
            }
          }
        }
        __$$getDispatchHandler(
          refState, isLazy, ccKey, ccUniqueKey, ccClassKey, stateFor, targetModule, targetReducerModule, inputType, inputPayload,
          delay = -1, defaultIdentity = '', chainId, chainDepth, oriChainId
          // sourceModule, oriChainId, oriChainDepth
        ) {
          return (paramObj = {}, payloadWhenFirstParamIsString, userInputDelay, userInputIdentity) => {

            let _chainId, _chainDepth, _oriChainId;
            // let  _oriChainId, _oriChainDepth;
            //忽略掉传递进来的chainId，chainDepth，重新生成它们，源头调用了lazyDispatch或者ctx里调用了lazyDispatch，就会触发此逻辑
            if (isLazy === true) {
              _chainId = getChainId();
              _chainDepth = 1;
              setChainIdLazy(_chainId);
            } else {
              _chainId = chainId || getChainId();
              _chainDepth = chainDepth || 1;
            }
  
            //因为$$dispatch是不传递oriChainId 和 oriChainDepth的，所以这里可以安全赋值为上面的_chainId 和 _chainDepth
            //而ctx.dispatch是一直要传递oriChainId 和 oriChainDepth的，这样就可以精确知道调用链的最初id了
            //注意，对于源头来说，chainId oriChainId是一样的，chainDepth和oriChainDepth 也是一样的，
            // 所以后面分发状态前始终用chainId来收集状态, 用chainDepth===1来判断一次性提交状态，是ok的
            _oriChainId = oriChainId || _chainId;
            // _oriChainDepth = oriChainDepth || _chainDepth;

            const paramObjType = typeof paramObj;
            let _module = targetModule, _reducerModule, _forceSync = false, _type, _payload = inputPayload, _cb, _delay = delay;
            let _identity = defaultIdentity;
            if (paramObjType === 'object') {
              const { module = targetModule, reducerModule, forceSync = false,
                type = inputType, payload = inputPayload, cb, delay = -1, identity
              } = paramObj;
              _module = module;
              _reducerModule = reducerModule || module;
              _forceSync = forceSync;
              _type = type;
              _payload = payload;
              _cb = cb;
              _delay = delay;

              if (identity) _identity = identity;

            } else if (paramObjType === 'string' || paramObjType === 'function') {
              let targetFirstParam = paramObj;
              if(paramObjType === 'function'){
                const fnName = paramObj.__fnName;
                if(!fnName)throw new Error('you are calling a unnamed function!!!');
                targetFirstParam = fnName;
                // _module = paramObjType.stateModule || module;
              }

              const slashCount = targetFirstParam.split('').filter(v => v === '/').length;
              _payload = payloadWhenFirstParamIsString;
              if (userInputIdentity) _identity = userInputIdentity;
              if (userInputDelay !== undefined) _delay = userInputDelay;

              if (slashCount === 0) {
                _type = targetFirstParam;
              } else if (slashCount === 1) {
                const [module, type] = targetFirstParam.split('/');
                _module = module;
                _reducerModule = _module;
                _type = type;
              } else if (slashCount === 2) {
                const [module, reducerModule, type] = targetFirstParam.split('/');
                if (module === '' || module === ' ') _module = targetModule;//targetFirstParam may like: /foo/changeName
                else _module = module;
                _module = module;
                _reducerModule = reducerModule;
                _type = type;
              } else {
                return Promise.reject(me(ERR.CC_DISPATCH_STRING_INVALID, vbi(targetFirstParam)));
              }
            } else {
              return Promise.reject(me(ERR.CC_DISPATCH_PARAM_INVALID));
            }

            if (_module === '*') {
              return Promise.reject('cc instance api dispatch do not support multi dispatch, please use top api[cc.dispatch] instead!');
            }

            // pick user input reducerModule firstly
            let nowReducerModule = _reducerModule || (targetReducerModule || module);
            const p = new Promise((resolve, reject) => {
              this.cc.dispatch({
                stateFor, module: _module, reducerModule: nowReducerModule, forceSync: _forceSync, type: _type, payload: _payload,
                cb: _cb, __innerCb: _promiseErrorHandler(resolve, reject),
                ccKey, ccUniqueKey, ccClassKey, delay: _delay, identity: _identity,
                refState, chainId: _chainId, chainDepth: _chainDepth, oriChainId: _oriChainId,
                // oriChainId: _oriChainId, oriChainDepth: _oriChainDepth, sourceModule: _sourceModule,
              });
            }).catch(catchCcError);
            return p;
          }
        }

        $$domDispatch(event) {
          const currentTarget = event.currentTarget;
          const { value, dataset } = currentTarget;
          const { cct: type, ccm: module, ccrm: reducerModule, ccdelay = -1, ccidt = '' } = dataset;
          const payload = { event, dataset, value };
          const { ccKey, ccUniqueKey } = this.cc;
          const handler = this.__$$getDispatchHandler(null, false, ccKey, ccUniqueKey, ccClassKey, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module, reducerModule, type, payload, ccdelay, ccidt);
          handler().catch(handleCcFnError);
        }

        $$toggleBool(e, delay = -1, idt = '') {
          if (typeof e === 'string') return this.__$$sync.bind(this, { [CCSYNC_KEY]: e, type: 'bool', delay, idt });
          this.__$$sync({ type: 'bool' }, e);
        }
        $$syncInt(e, delay = -1, idt = '') {
          if (typeof e === 'string') return this.__$$sync.bind(this, { [CCSYNC_KEY]: e, type: 'int', delay, idt });
          this.__$$sync({ type: 'int' }, e);
        }
        $$set(ccsync, val, delay, idt) {
          this.__$$sync({ [CCSYNC_KEY]: ccsync, type: 'val', val, delay, idt });
        }
        // when CCSYNC_KEY:   stateFor=ccint, seat1=ccdelay, seat2=ccidt, seat3=stateFor
        $$sync(e, val, delay, idt) {
          if (typeof e === 'string') {
            return this.__$$sync.bind(this, { [CCSYNC_KEY]: e, type: 'val', val, delay, idt });
          } else if (e && e[MOCKE_KEY]) {
            return this.__$$sync(e);
          }
          this.__$$sync({ type: 'val' }, e);// for <input data-ccsync="foo/f1" onChange={this.$$sync} />
        }
        __$$sync(spec, e) {
          let mockE = null;
          if (spec[MOCKE_KEY]) {
            mockE = spec;
          } else if (spec[CCSYNC_KEY] !== undefined) {//来自$$sync生成的setter调用
            mockE = buildMockEvent(spec, e);
          } else {
            mockE = convertToStandardEvent(e);
          }
          if (!mockE) return;//参数无效
          if (e && e.stopPropagation) e.stopPropagation();

          const currentTarget = mockE.currentTarget;
          const dataset = currentTarget.dataset;
          const { ccsync, ccint, ccdelay, ccidt } = dataset;
          const value = currentTarget.value;

          let currentModule = this.cc.ccState.module;
          let _module = currentModule;
          if (ccsync.includes('/')) {
            _module = ccsync.split('/')[0];
          }

          const fullState = _module !== currentModule ? getState(_module) : this.state;
          const { state } = extractStateByCcsync(ccsync, value, ccint, fullState, mockE.isToggleBool);

          let targetStateFor = mockE.stateFor;
          if (!targetStateFor) {
            targetStateFor = _module !== currentModule ? STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE : STATE_FOR_ONE_CC_INSTANCE_FIRSTLY;
          }
          this.$$changeState(state, { ccKey: this.cc.ccKey, stateFor: targetStateFor, module: _module, delay: ccdelay, identity: ccidt });
        }

        componentDidUpdate() {
          if (super.componentDidUpdate) super.componentDidUpdate()
          if (this.$$afterSetState) this.$$afterSetState();
        }

        componentWillUnmount() {
          const { ccUniqueKey, ccClassKey } = this.cc.ccState;
          ev.offEventHandlersByCcUniqueKey(ccUniqueKey);
          unsetRef(ccClassKey, ccUniqueKey);
          //if father component implement componentWillUnmount，call it again
          if (super.componentWillUnmount) super.componentWillUnmount();
        }

        render() {
          if (ccContext.isDebug) {
            console.log(ss(`@@@ render ${ccClassDisplayName(ccClassKey)}`), cl());
          }
          if (isPropsProxy === false) {
            //now cc class extends ReactClass, call super.render()
            return super.render();
          } else {
            const thisCc = this.cc;
            //只将$$attach传递下去，让用户在构造器里紧接着super之后调this.props.$$attach()
            // const props = Object.assign({}, this.props, { $$attach: this.$$attach });
            const props = Object.assign({}, this, { $$attach: this.$$attach });
            if (thisCc.isChildRefMounted) {
              const childRefState = thisCc.childRef.state;
              const thisState = this.state;
              okeys(this.state).forEach(key=>{
                childRefState[key] = thisState[key];
              });

              //不能采用直接赋值，这相当于隐式的替换了state，会造成更新失败
              // thisCc.childRef.state = this.state;
            }
            return React.createElement(ReactClass, props);
          }
        }
      }

      if (ccClassKey === CC_DISPATCHER) CcClass.displayName = 'CcDispatcher';
      else CcClass.displayName = ccClassDisplayName(ccClassKey);
      return CcClass;
    }
  } catch (err) {
    catchCcError(err);
  }
}
