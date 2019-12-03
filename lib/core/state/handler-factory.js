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

var _co = _interopRequireDefault(require("co"));

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
    okeys = util.okeys;
var _ccContext$store = _ccContext["default"].store,
    getState = _ccContext$store.getState,
    storeSetState = _ccContext$store.setState,
    _reducer = _ccContext["default"].reducer._reducer,
    _computedValue = _ccContext["default"].computed._computedValue,
    ccClassKey_ccClassContext_ = _ccContext["default"].ccClassKey_ccClassContext_;
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
  return "if you pass param reactCallback, param module must equal current CCInstance's module, module: " + module + ", CCInstance's module:" + currentModule + ", now the cb will never been triggered! ";
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
} // any error in this function will not been throwed, cc just warning, 


function isStateModuleValid(inputModule, currentModule, reactCallback, cb) {
  var targetCb = reactCallback;

  if (checkStoreModule(inputModule, false)) {
    if (inputModule !== currentModule) {
      if (reactCallback) {
        justWarning(me(_constant.ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID, vbi(paramCallBackShouldNotSupply(inputModule, currentModule))));
        targetCb = null; //let user's reactCallback has no chance to be triggered
      }
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
  var targetRef = option.targetRef,
      delay = option.delay,
      renderKey = option.renderKey,
      calledBy = option.calledBy,
      module = option.module,
      chainId = option.chainId,
      oriChainId = option.oriChainId,
      chainId_depth_ = option.chainId_depth_,
      isSilent = option.isSilent;
  return __promisifiedInvokeWith(userLogicFn, {
    targetRef: targetRef,
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

    if (refCtx.type === _constant.CC_HOOK_PREFIX) {
      ref.state = newFullState;
    }
    /** start update ui */


    if (shouldCurrentRefUpdate) {
      refCtx.renderCount += 1;
      refCtx.reactSetState(state, cb);
    } else {
      //对与class实例来说，视图虽然没有更新，但是state要合并进来，让下一次即将到来的更新里能拿到之前的状态
      //否则watch启用的return false优化会造成状态丢失
      if (refCtx.type !== _constant.CC_HOOK_PREFIX) {
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


function makeInvokeHandler(targetRef, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      chainId = _ref.chainId,
      oriChainId = _ref.oriChainId,
      isLazy = _ref.isLazy,
      _ref$isSilent = _ref.isSilent,
      isSilent = _ref$isSilent === void 0 ? false : _ref$isSilent,
      _ref$chainId_depth_ = _ref.chainId_depth_,
      chainId_depth_ = _ref$chainId_depth_ === void 0 ? {} : _ref$chainId_depth_;

  return function (firstParam, payload, renderKey, delay) {
    var _getNewChainData = getNewChainData(isLazy, chainId, oriChainId, chainId_depth_),
        _chainId = _getNewChainData._chainId,
        _oriChainId = _getNewChainData._oriChainId;

    var firstParamType = typeof firstParam;
    var option = {
      targetRef: targetRef,
      calledBy: _constant.INVOKE,
      module: targetRef.ctx.module,
      isSilent: isSilent,
      chainId: _chainId,
      oriChainId: _oriChainId,
      chainId_depth_: chainId_depth_,
      delay: delay,
      renderKey: renderKey
    };
    var err = new Error("param type error, correct usage: invoke(userFn:function, ...args:any[]) or invoke(option:[module:string, fn:function], ...args:any[])");

    if (firstParamType === 'function') {
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
  var targetRef = executionContext.targetRef;
  var _curStateModule = targetRef.ctx.module;
  var _executionContext$mod = executionContext.module,
      targetModule = _executionContext$mod === void 0 ? _curStateModule : _executionContext$mod,
      _executionContext$con = executionContext.context,
      context = _executionContext$con === void 0 ? false : _executionContext$con,
      cb = executionContext.cb,
      __innerCb = executionContext.__innerCb,
      type = executionContext.type,
      reducerModule = executionContext.reducerModule,
      calledBy = executionContext.calledBy,
      fnName = executionContext.fnName,
      _executionContext$del = executionContext.delay,
      delay = _executionContext$del === void 0 ? -1 : _executionContext$del,
      renderKey = executionContext.renderKey,
      chainId = executionContext.chainId,
      oriChainId = executionContext.oriChainId,
      chainId_depth_ = executionContext.chainId_depth_,
      isSilent = executionContext.isSilent;
  isStateModuleValid(targetModule, _curStateModule, cb, function (err, newCb) {
    if (err) return handleCcFnError(err, __innerCb);
    var moduleState = getState(targetModule);
    var actionContext = {};
    var isSourceCall = false;

    if (context) {
      isSourceCall = chainId === oriChainId && chainId_depth_[chainId] === 1; //调用前先加1

      chainId_depth_[chainId] = chainId_depth_[chainId] + 1;

      var _dispatch = makeDispatchHandler(targetRef, false, false, targetModule, reducerModule, renderKey, -1, chainId, oriChainId, chainId_depth_);

      var silentDispatch = makeDispatchHandler(targetRef, false, true, targetModule, reducerModule, renderKey, -1, chainId, oriChainId, chainId_depth_);
      var lazyDispatch = makeDispatchHandler(targetRef, true, false, targetModule, reducerModule, renderKey, -1, chainId, oriChainId, chainId_depth_); // const sourceClassContext = ccClassKey_ccClassContext_[targetRef.ctx.ccClassKey];
      //oriChainId, chainId_depth_ 一直携带下去，设置isLazy，会重新生成chainId

      var invoke = makeInvokeHandler(targetRef, {
        chainId: chainId,
        oriChainId: oriChainId,
        chainId_depth_: chainId_depth_
      });
      var lazyInvoke = makeInvokeHandler(targetRef, {
        isLazy: true,
        oriChainId: oriChainId,
        chainId_depth_: chainId_depth_
      });
      var silentInvoke = makeInvokeHandler(targetRef, {
        isLazy: false,
        isSilent: true,
        oriChainId: oriChainId,
        chainId_depth_: chainId_depth_
      });
      actionContext = {
        targetModule: targetModule,
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
          return _dispatch('setState', state);
        },
        //!!!指的是调用源cc类实例的ctx
        refCtx: targetRef.ctx // concent不鼓励用户在reducer使用ref相关数据书写业务逻辑，除非用户确保是同一个模块的实例触发调用该函数，
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

    _co["default"].wrap(userLogicFn)(payload, moduleState, actionContext).then(function (partialState) {
      chainId_depth_[chainId] = chainId_depth_[chainId] - 1; //调用结束减1

      var curDepth = chainId_depth_[chainId];
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
          if (curDepth > 1) {
            //某条链还在往下调用中，没有回到第一层，暂存状态，直到回到第一层才提交
            (0, _chain.setChainState)(chainId, targetModule, partialState);
          } else {
            // chainDepth === 1, 合并状态一次性提交到store并派发到组件实例
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
            reducerModule: reducerModule,
            calledBy: calledBy,
            fnName: fnName,
            delay: delay
          }, targetRef);
        }
      });
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
      targetRef = _ref2.targetRef,
      inputModule = _ref2.module,
      inputReducerModule = _ref2.reducerModule,
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

  var targetReducerMap = _reducer[inputReducerModule];

  if (!targetReducerMap) {
    return __innerCb(new Error("no reducerMap found for reducer module:" + inputReducerModule));
  }

  var reducerFn = targetReducerMap[type];

  if (!reducerFn) {
    var fns = Object.keys(targetReducerMap);
    return __innerCb(new Error("no reducer defined in ccContext for reducer module:" + inputReducerModule + " type:" + type + ", maybe you want to invoke one of them:" + fns));
  } // const errMsg = util.isCcActionValid({ type, payload });
  // if (errMsg) return justWarning(errMsg);


  var executionContext = {
    targetRef: targetRef,
    module: inputModule,
    reducerModule: inputReducerModule,
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

function makeDispatchHandler(targetRef, isLazy, isSilent, defaultModule, defaultReducerModule, defaultRenderKey, delay, chainId, oriChainId, chainId_depth_ // sourceModule, oriChainId, oriChainDepth
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

    var _getNewChainData2 = getNewChainData(isLazy, chainId, oriChainId, chainId_depth_),
        _chainId = _getNewChainData2._chainId,
        _oriChainId = _getNewChainData2._oriChainId;

    var paramObjType = typeof paramObj;

    var _type, _cb;

    var _module = defaultModule;
    var _reducerModule = defaultReducerModule;

    var _delay = userInputDelay || delay;

    var _renderKey = userInputRKey || defaultRenderKey;

    var callInvoke = function callInvoke() {
      var iHandler = makeInvokeHandler(targetRef, {
        chainId: _chainId,
        oriChainId: _oriChainId,
        isLazy: isLazy,
        chainId_depth_: chainId_depth_
      });
      return iHandler(paramObj, payload, _renderKey, _delay);
    };

    if (paramObjType === 'object') {
      if (Array.isArray(paramObjType)) {
        return callInvoke();
      }

      var _paramObj = paramObj,
          module = _paramObj.module,
          reducerModule = _paramObj.reducerModule,
          type = _paramObj.type,
          cb = _paramObj.cb;
      if (module) _module = module;
      _reducerModule = reducerModule || module || defaultReducerModule;
      _type = type;
      _cb = cb;
    } else if (paramObjType === 'string' || paramObjType === 'function') {
      var targetFirstParam = paramObj;

      if (paramObjType === 'function') {
        var fnName = paramObj.__fnName;

        if (!fnName) {
          return callInvoke(); // throw new Error('you are calling a unnamed function!!!');
        }

        targetFirstParam = fnName; // 这里非常重要，只有处于第一层的调用时，才获取函数对象上的__stateModule __reducerModule参数
        // 防止克隆自模块a的模块b在reducer文件里基于函数引用直接调用时，取的是a的模块相关参数了，但是源头由b发起，应该是b才对

        if (chainId_depth_[_oriChainId] == 1) {
          // let dispatch can apply reducer function directly!!!
          // !!! 如果用户在b模块的组件里dispatch直接调用a模块的函数，但是确实想修改的是b模块的数据，只是想复用a模块的那个函数的逻辑
          // 那么千万要注意，写为{module:'b', fn:xxxFoo}的模式
          _module = paramObj.__stateModule;
          _reducerModule = paramObj.__reducerModule;
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

        _module = _module3;
        _reducerModule = _module;
        _type = _type2;
      } else if (slashCount === 2) {
        var _targetFirstParam$spl2 = targetFirstParam.split('/'),
            _module4 = _targetFirstParam$spl2[0],
            _reducerModule2 = _targetFirstParam$spl2[1],
            _type3 = _targetFirstParam$spl2[2];

        if (_module4) _module = _module4; //targetFirstParam may like: /foo/changeName

        _reducerModule = _reducerModule2;
        _type = _type3;
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
        targetRef: targetRef,
        module: _module,
        reducerModule: _reducerModule,
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