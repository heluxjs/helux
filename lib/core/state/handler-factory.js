"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.makeCcSetStateHandler = makeCcSetStateHandler;
exports.makeCcForceUpdateHandler = makeCcForceUpdateHandler;
exports.makeInvokeHandler = makeInvokeHandler;
exports.invokeWith = invokeWith;
exports.dispatch = dispatch;
exports.makeDispatchHandler = makeDispatchHandler;
exports.makeSetStateHandler = makeSetStateHandler;

var _constant = require("../../support/constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var util = _interopRequireWildcard(require("../../support/util"));

var _catchCcError = _interopRequireDefault(require("../base/catch-cc-error"));

var _chain = require("../chain");

var _plugin = require("../plugin");

var checker = _interopRequireWildcard(require("../checker"));

var _changeRefState = _interopRequireDefault(require("../state/change-ref-state"));

var _setState = _interopRequireDefault(require("./set-state"));

var _getAndStoreValidGlobalState = _interopRequireDefault(require("./get-and-store-valid-global-state"));

var _extractStateByKeys2 = _interopRequireDefault(require("./extract-state-by-keys"));

// import hoistNonReactStatic from 'hoist-non-react-statics';
var verboseInfo = util.verboseInfo,
    makeError = util.makeError,
    justWarning = util.justWarning,
    isPJO = util.isPJO;
var _ccContext$store = _ccContext["default"].store,
    getState = _ccContext$store.getState,
    storeSetState = _ccContext$store.setState,
    _reducer = _ccContext["default"].reducer._reducer,
    _computedValue = _ccContext["default"].computed._computedValue;
var me = makeError;
var vbi = verboseInfo;

function handleError(err, throwError) {
  if (throwError === void 0) {
    throwError = true;
  }

  if (throwError) throw err;else {
    handleCcFnError(err);
  }
}

function checkStoreModule(module, throwError) {
  if (throwError === void 0) {
    throwError = true;
  }

  try {
    checker.checkModuleName(module, false, "module[" + module + "] is not configured in store");
    return true;
  } catch (err) {
    handleError(err, throwError);
    return false;
  }
}

function paramCallBackShouldNotSupply(module, currentModule) {
  return "param module[" + module + "] must equal current ref's module[" + currentModule + "] when pass param reactCallback, or it will never been triggered! ";
}

function _promiseErrorHandler(resolve, reject) {
  return function (err) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return err ? reject(err) : resolve.apply(void 0, args);
  };
} //忽略掉传递进来的chainId，chainDepth，重新生成它们，源头调用了lazyDispatch或者ctx里调用了lazyDispatch，就会触发此逻辑


function getNewChainData(isLazy, chainId, oriChainId, chainId_depth_) {
  var _chainId;

  if (isLazy === true) {
    _chainId = (0, _chain.getChainId)();
    (0, _chain.setChainIdLazy)(_chainId);
    chainId_depth_[_chainId] = 1; //置为1
  } else {
    _chainId = chainId || (0, _chain.getChainId)();
    if (!chainId_depth_[_chainId]) chainId_depth_[_chainId] = 1;
  } //源头函数会触发创建oriChainId， 之后就一直传递下去了


  var _oriChainId = oriChainId || _chainId;

  return {
    _chainId: _chainId,
    _oriChainId: _oriChainId
  };
} // any error in this function will not been throw, cc just warning, 


function isStateModuleValid(inputModule, currentModule, reactCallback, cb) {
  var targetCb = reactCallback;

  if (checkStoreModule(inputModule, false)) {
    if (inputModule !== currentModule && reactCallback) {
      // ???strict
      justWarning(paramCallBackShouldNotSupply(inputModule, currentModule));
      targetCb = null; //let user's reactCallback has no chance to be triggered
    }

    cb(null, targetCb);
  } else {
    cb(new Error("inputModule:" + inputModule + " invalid"), null);
  }
}

function handleCcFnError(err, __innerCb) {
  if (err) {
    if (__innerCb) __innerCb(err);else {
      justWarning(err);
      if (_ccContext["default"].errorHandler) _ccContext["default"].errorHandler(err);
    }
  }
}

function _promisifyCcFn(ccFn, userLogicFn, executionContext, payload) {
  return new Promise(function (resolve, reject) {
    var _executionContext = Object.assign(executionContext, {
      __innerCb: _promiseErrorHandler(resolve, reject)
    });

    ccFn(userLogicFn, _executionContext, payload);
  })["catch"](_catchCcError["default"]);
}

function __promisifiedInvokeWith(userLogicFn, executionContext, payload) {
  return _promisifyCcFn(invokeWith, userLogicFn, executionContext, payload);
}

function __invoke(userLogicFn, option, payload) {
  var callerRef = option.callerRef,
      delay = option.delay,
      renderKey = option.renderKey,
      calledBy = option.calledBy,
      module = option.module,
      chainId = option.chainId,
      oriChainId = option.oriChainId,
      chainId_depth_ = option.chainId_depth_,
      isSilent = option.isSilent;
  return __promisifiedInvokeWith(userLogicFn, {
    callerRef: callerRef,
    context: true,
    module: module,
    calledBy: calledBy,
    fnName: userLogicFn.name,
    delay: delay,
    renderKey: renderKey,
    chainId: chainId,
    oriChainId: oriChainId,
    chainId_depth_: chainId_depth_,
    isSilent: isSilent
  }, payload);
}

function makeCcSetStateHandler(ref, containerRef) {
  return function (state, cb, shouldCurrentRefUpdate) {
    var refCtx = ref.ctx;
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

    var newFullState = Object.assign({}, refCtx.state, state);
    refCtx.state = newFullState;
    if (containerRef) containerRef.state = newFullState; // 只有Hook实例，才能直接更新ref.state

    if (refCtx.type === _constant.CC_HOOK) {
      ref.state = newFullState;
    }
    /** start update ui */


    if (shouldCurrentRefUpdate) {
      refCtx.renderCount += 1;
      refCtx.reactSetState(state, cb);
    } else {
      //对与class实例来说，视图虽然没有更新，但是state要合并进来，让下一次即将到来的更新里能拿到之前的状态
      //否则watch启用的return false优化会造成状态丢失
      if (refCtx.type !== _constant.CC_HOOK) {
        Object.assign(ref.state, state);
      }
    }
  };
}

function makeCcForceUpdateHandler(ref) {
  return function (cb) {
    var refCtx = ref.ctx;
    refCtx.renderCount += 1;
    refCtx.reactForceUpdate(cb);
  };
} // last param: chainData


function makeInvokeHandler(callerRef, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      chainId = _ref.chainId,
      oriChainId = _ref.oriChainId,
      isLazy = _ref.isLazy,
      _ref$delay = _ref.delay,
      delay = _ref$delay === void 0 ? -1 : _ref$delay,
      _ref$isSilent = _ref.isSilent,
      isSilent = _ref$isSilent === void 0 ? false : _ref$isSilent,
      _ref$chainId_depth_ = _ref.chainId_depth_,
      chainId_depth_ = _ref$chainId_depth_ === void 0 ? {} : _ref$chainId_depth_;

  return function (firstParam, payload, inputRKey, inputDelay) {
    var _isLazy = isLazy,
        _isSilent = isSilent;

    var _renderKey = '',
        _delay = inputDelay != undefined ? inputDelay : delay;

    if (isPJO(inputRKey)) {
      var lazy = inputRKey.lazy,
          silent = inputRKey.silent,
          renderKey = inputRKey.renderKey,
          _delay2 = inputRKey.delay;
      lazy !== undefined && (_isLazy = lazy);
      silent !== undefined && (_isSilent = silent);
      renderKey !== undefined && (_renderKey = renderKey);
      _delay2 !== undefined && (_delay = _delay2);
    } else {
      _renderKey = inputRKey;
    }

    var _getNewChainData = getNewChainData(_isLazy, chainId, oriChainId, chainId_depth_),
        _chainId = _getNewChainData._chainId,
        _oriChainId = _getNewChainData._oriChainId;

    var firstParamType = typeof firstParam;
    var option = {
      callerRef: callerRef,
      calledBy: _constant.INVOKE,
      module: callerRef.ctx.module,
      isSilent: _isSilent,
      chainId: _chainId,
      oriChainId: _oriChainId,
      chainId_depth_: chainId_depth_,
      delay: _delay,
      renderKey: _renderKey
    };
    var err = new Error("param type error, correct usage: invoke(userFn:function, ...args:any[]) or invoke(option:[module:string, fn:function], ...args:any[])");

    if (firstParamType === 'function') {
      // 可能用户直接使用invoke调用了reducer函数
      if (firstParam.__fnName) firstParam.name = firstParam.__fnName; // 这里不修改option.module，concent明确定义了dispatch和invoke规则

      /**
        invoke调用函数引用时
        无论组件有无注册模块，一定走调用方模块
         dispatch调用函数引用时
        优先走函数引用的模块（此时函数是一个reducer函数），没有(此函数不是reducer函数)则走调用方的模块并降级为invoke调用
       */
      // if (firstParam.__stateModule) option.module = firstParam.__stateModule;

      return __invoke(firstParam, option, payload);
    } else if (firstParamType === 'object') {
      var _fn, _module;

      if (Array.isArray(firstParam)) {
        var module = firstParam[0],
            fn = firstParam[1];
        _fn = fn;
        _module = module;
      } else {
        var _module2 = firstParam.module,
            _fn2 = firstParam.fn;
        _fn = _fn2;
        _module = _module2;
      }

      if (typeof _fn != 'function') throw err;
      if (_module) option.module = _module; //某个模块的实例修改了另外模块的数据

      return __invoke(_fn, option, payload);
    } else {
      throw err;
    }
  };
}

function invokeWith(userLogicFn, executionContext, payload) {
  var callerRef = executionContext.callerRef;
  var callerModule = callerRef.ctx.module;
  var _executionContext$mod = executionContext.module,
      targetModule = _executionContext$mod === void 0 ? callerModule : _executionContext$mod,
      _executionContext$con = executionContext.context,
      context = _executionContext$con === void 0 ? false : _executionContext$con,
      cb = executionContext.cb,
      __innerCb = executionContext.__innerCb,
      type = executionContext.type,
      calledBy = executionContext.calledBy,
      fnName = executionContext.fnName,
      _executionContext$del = executionContext.delay,
      delay = _executionContext$del === void 0 ? -1 : _executionContext$del,
      renderKey = executionContext.renderKey,
      chainId = executionContext.chainId,
      oriChainId = executionContext.oriChainId,
      chainId_depth_ = executionContext.chainId_depth_,
      isSilent = executionContext.isSilent;
  isStateModuleValid(targetModule, callerModule, cb, function (err, newCb) {
    if (err) return handleCcFnError(err, __innerCb);
    var moduleState = getState(targetModule);
    var actionContext = {};
    var isSourceCall = false;
    isSourceCall = chainId === oriChainId && chainId_depth_[chainId] === 1;

    if (context) {
      //调用前先加1
      chainId_depth_[chainId] = chainId_depth_[chainId] + 1; // !!!makeDispatchHandler的dispatch lazyDispatch将源头的isSilent 一致透传下去

      var _dispatch = makeDispatchHandler(callerRef, false, isSilent, targetModule, renderKey, delay, chainId, oriChainId, chainId_depth_);

      var silentDispatch = makeDispatchHandler(callerRef, false, true, targetModule, renderKey, delay, chainId, oriChainId, chainId_depth_);
      var lazyDispatch = makeDispatchHandler(callerRef, true, isSilent, targetModule, renderKey, delay, chainId, oriChainId, chainId_depth_); // const sourceClassContext = ccClassKey_ccClassContext_[callerRef.ctx.ccClassKey];
      //oriChainId, chainId_depth_ 一直携带下去，设置isLazy，会重新生成chainId

      var invoke = makeInvokeHandler(callerRef, {
        delay: delay,
        chainId: chainId,
        oriChainId: oriChainId,
        chainId_depth_: chainId_depth_
      });
      var lazyInvoke = makeInvokeHandler(callerRef, {
        isLazy: true,
        delay: delay,
        oriChainId: oriChainId,
        chainId_depth_: chainId_depth_
      });
      var silentInvoke = makeInvokeHandler(callerRef, {
        isLazy: false,
        delay: delay,
        isSilent: true,
        oriChainId: oriChainId,
        chainId_depth_: chainId_depth_
      }); // 首次调用时是undefined，这里做个保护

      var committedStateMap = (0, _chain.getAllChainStateMap)(chainId) || {};
      var committedState = committedStateMap[targetModule] || {};
      actionContext = {
        module: targetModule,
        callerModule: callerModule,
        committedStateMap: committedStateMap,
        //一次ref dispatch调用，所经过的所有reducer的返回结果收集
        committedState: committedState,
        invoke: invoke,
        lazyInvoke: lazyInvoke,
        silentInvoke: silentInvoke,
        invokeLazy: lazyInvoke,
        invokeSilent: silentInvoke,
        dispatch: _dispatch,
        lazyDispatch: lazyDispatch,
        silentDispatch: silentDispatch,
        dispatchLazy: lazyDispatch,
        dispatchSilent: silentDispatch,
        rootState: getState(),
        globalState: getState(_constant.MODULE_GLOBAL),
        //指的是目标模块的state
        moduleState: moduleState,
        //指的是目标模块的的moduleComputed
        moduleComputed: _computedValue[targetModule] || {},
        // //!!!指的是调用源cc类的connectedState
        // connectedState: sourceClassContext.connectedState,
        // //!!!指的是调用源cc类的connectedComputed
        // connectedComputed: sourceClassContext.connectedComputed,
        //利用dispatch调用自动生成的setState
        setState: function setState(state) {
          return _dispatch('setState', state, {
            silent: isSilent,
            renderKey: renderKey,
            delay: delay
          });
        },
        //透传上下文参数给IDispatchOptions,
        //!!!指的是调用源cc类实例的ctx
        refCtx: callerRef.ctx // concent不鼓励用户在reducer使用ref相关数据书写业务逻辑，除非用户确保是同一个模块的实例触发调用该函数，
        // 因为不同调用方传递不同的refCtx值，会引起用户不注意的bug

      };
    }

    if (isSilent === false) {
      (0, _plugin.send)(_constant.SIG_FN_START, {
        isSourceCall: isSourceCall,
        calledBy: calledBy,
        module: targetModule,
        chainId: chainId,
        fn: userLogicFn
      });
    }

    var firstStepCall = new Promise(function (r) {
      return r(userLogicFn(payload, moduleState, actionContext));
    });
    firstStepCall.then(function (partialState) {
      chainId_depth_[chainId] = chainId_depth_[chainId] - 1; //调用结束减1

      var curDepth = chainId_depth_[chainId];
      var isFirstDepth = curDepth === 1; //调用结束就记录

      (0, _chain.setAllChainState)(chainId, targetModule, partialState);
      var commitStateList = [];

      if (isSilent === false) {
        (0, _plugin.send)(_constant.SIG_FN_END, {
          isSourceCall: isSourceCall,
          calledBy: calledBy,
          module: targetModule,
          chainId: chainId,
          fn: userLogicFn
        }); // targetModule, sourceModule相等与否不用判断了，chainState里按模块为key去记录提交到不同模块的state

        if ((0, _chain.isChainIdLazy)(chainId)) {
          //来自于惰性派发的调用
          if (!isFirstDepth) {
            // 某条链还在往下调用中，没有回到第一层，暂存状态，直到回到第一层才提交
            (0, _chain.setChainState)(chainId, targetModule, partialState);
          } else {
            // 合并状态一次性提交到store并派发到组件实例
            if ((0, _chain.isChainExited)(chainId)) {//丢弃本次状态，不做任何处理
            } else {
              commitStateList = (0, _chain.setAndGetChainStateList)(chainId, targetModule, partialState);
              (0, _chain.removeChainState)(chainId);
            }
          }
        } else {
          commitStateList = [{
            module: targetModule,
            state: partialState
          }];
        }
      }

      commitStateList.forEach(function (v) {
        if (v.state) {
          (0, _changeRefState["default"])(v.state, {
            renderKey: renderKey,
            module: v.module,
            reactCallback: newCb,
            type: type,
            calledBy: calledBy,
            fnName: fnName,
            delay: delay,
            payload: payload
          }, callerRef);
        }
      });

      if (isSourceCall) {
        //源头dispatch or invoke结束调用
        (0, _chain.removeChainState)(chainId);
        (0, _chain.removeAllChainState)(chainId);
      }

      if (__innerCb) __innerCb(null, partialState);
    })["catch"](function (err) {
      (0, _plugin.send)(_constant.SIG_FN_ERR, {
        isSourceCall: isSourceCall,
        calledBy: calledBy,
        module: targetModule,
        chainId: chainId,
        fn: userLogicFn
      });
      handleCcFnError(err, __innerCb);
    });
  });
}

function dispatch(_temp2) {
  var _ref2 = _temp2 === void 0 ? {} : _temp2,
      callerRef = _ref2.callerRef,
      inputModule = _ref2.module,
      renderKey = _ref2.renderKey,
      isSilent = _ref2.isSilent,
      type = _ref2.type,
      payload = _ref2.payload,
      reactCallback = _ref2.cb,
      __innerCb = _ref2.__innerCb,
      _ref2$delay = _ref2.delay,
      delay = _ref2$delay === void 0 ? -1 : _ref2$delay,
      chainId = _ref2.chainId,
      oriChainId = _ref2.oriChainId,
      chainId_depth_ = _ref2.chainId_depth_;

  var targetReducerMap = _reducer[inputModule];

  if (!targetReducerMap) {
    return __innerCb(new Error("no reducerMap found for module:[" + inputModule + "]"));
  }

  var reducerFn = targetReducerMap[type];

  if (!reducerFn) {
    var fns = Object.keys(targetReducerMap);
    return __innerCb(new Error("no reducer fn found for [" + inputModule + "/" + type + "], is these fn you want:" + fns));
  }

  var executionContext = {
    callerRef: callerRef,
    module: inputModule,
    type: type,
    cb: reactCallback,
    context: true,
    __innerCb: __innerCb,
    calledBy: _constant.DISPATCH,
    delay: delay,
    renderKey: renderKey,
    isSilent: isSilent,
    chainId: chainId,
    oriChainId: oriChainId,
    chainId_depth_: chainId_depth_
  };
  invokeWith(reducerFn, executionContext, payload);
}

function makeDispatchHandler(callerRef, in_isLazy, in_isSilent, defaultModule, defaultRenderKey, delay, chainId, oriChainId, chainId_depth_ // sourceModule, oriChainId, oriChainDepth
) {
  if (defaultRenderKey === void 0) {
    defaultRenderKey = '';
  }

  if (delay === void 0) {
    delay = -1;
  }

  if (chainId_depth_ === void 0) {
    chainId_depth_ = {};
  }

  return function (paramObj, payload, userInputRKey, userInputDelay) {
    if (paramObj === void 0) {
      paramObj = {};
    }

    var isLazy = in_isLazy,
        isSilent = in_isSilent;
    var _renderKey = '';

    var _delay = userInputDelay || delay;

    if (isPJO(userInputRKey)) {
      _renderKey = defaultRenderKey;
      var lazy = userInputRKey.lazy,
          silent = userInputRKey.silent,
          renderKey = userInputRKey.renderKey,
          _delay3 = userInputRKey.delay;
      lazy !== undefined && (isLazy = lazy);
      silent !== undefined && (isSilent = silent);
      renderKey !== undefined && (_renderKey = renderKey);
      _delay3 !== undefined && (_delay = _delay3);
    } else {
      _renderKey = userInputRKey || defaultRenderKey;
    }

    var _getNewChainData2 = getNewChainData(isLazy, chainId, oriChainId, chainId_depth_),
        _chainId = _getNewChainData2._chainId,
        _oriChainId = _getNewChainData2._oriChainId;

    var paramObjType = typeof paramObj;

    var _type, _cb;

    var _module = defaultModule;

    var callInvoke = function callInvoke() {
      var iHandler = makeInvokeHandler(callerRef, {
        chainId: _chainId,
        oriChainId: _oriChainId,
        isLazy: isLazy,
        chainId_depth_: chainId_depth_
      });
      return iHandler(paramObj, payload, _renderKey, _delay);
    };

    if (paramObjType && paramObjType === 'object') {
      if (Array.isArray(paramObjType)) {
        return callInvoke();
      }

      var _paramObj = paramObj,
          module = _paramObj.module,
          type = _paramObj.type,
          cb = _paramObj.cb;
      if (module) _module = module;
      _type = type;
      _cb = cb;
    } else if (paramObjType === 'string' || paramObjType === 'function') {
      var targetFirstParam = paramObj;

      if (paramObjType === 'function') {
        var fnName = paramObj.__fnName;

        if (!fnName) {
          // 此函数是一个普通函数，没有配置到某个模块的reducer里，降级为invoke调用
          return callInvoke(); // throw new Error('you are calling a unnamed function!!!');
        }

        targetFirstParam = fnName; // 这里非常重要，只有处于第一层的调用时，才获取函数对象上的__stateModule参数
        // 防止克隆自模块a的模块b在reducer文件里基于函数引用直接调用时，取的是a的模块相关参数了，但是源头由b发起，应该是b才对

        if (chainId_depth_[_oriChainId] == 1) {
          // let dispatch can apply reducer function directly!!!
          // !!! 如果用户在b模块的组件里dispatch直接调用a模块的函数，但是确实想修改的是b模块的数据，只是想复用a模块的那个函数的逻辑
          // 那么千万要注意，写为{module:'b', fn:xxxFoo}的模式
          _module = paramObj.__stateModule;
        }
      }

      var slashCount = targetFirstParam.split('').filter(function (v) {
        return v === '/';
      }).length;

      if (slashCount === 0) {
        _type = targetFirstParam;
      } else if (slashCount === 1) {
        var _targetFirstParam$spl = targetFirstParam.split('/'),
            _module3 = _targetFirstParam$spl[0],
            _type2 = _targetFirstParam$spl[1];

        if (_module3) _module = _module3; //targetFirstParam may like: /foo/changeName

        _type = _type2;
      } else {
        return Promise.reject(me(_constant.ERR.CC_DISPATCH_STRING_INVALID, vbi(targetFirstParam)));
      }
    } else {
      return Promise.reject(me(_constant.ERR.CC_DISPATCH_PARAM_INVALID));
    }

    if (_module === '*') {
      return Promise.reject('cc instance api dispatch do not support multi dispatch, please use top api[cc.dispatch] instead!');
    }

    var p = new Promise(function (resolve, reject) {
      dispatch({
        callerRef: callerRef,
        module: _module,
        type: _type,
        payload: payload,
        cb: _cb,
        __innerCb: _promiseErrorHandler(resolve, reject),
        delay: _delay,
        renderKey: _renderKey,
        isSilent: isSilent,
        chainId: _chainId,
        oriChainId: _oriChainId,
        chainId_depth_: chainId_depth_ // oriChainId: _oriChainId, oriChainDepth: _oriChainDepth, sourceModule: _sourceModule,

      });
    })["catch"](_catchCcError["default"]);
    return p;
  };
} // for module/init method


function makeSetStateHandler(module) {
  return function (state) {
    try {
      (0, _setState["default"])(module, state);
    } catch (err) {
      if (module === _constant.MODULE_GLOBAL) {
        (0, _getAndStoreValidGlobalState["default"])(state, module);
      } else {
        var moduleState = getState(module);

        if (!moduleState) {
          return util.justWarning("invalid module " + module);
        }

        var keys = util.okeys(moduleState);

        var _extractStateByKeys = (0, _extractStateByKeys2["default"])(state, keys),
            partialState = _extractStateByKeys.partialState,
            isStateEmpty = _extractStateByKeys.isStateEmpty;

        if (!isStateEmpty) storeSetState(module, partialState); //store this valid state;
      }

      util.justTip("no ccInstance found for module[" + module + "] currently, cc will just store it, lately ccInstance will pick this state to render");
    }
  };
}
/** avoid  Circular dependency, move this fn to util */
// export function makeCommitHandler(module, refCtx) {}