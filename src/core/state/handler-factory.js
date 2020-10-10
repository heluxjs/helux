// import hoistNonReactStatic from 'hoist-non-react-statics';
import {
  MODULE_GLOBAL, ERR,
  SIG_FN_START, SIG_FN_END, SIG_FN_ERR,
  DISPATCH, INVOKE, CC_HOOK,
} from '../../support/constant';
import ccContext from '../../cc-context';
import * as util from '../../support/util';
import catchCcError from '../base/catch-cc-error';
import ccDispatch from '../base/dispatch';
import {
  getChainId, setChainState, setAllChainState, setAndGetChainStateList,
  // exitChain, getChainStateMap, 
  getAllChainStateMap, removeChainState, removeAllChainState, isChainExited, setChainIdLazy, isChainIdLazy
} from '../chain';
import { send } from '../plugin';
import * as checker from '../param/checker';
import changeRefState from '../state/change-ref-state';
import { innerSetState } from './set-state';
import extractStateByKeys from './extract-state-by-keys';

const { verboseInfo, makeError, justWarning, isPJO, okeys } = util;
const {
  store: { getState, setState: storeSetState },
  reducer: { _reducer },
  computed: { _computedValue },
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
  return `param module[${module}] must equal current ref's module[${currentModule}] when pass param reactCallback, or it will never been triggered! `;
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

// any error in this function will not been throw, cc just warning, 
function isStateModuleValid(inputModule, currentModule, reactCallback, cb) {
  let targetCb = reactCallback;
  if (checkStoreModule(inputModule, false)) {
    if (inputModule !== currentModule && reactCallback) {
      // ???strict
      justWarning(paramCallBackShouldNotSupply(inputModule, currentModule));
      targetCb = null;//let user's reactCallback has no chance to be triggered
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
      if (ccContext.runtimeHandler.errorHandler) ccContext.runtimeHandler.errorHandler(err);
    }
  }
}

function _promisifyCcFn(ccFn, userLogicFn, executionContext, payload) {
  return new Promise((resolve, reject) => {
    const _executionContext = Object.assign(executionContext, { __innerCb: _promiseErrorHandler(resolve, reject) });
    ccFn(userLogicFn, _executionContext, payload);
  }).catch(catchCcError);
}

function __promisifiedInvokeWith(userLogicFn, executionContext, payload) {
  return _promisifyCcFn(invokeWith, userLogicFn, executionContext, payload);
}

function __invoke(userLogicFn, option, payload) {
  const { callerRef, delay, renderKey, calledBy, module, chainId, oriChainId, chainId_depth_, isSilent } = option;
  return __promisifiedInvokeWith(userLogicFn, {
    callerRef, context: true, module, calledBy, fnName: userLogicFn.name,
    delay, renderKey, chainId, oriChainId, chainId_depth_, isSilent,
  }, payload);
}

// 后面会根据具体组件形态给reactSetState赋值
// 直接写为 makeCcSetStateHandler = (ref)=> ref.ctx.reactSetState, 是错误的
// ref.ctx.reactSetState是在后面的流程里被赋值的，所以此处多用一层函数包裹再调用
export function makeCcSetStateHandler(ref) {
  return (state, cb) => {
    ref.ctx.reactSetState(state, cb);
  }
}

export function makeCcForceUpdateHandler(ref) {
  return (cb) => {
    ref.ctx.reactForceUpdate(cb);
  }
}

// last param: chainData
export function makeInvokeHandler(callerRef, { chainId, oriChainId, isLazy, delay = -1, isSilent = false, chainId_depth_ = {} } = {}) {
  return (firstParam, payload, inputRKey, inputDelay) => {

    let _isLazy = isLazy, _isSilent = isSilent;
    let _renderKey = '', _delay = inputDelay != undefined ? inputDelay : delay;

    if (isPJO(inputRKey)) {
      const { lazy, silent, renderKey, delay } = inputRKey;
      lazy !== undefined && (_isLazy = lazy);
      silent !== undefined && (_isSilent = silent);
      renderKey !== undefined && (_renderKey = renderKey);
      delay !== undefined && (_delay = delay);
    } else {
      _renderKey = inputRKey;
    }
    const { _chainId, _oriChainId } = getNewChainData(_isLazy, chainId, oriChainId, chainId_depth_);

    const firstParamType = typeof firstParam;
    const option = {
      callerRef, calledBy: INVOKE, module: callerRef.ctx.module, isSilent: _isSilent,
      chainId: _chainId, oriChainId: _oriChainId, chainId_depth_, delay: _delay, renderKey: _renderKey,
    };

    const err = new Error(`param type error, correct usage: invoke(userFn:function, ...args:any[]) or invoke(option:[module:string, fn:function], ...args:any[])`);
    if (firstParamType === 'function') {
      // 可能用户直接使用invoke调用了reducer函数
      if (firstParam.__fnName) firstParam.name = firstParam.__fnName;

      // 这里不修改option.module，concent明确定义了dispatch和invoke规则
      /**
        invoke调用函数引用时
        无论组件有无注册模块，一定走调用方模块

        dispatch调用函数引用时
        优先走函数引用的模块（此时函数是一个reducer函数），没有(此函数不是reducer函数)则走调用方的模块并降级为invoke调用
       */
      // if (firstParam.__stateModule) option.module = firstParam.__stateModule;

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

export function invokeWith(userLogicFn, executionContext, payload) {
  const callerRef = executionContext.callerRef;
  const callerModule = callerRef.ctx.module;
  const {
    module: targetModule = callerModule, context = false,
    cb, __innerCb, type, calledBy, fnName = '', delay = -1, renderKey,
    chainId, oriChainId, chainId_depth_, isSilent
    // sourceModule
  } = executionContext;
  isStateModuleValid(targetModule, callerModule, cb, (err, newCb) => {
    if (err) return handleCcFnError(err, __innerCb);
    const moduleState = getState(targetModule);

    let actionContext = {};
    let isSourceCall = false;
    isSourceCall = chainId === oriChainId && chainId_depth_[chainId] === 1;
    if (context) {
      //调用前先加1
      chainId_depth_[chainId] = chainId_depth_[chainId] + 1;

      // !!!makeDispatchHandler的dispatch lazyDispatch将源头的isSilent 一致透传下去
      const dispatch = makeDispatchHandler(
        callerRef, false, isSilent, targetModule, renderKey, delay, chainId, oriChainId, chainId_depth_
      );
      const silentDispatch = makeDispatchHandler(
        callerRef, false, true, targetModule, renderKey, delay, chainId, oriChainId, chainId_depth_
      );
      const lazyDispatch = makeDispatchHandler(
        callerRef, true, isSilent, targetModule, renderKey, delay, chainId, oriChainId, chainId_depth_
      );

      //oriChainId, chainId_depth_ 一直携带下去，设置isLazy，会重新生成chainId
      const invoke = makeInvokeHandler(callerRef, { delay, chainId, oriChainId, chainId_depth_ });
      const lazyInvoke = makeInvokeHandler(callerRef, { isLazy: true, delay, oriChainId, chainId_depth_ });
      const silentInvoke = makeInvokeHandler(callerRef, { isLazy: false, delay, isSilent: true, oriChainId, chainId_depth_ });

      // 首次调用时是undefined，这里做个保护
      const committedStateMap = getAllChainStateMap(chainId) || {};
      const committedState = committedStateMap[targetModule] || {};

      actionContext = {
        callInfo: {
          renderKey, delay, fnName, type, calledBy
        },
        module: targetModule,
        callerModule,
        committedStateMap,//一次ref dispatch调用，所经过的所有reducer的返回结果收集
        committedState,

        invoke, lazyInvoke, silentInvoke,
        invokeLazy: lazyInvoke,
        invokeSilent: silentInvoke,

        dispatch, lazyDispatch, silentDispatch,
        dispatchLazy: lazyDispatch, dispatchSilent: silentDispatch,

        rootState: getState(),
        globalState: getState(MODULE_GLOBAL),
        // 指的是目标模块的state
        moduleState,
        // 指的是目标模块的的moduleComputed
        moduleComputed: _computedValue[targetModule] || {},

        // 利用dispatch调用自动生成的setState
        setState: (state, r, d) => {
          const targetR = r !== 0 ? (r || renderKey) : r;
          const targetD = d !== 0 ? (d || delay) : d;
          return dispatch('setState', state, { silent: isSilent, renderKey: targetR, delay: targetD });
        },
        // !!!指的是调用源cc类实例的ctx
        refCtx: callerRef.ctx,
        // concent不鼓励用户在reducer使用ref相关数据书写业务逻辑，除非用户确保是同一个模块的实例触发调用该函数，
        // 因为不同调用方传递不同的refCtx值，会引起用户不注意的bug
      };
    }

    if (isSilent === false) {
      send(SIG_FN_START, { isSourceCall, calledBy, module: targetModule, chainId, fn: userLogicFn });
    }

    const handleReturnState = partialState => {
      chainId_depth_[chainId] = chainId_depth_[chainId] - 1;// 调用结束减1
      const curDepth = chainId_depth_[chainId];
      const isFirstDepth = curDepth === 1;

      // 调用结束就记录
      setAllChainState(chainId, targetModule, partialState);

      let commitStateList = [];

      if (isSilent === false) {
        send(SIG_FN_END, { isSourceCall, calledBy, module: targetModule, chainId, fn: userLogicFn });

        // targetModule, sourceModule相等与否不用判断了，chainState里按模块为key去记录提交到不同模块的state
        if (isChainIdLazy(chainId)) {// 来自于惰性派发的调用
          if (!isFirstDepth) {// 某条链还在往下调用中，没有回到第一层，暂存状态，直到回到第一层才提交
            setChainState(chainId, targetModule, partialState);
          } else {// 合并状态一次性提交到store并派发到组件实例
            if (isChainExited(chainId)) {
              // 丢弃本次状态，不做任何处理
            } else {
              commitStateList = setAndGetChainStateList(chainId, targetModule, partialState);
              removeChainState(chainId);
            }
          }
        } else {
          commitStateList = [{ module: targetModule, state: partialState }];
        }
      }

      commitStateList.forEach(v => {
        if (v.state) {
          changeRefState(v.state, {
            renderKey, module: v.module, reactCallback: newCb, type,
            calledBy, fnName, delay, payload
          }, callerRef);
        }
      });

      if (isSourceCall) {// 源头dispatch or invoke结束调用
        removeChainState(chainId);
        removeAllChainState(chainId);
      }

      if (__innerCb) __innerCb(null, partialState);
    };

    const handleFnError = err => {
      send(SIG_FN_ERR, { isSourceCall, calledBy, module: targetModule, chainId, fn: userLogicFn });
      handleCcFnError(err, __innerCb);
    };

    const stOrPromisedSt = userLogicFn(payload, moduleState, actionContext);

    if (userLogicFn.__isAsync) {
      Promise.resolve(stOrPromisedSt).then(handleReturnState).catch(handleFnError);
    } 
    // 防止输入中文时，因为隔了一个Promise而出现抖动
    else {
      try {
        if (userLogicFn.__isReturnJudged) {
          handleReturnState(stOrPromisedSt);
          return;
        }

        // 再判断一次，有可能会被编译器再包一层，形如：
        //  function getServerStore(_x2) {
        //    return _getServerStore.apply(this, arguments);
        //  }
        if (util.isAsyncFn(stOrPromisedSt)) {
          userLogicFn.__isAsync = true;
          Promise.resolve(stOrPromisedSt).then(handleReturnState).catch(handleFnError);
          return;
        } else {
          userLogicFn.__isReturnJudged = true;
        }

        handleReturnState(stOrPromisedSt);
      } catch (err) {
        handleFnError(err);
      }
    }
  });
}

export function dispatch({
  callerRef, module: inputModule, renderKey, isSilent,
  type, payload, cb: reactCallback, __innerCb, delay = -1, chainId, oriChainId, chainId_depth_ } = {}
) {
  const targetReducerMap = _reducer[inputModule];
  if (!targetReducerMap) {
    return __innerCb(new Error(`no reducerMap found for module:[${inputModule}]`));
  }
  const reducerFn = targetReducerMap[type];
  if (!reducerFn) {
    const fns = okeys(targetReducerMap);
    return __innerCb(new Error(`no reducer fn found for [${inputModule}/${type}], is these fn you want:${fns}`));
  }

  const executionContext = {
    callerRef, module: inputModule, type,
    cb: reactCallback, context: true, __innerCb, calledBy: DISPATCH, delay, renderKey, isSilent,
    chainId, oriChainId, chainId_depth_
  };
  invokeWith(reducerFn, executionContext, payload);
}

export function makeDispatchHandler(
  callerRef, in_isLazy, in_isSilent, defaultModule,
  defaultRenderKey = '', delay = -1, chainId, oriChainId, chainId_depth_ = {}
  // sourceModule, oriChainId, oriChainDepth
) {
  return (paramObj = {}, payload, userInputRKey, userInputDelay) => {
    let isLazy = in_isLazy, isSilent = in_isSilent;
    let _renderKey = '';
    let _delay = userInputDelay || delay;

    if (isPJO(userInputRKey)) {
      _renderKey = defaultRenderKey;
      const { lazy, silent, renderKey, delay } = userInputRKey;
      lazy !== undefined && (isLazy = lazy);
      silent !== undefined && (isSilent = silent);
      renderKey !== undefined && (_renderKey = renderKey);
      delay !== undefined && (_delay = delay);
    } else {
      _renderKey = userInputRKey || defaultRenderKey;
    }

    const { _chainId, _oriChainId } = getNewChainData(isLazy, chainId, oriChainId, chainId_depth_);

    const paramObjType = typeof paramObj;
    let _type, _cb;

    let _module = defaultModule;

    const callInvoke = () => {
      const iHandler = makeInvokeHandler(callerRef, { chainId: _chainId, oriChainId: _oriChainId, isLazy, chainId_depth_ });
      return iHandler(paramObj, payload, _renderKey, _delay);
    }

    if (paramObjType && paramObjType === 'object') {
      if (Array.isArray(paramObj)) {
        const [mInArr, rInArr] = paramObj;
        if (rInArr && rInArr.__fnName) {
          _module = mInArr;
          _type = rInArr.__fnName;
        } else {
          return callInvoke();
        }
      } else {
        const { module, type, cb } = paramObj;
        if (module) _module = module;
        _type = type;
        _cb = cb;
      }
    } else if (paramObjType === 'string' || paramObjType === 'function') {
      let targetFirstParam = paramObj;
      if (paramObjType === 'function') {
        const fnName = paramObj.__fnName;
        if (!fnName) {// 此函数是一个普通函数，没有配置到某个模块的reducer里，降级为invoke调用
          return callInvoke();
          // throw new Error('you are calling a unnamed function!!!');
        }
        targetFirstParam = fnName;

        // 这里非常重要，只有处于第一层的调用时，才获取函数对象上的__stateModule参数
        // 防止克隆自模块a的模块b在reducer文件里基于函数引用直接调用时，取的是a的模块相关参数了，但是源头由b发起，应该是b才对
        if (chainId_depth_[_oriChainId] == 1) {
          // let dispatch can apply reducer function directly!!!
          // !!! 如果用户在b模块的组件里dispatch直接调用a模块的函数，但是确实想修改的是b模块的数据，只是想复用a模块的那个函数的逻辑
          // 那么千万要注意，写为{module:'b', fn:xxxFoo}的模式
          _module = paramObj.__stateModule;
        }
      }

      const slashCount = targetFirstParam.split('').filter(v => v === '/').length;

      if (slashCount === 0) {
        _type = targetFirstParam;
      } else if (slashCount === 1) {
        const [module, type] = targetFirstParam.split('/');
        if (module) _module = module;//targetFirstParam may like: /foo/changeName
        _type = type;
      } else {
        return Promise.reject(me(ERR.CC_DISPATCH_STRING_INVALID, vbi(targetFirstParam)));
      }
    } else {
      return Promise.reject(me(ERR.CC_DISPATCH_PARAM_INVALID));
    }

    if (_module === '*') {
      return ccDispatch(`*/${_type}`, payload,
        { silent: isSilent, lazy: isLazy, renderKey: _renderKey },
        _delay,
        { refModule: callerRef.ctx.module }, // in name of refModule to call dispatch handler
      );
    }

    const p = new Promise((resolve, reject) => {
      dispatch({
        callerRef, module: _module, type: _type, payload,
        cb: _cb, __innerCb: _promiseErrorHandler(resolve, reject),
        delay: _delay, renderKey: _renderKey, isSilent,
        chainId: _chainId, oriChainId: _oriChainId, chainId_depth_
        // oriChainId: _oriChainId, oriChainDepth: _oriChainDepth, sourceModule: _sourceModule,
      });
    }).catch(catchCcError);
    return p;
  }
}

export function makeModuleDispatcher(module) {
  return (action, ...args) => {
    let _action = typeof action === 'string' && !action.includes('/') ? `${module}/${action}` : action;
    ccDispatch(_action, ...args);
  }
}

// for moduleConf.init(legency) moduleConf.lifecycle.initState(v2.9+)
export function makeSetStateHandler(module, initStateDone) {
  return state => {
    const execInitDone = () => initStateDone && initStateDone(makeModuleDispatcher(module), getState(module));
    try {
      innerSetState(module, state, execInitDone);
    } catch (err) {
      const moduleState = getState(module);
      if (!moduleState) {
        return justWarning(`invalid module ${module}`);
      }

      const keys = okeys(moduleState);
      const { partialState, isStateEmpty, ignoredStateKeys } = extractStateByKeys(state, keys, false, true);
      if (!isStateEmpty) storeSetState(module, partialState);//store this valid state;
      if (ignoredStateKeys.length > 0) {
        justWarning(`invalid keys:${ignoredStateKeys.join(',')}, their value is undefined or they are not declared in module${module}`);
      }

      util.justTip(`no ccInstance found for module[${module}] currently, cc will just store it, lately ccInstance will pick this state to render`);
      execInitDone();
    }
  }
}

export const makeRefSetState = (ref) => (partialState, cb) => {
  const ctx = ref.ctx;
  const newState = Object.assign({}, ctx.unProxyState, partialState);
  ctx.unProxyState = newState;
  // 和class setState(partialState, cb); 保持一致
  const cbNewState = () => cb && cb(newState);
  // 让ctx.state始终保持同一个引用，使setup里可以安全的解构state反复使用
  ctx.state = Object.assign(ctx.state, partialState);

  if (ctx.type === CC_HOOK) {
    ctx.__boundSetState(newState);
    cbNewState();
  } else {
    // 此处注意原始的react class setSate [,callback] 不会提供latestState
    ctx.__boundSetState(partialState, cbNewState);
  }
}

export const makeRefForceUpdate = (ref) => (cb) => {
  const ctx = ref.ctx;
  const newState = Object.assign({}, ctx.unProxyState, ctx.__$$mstate);
  const cbNewState = () => cb && cb(newState);

  if (ctx.type === CC_HOOK) {
    ctx.__boundSetState(newState);
    cbNewState();
  } else {
    ctx.__boundForceUpdate(cbNewState);
  }
}
