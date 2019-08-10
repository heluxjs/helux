// import hoistNonReactStatic from 'hoist-non-react-statics';
import {
  MODULE_GLOBAL, ERR, 
  SIG_FN_START, SIG_FN_END, SIG_FN_QUIT, SIG_FN_ERR,
  DISPATCH,  INVOKE,
} from '../../support/constant';
import ccContext from '../../cc-context';
import * as util from '../../support/util';
import co from 'co';
import catchCcError from '../base/catch-cc-error';
import { getChainId, setChainState, setAndGetChainStateList, exitChain, removeChainState, isChainExited, setChainIdLazy, isChainIdLazy } from '../chain';
import { send } from '../plugin';
import * as checker from '../checker';
import changeRefState from '../state/change-ref-state';
import setState from './set-state';
import getAndStoreValidGlobalState from './get-and-store-valid-global-state';
import extractStateByKeys from './extract-state-by-keys';

const { verboseInfo, makeError, justWarning, okeys } = util;
const {
  store: { getState, setState: storeSetState },
  reducer: { _reducer }, 
  computed: { _computedValue },
  ccClassKey_ccClassContext_,
} = ccContext;
const me = makeError;
const vbi = verboseInfo;

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

function paramCallBackShouldNotSupply(module, currentModule) {
  return `if you pass param reactCallback, param module must equal current CCInstance's module, module: ${module}, CCInstance's module:${currentModule}, now the cb will never been triggered! `;
}

function _promiseErrorHandler(resolve, reject) {
  return (err, ...args) => err ? reject(err) : resolve(...args);
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

// any error in this function will not been throwed, cc just warning, 
function isStateModuleValid(inputModule, currentModule, reactCallback, cb) {
  let targetCb = reactCallback;
  if (checkStoreModule(inputModule, false)) {
    if (inputModule !== currentModule) {
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

function handleCcFnError(err, __innerCb) {
  if (err) {
    if (__innerCb) __innerCb(err);
    else {
      justWarning(err);
      if (ccContext.errorHandler) ccContext.errorHandler(err);
    }
  }
}

function _promisifyCcFn(ccFn, userLogicFn, executionContext, payload) {
  return new Promise((resolve, reject) => {
    const _executionContext = Object.assign(executionContext, { __innerCb: _promiseErrorHandler(resolve, reject) });
    ccFn(userLogicFn, _executionContext, payload);
  }).catch(catchCcError);
}

function __promisifiedInvokeWith(userLogicFn, executionContext, payload){
  return _promisifyCcFn(invokeWith, userLogicFn, executionContext, payload);
}

function __invoke(userLogicFn, option, payload){
  const { targetRef, ccKey, ccUniqueKey, ccClassKey, delay, identity, calledBy, module, chainId, oriChainId, chainId_depth_ } = option;
  return __promisifiedInvokeWith(userLogicFn, {
    targetRef, ccKey, ccUniqueKey, context: true, module, ccClassKey,
    calledBy, fnName: userLogicFn.name, delay, identity, chainId, oriChainId, chainId_depth_,
  }, payload);
}

export function makeCcSetStateHandler(ref, containerRef) {
  return (state, cb, shouldCurrentRefUpdate) => {
    const refCtx = ref.ctx;
    let containerRefState = containerRef ? containerRef.state : null;
    const refState = ref.state;
    const refCtxState = refCtx.state;

    /** start update state */

    //采用okeys写法，让用户结构出来的state总是指向同一个引用
    okeys(state).forEach(k => {
      const val = state[k];

      refState[k] = val;
      refCtxState[k] = val;
      if (containerRefState) containerRefState[k] = val;//让代理模式下的容器组件state也总是保持最新的
    });

    /** start update ui */
    if (shouldCurrentRefUpdate) {
      refCtx.renderCount += 1;
      refCtx.reactSetState(state, cb);
    }
  }
}

export function makeCcForceUpdateHandler(ref) {
  return (cb) => {
    const refCtx = ref.ctx;
    refCtx.renderCount += 1;
    refCtx.reactForceUpdate(cb);
  }
}

// last param: chainData
export function  makeInvokeHandler(targetRef, ccKey, ccUniqueKey, ccClassKey, { chainId, oriChainId, isLazy, chainId_depth_ = {} } = {}) {
  return (firstParam, payload, delay, identity) => {
    const { _chainId, _oriChainId } = getNewChainData(isLazy, chainId, oriChainId, chainId_depth_);

    const firstParamType = typeof firstParam;
    const option = {
      targetRef, ccKey, ccUniqueKey, ccClassKey, calledBy: INVOKE, module: targetRef.ctx.module,
      chainId: _chainId, oriChainId: _oriChainId, chainId_depth_, delay, identity,
    };

    const err = new Error(`param type error, correct usage: invoke(userFn:function, ...args:any[]) or invoke(option:{fn:function, delay:number, identity:string}, ...args:any[])`);
    if (firstParamType === 'function') {
      return __invoke(firstParam, option, payload);
    } else if (firstParamType === 'object') {
      //firstParam: {fn:function, delay:number, identity:string}

      // const { fn, ...option } = firstParam;//防止某些版本的create-react-app运行瓷出错，这里不采用对象延展符的写法
      const { fn, module: userInputModule } = firstParam;
      if (typeof fn != 'function') throw err;
      if (userInputModule) option.module = userInputModule;//用某个模块的实例去修改另外模块的数据

      return __invoke(fn, option, payload)
    } else {
      throw err;
    }
    // return ()=>{}
  }
}

export function invokeWith(userLogicFn, executionContext, payload){
  //ccKey ccClassKey 表示调用源头组件的ccKey和ccClassKey
  const targetRef = executionContext.targetRef;
  const _curStateModule = targetRef.ctx.module; 
  const {
    ccKey, ccUniqueKey, ccClassKey, module: targetModule = _curStateModule, context = false,
    cb, __innerCb, type, reducerModule, calledBy, fnName, delay = -1, identity,
    chainId, oriChainId, chainId_depth_
    // sourceModule
  } = executionContext;
  isStateModuleValid(targetModule, _curStateModule, cb, (err, newCb) => {
    if (err) return handleCcFnError(err, __innerCb);
    const moduleState = getState(targetModule);

    let executionContextForUser = {};
    let isSourceCall = false;
    if (context) {
      isSourceCall = chainId === oriChainId && chainId_depth_[chainId] === 1;
      //调用前先加1
      chainId_depth_[chainId] = chainId_depth_[chainId] + 1;

      const dispatch = makeDispatchHandler(
        targetRef, false, ccKey, ccUniqueKey, ccClassKey, targetModule, reducerModule,
        -1, identity, chainId, oriChainId, chainId_depth_
      );
      const lazyDispatch = makeDispatchHandler(
        targetRef, true, ccKey, ccUniqueKey, ccClassKey, targetModule, reducerModule,
        -1, identity, chainId, oriChainId, chainId_depth_
      );

      const sourceClassContext = ccClassKey_ccClassContext_[ccClassKey];

      executionContextForUser = Object.assign(
        executionContext, {
          invoke: makeInvokeHandler(targetRef, ccKey, ccUniqueKey, ccClassKey, { chainId, oriChainId, chainId_depth_ }),

          //oriChainId, chainId_depth_ 一直携带下去，设置isLazy，会重新生成chainId
          lazyInvoke: makeInvokeHandler(targetRef, ccKey, ccUniqueKey, ccClassKey, { isLazy: true, oriChainId, chainId_depth_ }),
          dispatch, lazyDispatch,

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
          refState: targetRef.state,
          //其他ref相关的属性，不再传递给上下文，concent不鼓励用户在reducer使用ref相关数据，因为不同调用方传递不同的ref值，会引起用户不注意的bug
        });
    }

    send(SIG_FN_START, { isSourceCall, calledBy, module: targetModule, chainId, fn: userLogicFn });
    co.wrap(userLogicFn)(payload, moduleState, executionContextForUser).then(partialState => {

      chainId_depth_[chainId] = chainId_depth_[chainId] - 1;//调用结束减1
      const curDepth = chainId_depth_[chainId];

      let commitStateList = [];
      send(SIG_FN_END, { isSourceCall, calledBy, module: targetModule, chainId, fn: userLogicFn });

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
        changeRefState(v.state, {
          identity, ccKey, ccUniqueKey, module: v.module, cb: newCb, type,
          reducerModule, calledBy, fnName, delay
        }, targetRef);
      });

      if (__innerCb) __innerCb(null, partialState);
    }).catch(err => {
      send(SIG_FN_ERR, { isSourceCall, calledBy, module: targetModule, chainId, fn: userLogicFn });
      handleCcFnError(err, __innerCb);
    });
  });
}

export function dispatch({
  targetRef, ccKey, ccUniqueKey, ccClassKey, module: inputModule, reducerModule: inputReducerModule, identity,
  type, payload, cb: reactCallback, __innerCb, delay = -1, chainId, oriChainId, chainId_depth_ } = {}
){
  const targetReducerMap = _reducer[inputReducerModule];
  if (!targetReducerMap) {
    return __innerCb(new Error(`no reducerMap found for reducer module:${inputReducerModule}`));
  }
  const reducerFn = targetReducerMap[type];
  if (!reducerFn) {
    const fns = Object.keys(targetReducerMap);
    return __innerCb(new Error(`no reducer defined in ccContext for reducer module:${inputReducerModule} type:${type}, maybe you want to invoke one of them:${fns}`));
  }
  // const errMsg = util.isCcActionValid({ type, payload });
  // if (errMsg) return justWarning(errMsg);

  isStateModuleValid(inputModule, targetRef.ctx.module, reactCallback, (err, newCb) => {
    if (err) return __innerCb(err);
    const executionContext = {
      targetRef, ccKey, ccClassKey, ccUniqueKey, module: inputModule, reducerModule: inputReducerModule, type,
      cb: newCb, context: true, __innerCb, calledBy: DISPATCH, delay, identity,
      chainId, oriChainId, chainId_depth_
    };
    invokeWith(reducerFn, executionContext, payload);
  });
}

export function makeDispatchHandler(
  targetRef, isLazy, ccKey, ccUniqueKey, ccClassKey, defaultModule, defaultReducerModule,
  delay = -1, defaultIdentity = '', chainId, oriChainId, chainId_depth_ = {}
  // sourceModule, oriChainId, oriChainDepth
) {
  return (paramObj = {}, payloadWhenFirstParamIsString, userInputDelay, userInputIdentity) => {
    const { _chainId, _oriChainId } = getNewChainData(isLazy, chainId, oriChainId, chainId_depth_);

    const paramObjType = typeof paramObj;
    let _module = defaultModule, _reducerModule, _type, _payload, _cb, _delay = delay;
    let _identity = defaultIdentity;
    if (paramObjType === 'object') {
      const { 
        module = defaultModule, reducerModule, type, payload, cb, delay = -1, identity
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
      if (paramObjType === 'function') {
        const fnName = paramObj.__fnName;
        if (!fnName) throw new Error('you are calling a unnamed function!!!');
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
        if (module === '' || module === ' ') _module = defaultModule;//targetFirstParam may like: /foo/changeName
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

    // pick user input reducerModule firstly!
    let targetReducerModule = _reducerModule || (defaultReducerModule || _module);
    const p = new Promise((resolve, reject) => {
      dispatch({
        targetRef, module: _module, reducerModule: targetReducerModule, type: _type, payload: _payload,
        cb: _cb, __innerCb: _promiseErrorHandler(resolve, reject),
        ccKey, ccUniqueKey, ccClassKey, delay: _delay, identity: _identity,
        chainId: _chainId, oriChainId: _oriChainId, chainId_depth_
        // oriChainId: _oriChainId, oriChainDepth: _oriChainDepth, sourceModule: _sourceModule,
      });
    }).catch(catchCcError);
    return p;
  }
}

// for module/init method
export function makeSetStateHandler(module) {
  return state => {
    try {
      setState(module, state, 0);
    } catch (err) {
      if (module === MODULE_GLOBAL) {
        getAndStoreValidGlobalState(state, module);
      } else {
        const moduleState = getState(module);
        if (!moduleState) {
          return util.justWarning(`invalid module ${module}`);
        }

        const keys = util.okeys(moduleState);
        const { partialState, isStateEmpty } = extractStateByKeys(state, keys);
        if (!isStateEmpty) storeSetState(module, partialState);//store this valid state;
      }

      util.justTip(`no ccInstance found for module[${module}] currently, cc will just store it, lately ccInstance will pick this state to render`);
    }
  }
}