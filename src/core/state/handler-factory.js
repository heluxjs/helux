// import hoistNonReactStatic from 'hoist-non-react-statics';
import {
  MODULE_GLOBAL, ERR, 
  SIG_FN_START, SIG_FN_END, SIG_FN_QUIT, SIG_FN_ERR,
  DISPATCH,  INVOKE, CC_HOOK_PREFIX,
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
  const { targetRef, delay, renderKey, calledBy, module, chainId, oriChainId, chainId_depth_ } = option;
  return __promisifiedInvokeWith(userLogicFn, {
    targetRef, context: true, module, calledBy, fnName: userLogicFn.name, 
    delay, renderKey, chainId, oriChainId, chainId_depth_,
  }, payload);
}

export function makeCcSetStateHandler(ref, containerRef) {
  return (state, cb, shouldCurrentRefUpdate) => {
    const refCtx = ref.ctx;
    
    /** start update state */
    // let containerRefState = containerRef ? containerRef.state : null;
    // const refState = ref.state;
    // const refCtxState = refCtx.state;
    // //采用okeys写法，让用户结构出来的state总是指向同一个引用
    // okeys(state).forEach(k => {
    //   const val = state[k];
    //   refState[k] = val;
    //   refCtxState[k] = val;
    //   if (containerRefState) containerRefState[k] = val;//让代理模式下的容器组件state也总是保持最新的
    // });

    /** start update state */
    // 和react保持immutable的思路一致，强迫用户养成习惯，总是从ctx取最新的state,
    // 注意这里赋值也是取refCtx.state取做合并，因为频繁进入此函数时，ref.state可能还不是最新的
    const newFullState = Object.assign({}, refCtx.state, state);
    refCtx.state = newFullState;
    if (containerRef) containerRef.state = newFullState;
    
    // 只有Hook实例，才能直接更新ref.state
    if (refCtx.type === CC_HOOK_PREFIX) {
      ref.state = newFullState;
    }

    /** start update ui */
    if (shouldCurrentRefUpdate) {
      refCtx.renderCount += 1;
      refCtx.reactSetState(state, cb);
    }else{
      //对与class实例来说，视图虽然没有更新，但是state要合并进来，让下一次即将到来的更新里能拿到之前的状态
      //否则watch启用的return false优化会造成状态丢失
      if(refCtx.type !== CC_HOOK_PREFIX){
        Object.assign(ref.state, state);
      }
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
export function makeInvokeHandler(targetRef, { chainId, oriChainId, isLazy, chainId_depth_ = {} } = {}) {
  return (firstParam, payload, renderKey, delay) => {
    const { _chainId, _oriChainId } = getNewChainData(isLazy, chainId, oriChainId, chainId_depth_);

    const firstParamType = typeof firstParam;
    const option = {
      targetRef, calledBy: INVOKE, module: targetRef.ctx.module,
      chainId: _chainId, oriChainId: _oriChainId, chainId_depth_, delay, renderKey,
    };

    const err = new Error(`param type error, correct usage: invoke(userFn:function, ...args:any[]) or invoke(option:[module:string, fn:function], ...args:any[])`);
    if (firstParamType === 'function') {
      return __invoke(firstParam, option, payload);
    } else if (firstParamType === 'object') {
      let _fn, _module;
      if (Array.isArray(firstParam)) {
        const [module, fn] = firstParam;
        _fn = fn;
        _module = module;
      } else {
        const { module, fn } = firstParam;
        _fn = fn;
        _module = module;
      }

      if (typeof _fn != 'function') throw err;
      if (_module) option.module = _module;//某个模块的实例修改了另外模块的数据

      return __invoke(_fn, option, payload)
    } else {
      throw err;
    }
  }
}

export function invokeWith(userLogicFn, executionContext, payload){
  const targetRef = executionContext.targetRef;
  const _curStateModule = targetRef.ctx.module; 
  const {
    module: targetModule = _curStateModule, context = false,
    cb, __innerCb, type, reducerModule, calledBy, fnName, delay = -1, renderKey,
    chainId, oriChainId, chainId_depth_
    // sourceModule
  } = executionContext;
  isStateModuleValid(targetModule, _curStateModule, cb, (err, newCb) => {
    if (err) return handleCcFnError(err, __innerCb);
    const moduleState = getState(targetModule);

    let reducerContext = {};
    let isSourceCall = false;
    if (context) {
      isSourceCall = chainId === oriChainId && chainId_depth_[chainId] === 1;
      //调用前先加1
      chainId_depth_[chainId] = chainId_depth_[chainId] + 1;

      const dispatch = makeDispatchHandler(
        targetRef, false, targetModule, reducerModule, renderKey, -1, chainId, oriChainId, chainId_depth_
      );
      const lazyDispatch = makeDispatchHandler(
        targetRef, true, targetModule, reducerModule, renderKey, -1, chainId, oriChainId, chainId_depth_
      );

      const sourceClassContext = ccClassKey_ccClassContext_[targetRef.ctx.ccClassKey];

      reducerContext = {
        targetModule,

        invoke: makeInvokeHandler(targetRef, { chainId, oriChainId, chainId_depth_ }),

        //oriChainId, chainId_depth_ 一直携带下去，设置isLazy，会重新生成chainId
        lazyInvoke: makeInvokeHandler(targetRef, { isLazy: true, oriChainId, chainId_depth_ }),
        dispatch, lazyDispatch,

        rootState: getState(),
        globalState: getState(MODULE_GLOBAL),
        //指的是目标模块的state
        moduleState,
        //指的是目标模块的的moduleComputed
        moduleComputed: _computedValue[targetModule] || {},

        //!!!指的是调用源cc类的connectedState
        connectedState: sourceClassContext.connectedState,
        //!!!指的是调用源cc类的connectedComputed
        connectedComputed: sourceClassContext.connectedComputed,

        //利用dispatch调用自动生成的setState
        setState: state => dispatch('setState', state),
        //!!!指的是调用源cc类实例的ctx
        refCtx: targetRef.ctx,
        // concent不鼓励用户在reducer使用ref相关数据书写业务逻辑，除非用户确保是同一个模块的实例触发调用该函数，
        // 因为不同调用方传递不同的refCtx值，会引起用户不注意的bug
      };
    }

    send(SIG_FN_START, { isSourceCall, calledBy, module: targetModule, chainId, fn: userLogicFn });
    co.wrap(userLogicFn)(payload, moduleState, reducerContext).then(partialState => {

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
        if (v.state) {
          changeRefState(v.state, {
            renderKey, module: v.module, cb: newCb, type,
            reducerModule, calledBy, fnName, delay
          }, targetRef);
        }
      });

      if (__innerCb) __innerCb(null, partialState);
    }).catch(err => {
      send(SIG_FN_ERR, { isSourceCall, calledBy, module: targetModule, chainId, fn: userLogicFn });
      handleCcFnError(err, __innerCb);
    });
  });
}

export function dispatch({
  targetRef, module: inputModule, reducerModule: inputReducerModule, renderKey,
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
      targetRef, module: inputModule, reducerModule: inputReducerModule, type,
      cb: newCb, context: true, __innerCb, calledBy: DISPATCH, delay, renderKey,
      chainId, oriChainId, chainId_depth_
    };
    invokeWith(reducerFn, executionContext, payload);
  });
}

export function makeDispatchHandler(
  targetRef, isLazy, defaultModule, defaultReducerModule,
  defaultRenderKey = '', delay = -1, chainId, oriChainId, chainId_depth_ = {}
  // sourceModule, oriChainId, oriChainDepth
) {
  return (paramObj = {}, payload, userInputRKey, userInputDelay) => {
    const { _chainId, _oriChainId } = getNewChainData(isLazy, chainId, oriChainId, chainId_depth_);

    const paramObjType = typeof paramObj;
    let _type, _cb;

    let _module = defaultModule;
    let _reducerModule = defaultReducerModule;
    const _delay = userInputDelay || delay;
    const _renderKey = userInputRKey || defaultRenderKey;

    const callInvoke = ()=>{
      const iHandler = makeInvokeHandler(targetRef, { chainId: _chainId, oriChainId: _oriChainId, isLazy, chainId_depth_ });
      return iHandler(paramObj, payload, _renderKey, _delay);
    }

    if (paramObjType === 'object') {
      if (Array.isArray(paramObjType)) {
        return callInvoke();
      }
      const { module, reducerModule, type, cb } = paramObj;
      if (module) _module = module;
      _reducerModule = reducerModule || (module || defaultReducerModule);
      _type = type;
      _cb = cb;

    } else if (paramObjType === 'string' || paramObjType === 'function') {
      let targetFirstParam = paramObj;
      if (paramObjType === 'function') {
        const fnName = paramObj.__fnName;
        if (!fnName) {
          return callInvoke();
          // throw new Error('you are calling a unnamed function!!!');
        }
        targetFirstParam = fnName;

        // 这里非常重要，只有处于第一层的调用时，才获取函数对象上的__stateModule __reducerModule参数
        // 防止克隆自模块a的模块b在reducer文件里基于函数引用直接调用时，取的是a的模块相关参数了，但是源头由b发起，应该是b才对
        if (chainId_depth_[oriChainId] == 1) {
          // let dispatch can apply reducer function directly!!!
          // !!! 如果用户在b模块的组件里dispatch直接调用a模块的函数，但是确实想修改的是b模块的数据，只是想复用a模块的那个函数的逻辑
          // 那么千万要注意，写为{module:'b', fn:xxxFoo}的模式
          _module = paramObj.__stateModule;
          _reducerModule = paramObj.__reducerModule;
        }
      }

      const slashCount = targetFirstParam.split('').filter(v => v === '/').length;

      if (slashCount === 0) {
        _type = targetFirstParam;
      } else if (slashCount === 1) {
        const [module, type] = targetFirstParam.split('/');
        _module = module;
        _reducerModule = _module;
        _type = type;
      } else if (slashCount === 2) {
        const [module, reducerModule, type] = targetFirstParam.split('/');
        if (module) _module = module;//targetFirstParam may like: /foo/changeName
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

    const p = new Promise((resolve, reject) => {
      dispatch({
        targetRef, module: _module, reducerModule: _reducerModule, type: _type, payload,
        cb: _cb, __innerCb: _promiseErrorHandler(resolve, reject),
        delay: _delay, renderKey: _renderKey,
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
      setState(module, state);
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