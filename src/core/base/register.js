
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
const SET_MODULE_STATE = 'setModuleState';
const FORCE_UPDATE = 'forceUpdate';
const INVOKE = 'invoke';

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

function _promisifyCcFn(ccFn, userLogicFn, executionContext, payload) {
  return new Promise((resolve, reject) => {
    const _executionContext = Object.assign(executionContext, { __innerCb: _promiseErrorHandler(resolve, reject) });
    ccFn(userLogicFn, _executionContext, payload);
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

//忽略掉传递进来的chainId，chainDepth，重新生成它们，源头调用了lazyDispatch或者ctx里调用了lazyDispatch，就会触发此逻辑
function getNewChainData(isLazy, chainId, oriChainId, chainId_depth_) {
  let _chainId;
  if (isLazy === true) {
    _chainId = getChainId();
    setChainIdLazy(_chainId);
    chainId_depth_[_chainId] = 1;//置为1
  } else {
    _chainId = chainId || getChainId();
    if (!chainId_depth_[_chainId]) chainId_depth_[_chainId] = 1;
  }

  //源头函数会触发创建oriChainId， 之后就一直传递下去了
  const _oriChainId = oriChainId || _chainId;
  return { _chainId, _oriChainId }
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
              '__$$mapCcToInstance', '$$changeState', '__$$recoverState', '$$domDispatch',
              '$$sync', '$$syncBool', '$$syncInt', '$$set', '__$$sync', '$$setBool',
              '__$$getInvokeHandler', '__$$makeInvokeHandler',
              '__$$getChangeStateHandler', '__$$getDispatchHandler',
              '$$attach',
            ]);

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
              //区别于CcFragment, 对于class组件，不把this当作上下文传进去了
              this.cc.watchSpec = getWatchSpec(this.cc.watch, null, _curStateModule);
            }
            if (this.$$computed) {
              this.cc.computed = this.$$computed.bind(this);
              this.cc.computedSpec = getComputedSpec(this.cc.computed, null, _curStateModule);
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

            this.__$$recoverState(_curStateModule, sharedStateKeys, ccUniqueKey, connect);
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

        __$$recoverState(currentModule, sharedStateKeys, ccUniqueKey, connect) {
          let refStoredState = refStore._state[ccUniqueKey] || {};
          const sharedState = _state[currentModule];
          const { partialState:partialSharedState } = extractStateByKeys(sharedState, sharedStateKeys);
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
            '$$on', '$$onIdentity', '$$emit', '$$emitIdentity', '$$emitWith', '$$off', '$$set', '$$setBool',
            '$$sync', '$$syncBool', '$$syncInt', '$$invoke', '$$lazyInvoke',
            'setState', 'setGlobalState', 'setModuleState', 'forceUpdate',
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

          const thisCc = this.cc;
          const curModule = thisCc.ccState.module;
          childRef.cc = thisCc;
          const bindChildRefCcApi = (cRef, method, ccMethod) => {
            if (cRef[method]) {
              childRef[method] = childRef[method].bind(childRef);
              thisCc[ccMethod] = childRef[method];
              if (method === '$$watch') thisCc.watchSpec = getWatchSpec(thisCc.$$watch, null, curModule);
              else if (method === '$$computed') thisCc.computedSpec = getComputedSpec(thisCc.$$computed, null, curModule);
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
            setModuleState: (module, state, delay = -1, identity) => {
              const stateFor = getStateFor(module, _curStateModule);
              this.$$changeState(state, { ccKey, identity, module, stateFor, calledBy: SET_MODULE_STATE, delay });
            },
            setGlobalState: (partialGlobalState, delay = -1, identity) => {
              this.cc.setModuleState(MODULE_GLOBAL, partialGlobalState, delay, identity);
            },
            forceUpdate: (cb, delay, identity) => {
              this.$$changeState(this.state, { ccKey, identity, stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module: currentModule, cb, calledBy: FORCE_UPDATE, delay });
            },

            __invoke: (userLogicFn, option, payload) => {
              const { ccKey, ccUniqueKey, ccClassKey, delay, identity, calledBy, module, chainId, oriChainId, chainId_depth_ } = option;
              const stateFor = getStateFor(module, _curStateModule);
              return this.cc.__promisifiedInvokeWith(userLogicFn, {
                ccKey, ccUniqueKey, stateFor, context: true, module, ccClassKey,
                calledBy, fnName: userLogicFn.name, delay, identity, chainId, oriChainId, chainId_depth_,
              }, payload);
            },

            __promisifiedInvokeWith: (userLogicFn, executionContext, payload) => {
              return _promisifyCcFn(this.cc.__invokeWith, userLogicFn, executionContext, payload);
            },
            __invokeWith: (userLogicFn, executionContext, payload) => {
              //ccKey ccClassKey 表示调用源头组件的ccKey和ccClassKey
              const {
                ccKey, ccUniqueKey, ccClassKey, stateFor, module: targetModule = _curStateModule, context = false,
                cb, __innerCb, type, reducerModule, calledBy, fnName, delay = -1, identity,
                refState, chainId, oriChainId, chainId_depth_
                // sourceModule
              } = executionContext;
              isStateModuleValid(targetModule, _curStateModule, cb, (err, newCb) => {
                if (err) return handleCcFnError(err, __innerCb);
                const moduleState = getState(targetModule);

                let executionContextForUser = {};
                if (context) {
                  //调用前先加1
                  chainId_depth_[chainId] =  chainId_depth_[chainId] + 1;

                  //暂时不考虑在ctx提供lazyDispatch功能
                  const dispatch = this.__$$getDispatchHandler(
                    refState, false, ccKey, ccUniqueKey, ccClassKey, STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, targetModule, reducerModule,
                    null, null, -1, identity, chainId, oriChainId, chainId_depth_
                  );
                  const dispatchIdentity = this.__$$getDispatchHandler(
                    refState, false, ccKey, ccUniqueKey, ccClassKey, STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, targetModule, reducerModule,
                    null, null, -1, identity, chainId, oriChainId, chainId_depth_
                  );

                  const sourceClassContext = ccClassKey_ccClassContext_[ccClassKey];
                  //不能将state赋给executionContextForUser，给一个getState才能保证dispatch函数的state是最新的
                  //目前先保留state
                  const _refState = refState || this.state;//优先取透传的，再取自己的，因为有可能是Dispatcher调用
                  executionContextForUser = Object.assign(
                    executionContext, {
                      // 将targetModule一直携带下去，让链式调用里所以句柄隐含的指向最初调用方的module
                      invoke: this.__$$getInvokeHandler(targetModule, ccKey, ccUniqueKey, ccClassKey, { chainId, oriChainId, chainId_depth_ }),

                      //oriChainId, chainId_depth_ 一直携带下去，设置isLazy，会重新生成chainId
                      lazyInvoke: this.__$$getInvokeHandler(targetModule, ccKey, ccUniqueKey, ccClassKey, { isLazy:true, oriChainId, chainId_depth_ }),
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
                      //其他ref相关的属性，不再传递给上下文，concent不鼓励用户在reducer使用ref相关数据，因为不同调用方传递不同的ref值，会引起用户不注意的bug

                      dispatch, dispatchIdentity, d: dispatch, di: dispatchIdentity,
                    });
                }

                send(SIG_FN_START, { module: targetModule, chainId, fn: userLogicFn });
                co.wrap(userLogicFn)(payload, moduleState, executionContextForUser).then(partialState => {

                  chainId_depth_[chainId] =  chainId_depth_[chainId] - 1;//调用结束减1
                  const curDepth = chainId_depth_[chainId];

                  let commitStateList = [];
                  send(SIG_FN_END, { module: targetModule, chainId });
                  // if (chainId == oriChainId) {//是源头函数结束，发送函数结束的信号给插件
                  //   send(SIG_FN_END, { module: targetModule, chainId });
                  // }

                  // targetModule, sourceModule相等与否不用判断了，chainState里按模块为key去记录提交到不同模块的state
                  if (isChainIdLazy(chainId)) {//来自于惰性派发的调用
                    if (curDepth > 1) {//某条链还在往下调用中，没有回到第一层，暂存状态，直到回到第一层才提交
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
                      identity, ccKey, ccUniqueKey, stateFor, module: v.module, cb: newCb, type,
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
              type, payload, cb: reactCallback, __innerCb, delay = -1, chainId, oriChainId, chainId_depth_ } = {}
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
                  cb: newCb, context: true, __innerCb, calledBy: DISPATCH, delay, identity,
                  refState, chainId, oriChainId, chainId_depth_
                };
                this.cc.__invokeWith(reducerFn, executionContext, payload);
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
            prepareBroadcastState: (skipMiddleware, passToMiddleware, broadcastInfo, stateFor, moduleName, committedState, delay, identity) => {
              const { skipBroadcastRefState, partialSharedState } = broadcastInfo;
              const startBroadcastState = () => {
                if (this.$$beforeBroadcastState) {//check if user define a life cycle hook $$beforeBroadcastState
                  if (asyncLifecycleHook) {
                    this.$$beforeBroadcastState({ }, () => {
                      this.cc.broadcastState(skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, identity);
                    });
                  } else {
                    this.$$beforeBroadcastState({ });
                    this.cc.broadcastState(skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, identity);
                  }
                } else {
                  this.cc.broadcastState(skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, identity);
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
            broadcastState: (skipBroadcastRefState, originalState, stateFor, moduleName, partialSharedState, identity) => {
              if (skipBroadcastRefState === false) {
                let _partialSharedState = partialSharedState;
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
                        if (ccContext.isDebug) {
                          console.log(ss(`received state for ref ${ccKey} is broadcasted from same module's other ref ${currentCcKey}`), cl());
                        }
                        ref.cc.prepareReactSetState(identity, 'broadcastState', sharedStateForCurrentCcClass, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY)
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

          this.$$invoke = this.__$$getInvokeHandler(_curStateModule, ccKey, ccUniqueKey, ccClassKey);
          this.$$lazyInvoke = this.__$$getInvokeHandler(_curStateModule, ccKey, ccUniqueKey, ccClassKey, { isLazy: true });

          this.$$emit = thisCC.emit;
          this.$$emitIdentity = thisCC.emitIdentity;
          this.$$emitWith = thisCC.emitWith;
          this.$$on = thisCC.on;
          this.$$onIdentity = thisCC.onIdentity;
          this.$$off = thisCC.off;

          this.$$moduleComputed = thisCC.moduleComputed = _computedValue[currentModule] || {};
          this.$$globalComputed = thisCC.globalComputed = _computedValue[MODULE_GLOBAL] || {};
          this.$$connectedComputed = thisCC.connectedComputed = ccClassContext.connectedComputed;

          this.setState = thisCC.setState;//let setState call cc.setState
          this.setGlobalState = thisCC.setGlobalState;//let setGlobalState call cc.setGlobalState
          this.setModuleState = thisCC.setModuleState;//let setModuleState call cc.setModuleState
          this.forceUpdate = thisCC.forceUpdate;//let forceUpdate call cc.forceUpdate
        }

        // this method is service only for concent
        // so make sure you know what you want, and you don't need call this method most of the time,
        $$changeState(state, {
          ccKey, ccUniqueKey, stateFor = STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module, skipMiddleware = false,
          cb: reactCallback, type, reducerModule, calledBy, fnName, delay = -1, identity } = {}
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
            passToMiddleware = { calledBy, type, ccKey, ccUniqueKey, state, stateFor, module, reducerModule, fnName };
          }

          //在prepareReactSetState之前把状态存储到store，
          //防止属于同一个模块的父组件套子组件渲染时，父组件修改了state，子组件初次挂载是不能第一时间拿到state
          //也防止prepareReactSetState里有异步的钩子函数，导致state同步到store有延迟而出现其他bug
          const broadcastInfo = this.cc.syncCommittedStateToStore(stateFor, module, state);
          if (module === currentModule) {
            // who trigger $$changeState, who will change the whole received state 
            this.cc.prepareReactSetState(identity, calledBy, state, stateFor, () => {
              this.cc.prepareBroadcastState(skipMiddleware, passToMiddleware, broadcastInfo, stateFor, module, state, delay, identity);
            }, reactCallback);
          } else {
            if (reactCallback) justWarning(`callback for react.setState will be ignore`);
            //触发修改状态的实例所属模块和目标模块不一致的时候，这里的stateFor必须是OF_ONE_MODULE
            this.cc.prepareBroadcastState(skipMiddleware, passToMiddleware, broadcastInfo, STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, module, state, delay, identity);
          }
        }
        __$$getChangeStateHandler(executionContext) {
          return (state) => this.$$changeState(state, executionContext)
        }
        __$$getInvokeHandler(module, ccKey, ccUniqueKey, ccClassKey, chainData) {
          return this.__$$makeInvokeHandler(module, ccKey, ccUniqueKey, ccClassKey, chainData);
        }
        __$$makeInvokeHandler(module, ccKey, ccUniqueKey, ccClassKey, { chainId, oriChainId, isLazy, chainId_depth_ = {} } = {}) {
          return (firstParam, payload) => {
            const { _chainId, _oriChainId } = getNewChainData(isLazy, chainId, oriChainId, chainId_depth_);

            const firstParamType = typeof firstParam;
            const option = { ccKey, ccUniqueKey, ccClassKey, calledBy: INVOKE, module, chainId: _chainId, oriChainId: _oriChainId, chainId_depth_ };

            const err = new Error(`param type error, correct usage: invoke(userFn:function, ...args:any[]) or invoke(option:{fn:function, delay:number, identity:string}, ...args:any[])`);
            if (firstParamType === 'function') {
              return this.cc.__invoke(firstParam, option, payload);
            } else if (firstParamType === 'object') {
              //firstParam: {fn:function, delay:number, identity:string}

              // const { fn, ...option } = firstParam;//防止某些版本的create-react-app运行瓷出错，这里不采用对象延展符的写法
              const { fn, delay, identity, module: userInputModule } = firstParam;
              if (typeof fn != 'function') throw err;
              option.delay = delay;
              option.identity = identity;
              if (userInputModule) option.module = userInputModule;//用某个模块的实例去修改另外模块的数据

              return this.cc.__invoke(fn, option, payload)
            } else {
              throw err;
            }
            // return ()=>{}
          }
        }

        __$$getDispatchHandler(
          refState, isLazy, ccKey, ccUniqueKey, ccClassKey, stateFor, targetModule, targetReducerModule, inputType, inputPayload,
          delay = -1, defaultIdentity = '', chainId, oriChainId, chainId_depth_ = {}
          // sourceModule, oriChainId, oriChainDepth
        ) {
          return (paramObj = {}, payloadWhenFirstParamIsString, userInputDelay, userInputIdentity) => {
            const { _chainId, _oriChainId } = getNewChainData(isLazy, chainId, oriChainId, chainId_depth_);

            const paramObjType = typeof paramObj;
            let _module = targetModule, _reducerModule, _type, _payload = inputPayload, _cb, _delay = delay;
            let _identity = defaultIdentity;
            if (paramObjType === 'object') {
              const { module = targetModule, reducerModule,
                type = inputType, payload = inputPayload, cb, delay = -1, identity
              } = paramObj;
              _module = module;
              _reducerModule = reducerModule || module;
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
                stateFor, module: _module, reducerModule: nowReducerModule, type: _type, payload: _payload,
                cb: _cb, __innerCb: _promiseErrorHandler(resolve, reject),
                ccKey, ccUniqueKey, ccClassKey, delay: _delay, identity: _identity,
                refState, chainId: _chainId, oriChainId: _oriChainId, chainId_depth_
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

        $$syncBool(e, delay = -1, idt = '') {
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
        //对布尔值自动取反
        $$setBool(ccsync, delay, idt) {
          this.__$$sync({ [CCSYNC_KEY]: ccsync, type: 'bool', delay, idt });
        }
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
