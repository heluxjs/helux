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
      ccKey = option.ccKey,
      ccUniqueKey = option.ccUniqueKey,
      ccClassKey = option.ccClassKey,
      delay = option.delay,
      renderKey = option.renderKey,
      calledBy = option.calledBy,
      module = option.module,
      chainId = option.chainId,
      oriChainId = option.oriChainId,
      chainId_depth_ = option.chainId_depth_;
  return __promisifiedInvokeWith(userLogicFn, {
    targetRef: targetRef,
    ccKey: ccKey,
    ccUniqueKey: ccUniqueKey,
    context: true,
    module: module,
    ccClassKey: ccClassKey,
    calledBy: calledBy,
    fnName: userLogicFn.name,
    delay: delay,
    renderKey: renderKey,
    chainId: chainId,
    oriChainId: oriChainId,
    chainId_depth_: chainId_depth_
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
    if (containerRef) containerRef.state = newFullState; // 除了Hook实例，这里都不直接赋值，交给reactSetState去更新ref.state

    if (refCtx.type === _constant.CC_HOOK_PREFIX) {
      ref.state = newFullState;
    }
    /** start update ui */


    if (shouldCurrentRefUpdate) {
      refCtx.renderCount += 1;
      refCtx.reactSetState(state, cb);
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


function makeInvokeHandler(targetRef, ccKey, ccUniqueKey, ccClassKey, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      chainId = _ref.chainId,
      oriChainId = _ref.oriChainId,
      isLazy = _ref.isLazy,
      _ref$chainId_depth_ = _ref.chainId_depth_,
      chainId_depth_ = _ref$chainId_depth_ === void 0 ? {} : _ref$chainId_depth_;

  return function (firstParam, payload, delay, renderKey) {
    var _getNewChainData = getNewChainData(isLazy, chainId, oriChainId, chainId_depth_),
        _chainId = _getNewChainData._chainId,
        _oriChainId = _getNewChainData._oriChainId;

    var firstParamType = typeof firstParam;
    var option = {
      targetRef: targetRef,
      ccKey: ccKey,
      ccUniqueKey: ccUniqueKey,
      ccClassKey: ccClassKey,
      calledBy: _constant.INVOKE,
      module: targetRef.ctx.module,
      chainId: _chainId,
      oriChainId: _oriChainId,
      chainId_depth_: chainId_depth_,
      delay: delay,
      renderKey: renderKey
    };
    var err = new Error("param type error, correct usage: invoke(userFn:function, ...args:any[]) or invoke(option:{fn:function, delay:number, renderKey:string}, ...args:any[])");

    if (firstParamType === 'function') {
      return __invoke(firstParam, option, payload);
    } else if (firstParamType === 'object') {
      //firstParam: {fn:function, delay:number, renderKey:string}
      // const { fn, ...option } = firstParam;//防止某些版本的create-react-app运行瓷出错，这里不采用对象延展符的写法
      var fn = firstParam.fn,
          userInputModule = firstParam.module;
      if (typeof fn != 'function') throw err;
      if (userInputModule) option.module = userInputModule; //用某个模块的实例去修改另外模块的数据

      return __invoke(fn, option, payload);
    } else {
      throw err;
    } // return ()=>{}

  };
}

function invokeWith(userLogicFn, executionContext, payload) {
  //ccKey ccClassKey 表示调用源头组件的ccKey和ccClassKey
  var targetRef = executionContext.targetRef;
  var _curStateModule = targetRef.ctx.module;
  var ccKey = executionContext.ccKey,
      ccUniqueKey = executionContext.ccUniqueKey,
      ccClassKey = executionContext.ccClassKey,
      _executionContext$mod = executionContext.module,
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
      chainId_depth_ = executionContext.chainId_depth_;
  isStateModuleValid(targetModule, _curStateModule, cb, function (err, newCb) {
    if (err) return handleCcFnError(err, __innerCb);
    var moduleState = getState(targetModule);
    var reducerContext = {};
    var isSourceCall = false;

    if (context) {
      isSourceCall = chainId === oriChainId && chainId_depth_[chainId] === 1; //调用前先加1

      chainId_depth_[chainId] = chainId_depth_[chainId] + 1;

      var _dispatch = makeDispatchHandler(targetRef, false, ccKey, ccUniqueKey, ccClassKey, targetModule, reducerModule, -1, renderKey, chainId, oriChainId, chainId_depth_);

      var lazyDispatch = makeDispatchHandler(targetRef, true, ccKey, ccUniqueKey, ccClassKey, targetModule, reducerModule, -1, renderKey, chainId, oriChainId, chainId_depth_);
      var sourceClassContext = ccClassKey_ccClassContext_[ccClassKey];
      reducerContext = {
        targetModule: targetModule,
        invoke: makeInvokeHandler(targetRef, ccKey, ccUniqueKey, ccClassKey, {
          chainId: chainId,
          oriChainId: oriChainId,
          chainId_depth_: chainId_depth_
        }),
        //oriChainId, chainId_depth_ 一直携带下去，设置isLazy，会重新生成chainId
        lazyInvoke: makeInvokeHandler(targetRef, ccKey, ccUniqueKey, ccClassKey, {
          isLazy: true,
          oriChainId: oriChainId,
          chainId_depth_: chainId_depth_
        }),
        dispatch: _dispatch,
        lazyDispatch: lazyDispatch,
        rootState: getState(),
        globalState: getState(_constant.MODULE_GLOBAL),
        //指的是目标模块的state
        moduleState: moduleState,
        //指的是目标模块的的moduleComputed
        moduleComputed: _computedValue[targetModule],
        //!!!指的是调用源cc类的connectedState
        connectedState: sourceClassContext.connectedState,
        //!!!指的是调用源cc类的connectedComputed
        connectedComputed: sourceClassContext.connectedComputed,
        //!!!指的是调用源cc类实例的ctx
        refCtx: targetRef.ctx // concent不鼓励用户在reducer使用ref相关数据书写业务逻辑，除非用户确保是同一个模块的实例触发调用该函数，
        // 因为不同调用方传递不同的refCtx值，会引起用户不注意的bug

      };
    }

    (0, _plugin.send)(_constant.SIG_FN_START, {
      isSourceCall: isSourceCall,
      calledBy: calledBy,
      module: targetModule,
      chainId: chainId,
      fn: userLogicFn
    });

    _co["default"].wrap(userLogicFn)(payload, moduleState, reducerContext).then(function (partialState) {
      chainId_depth_[chainId] = chainId_depth_[chainId] - 1; //调用结束减1

      var curDepth = chainId_depth_[chainId];
      var commitStateList = [];
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

      commitStateList.forEach(function (v) {
        (0, _changeRefState["default"])(v.state, {
          renderKey: renderKey,
          ccKey: ccKey,
          ccUniqueKey: ccUniqueKey,
          module: v.module,
          cb: newCb,
          type: type,
          reducerModule: reducerModule,
          calledBy: calledBy,
          fnName: fnName,
          delay: delay
        }, targetRef);
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
      ccKey = _ref2.ccKey,
      ccUniqueKey = _ref2.ccUniqueKey,
      ccClassKey = _ref2.ccClassKey,
      inputModule = _ref2.module,
      inputReducerModule = _ref2.reducerModule,
      renderKey = _ref2.renderKey,
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


  isStateModuleValid(inputModule, targetRef.ctx.module, reactCallback, function (err, newCb) {
    if (err) return __innerCb(err);
    var executionContext = {
      targetRef: targetRef,
      ccKey: ccKey,
      ccClassKey: ccClassKey,
      ccUniqueKey: ccUniqueKey,
      module: inputModule,
      reducerModule: inputReducerModule,
      type: type,
      cb: newCb,
      context: true,
      __innerCb: __innerCb,
      calledBy: _constant.DISPATCH,
      delay: delay,
      renderKey: renderKey,
      chainId: chainId,
      oriChainId: oriChainId,
      chainId_depth_: chainId_depth_
    };
    invokeWith(reducerFn, executionContext, payload);
  });
}

function makeDispatchHandler(targetRef, isLazy, ccKey, ccUniqueKey, ccClassKey, defaultModule, defaultReducerModule, delay, defaultRenderKey, chainId, oriChainId, chainId_depth_ // sourceModule, oriChainId, oriChainDepth
) {
  if (delay === void 0) {
    delay = -1;
  }

  if (defaultRenderKey === void 0) {
    defaultRenderKey = '';
  }

  if (chainId_depth_ === void 0) {
    chainId_depth_ = {};
  }

  return function (paramObj, payloadWhenFirstParamIsString, userInputDelay, userInputRKey) {
    if (paramObj === void 0) {
      paramObj = {};
    }

    var _getNewChainData2 = getNewChainData(isLazy, chainId, oriChainId, chainId_depth_),
        _chainId = _getNewChainData2._chainId,
        _oriChainId = _getNewChainData2._oriChainId;

    var paramObjType = typeof paramObj;

    var _module = defaultModule,
        _reducerModule,
        _type,
        _payload,
        _cb,
        _delay = delay;

    var _renderKey = defaultRenderKey;

    if (paramObjType === 'object') {
      var _paramObj = paramObj,
          _paramObj$module = _paramObj.module,
          module = _paramObj$module === void 0 ? defaultModule : _paramObj$module,
          reducerModule = _paramObj.reducerModule,
          type = _paramObj.type,
          payload = _paramObj.payload,
          cb = _paramObj.cb,
          _paramObj$delay = _paramObj.delay,
          _delay2 = _paramObj$delay === void 0 ? -1 : _paramObj$delay,
          renderKey = _paramObj.renderKey;

      _module = module;
      _reducerModule = reducerModule || module;
      _type = type;
      _payload = payload;
      _cb = cb;
      _delay = _delay2;
      if (renderKey) _renderKey = renderKey;
    } else if (paramObjType === 'string' || paramObjType === 'function') {
      var targetFirstParam = paramObj;

      if (paramObjType === 'function') {
        var fnName = paramObj.__fnName;
        if (!fnName) throw new Error('you are calling a unnamed function!!!');
        targetFirstParam = fnName; // _module = paramObjType.stateModule || module;
      }

      var slashCount = targetFirstParam.split('').filter(function (v) {
        return v === '/';
      }).length;
      _payload = payloadWhenFirstParamIsString;
      if (userInputRKey) _renderKey = userInputRKey;
      if (userInputDelay !== undefined) _delay = userInputDelay;

      if (slashCount === 0) {
        _type = targetFirstParam;
      } else if (slashCount === 1) {
        var _targetFirstParam$spl = targetFirstParam.split('/'),
            _module2 = _targetFirstParam$spl[0],
            _type2 = _targetFirstParam$spl[1];

        _module = _module2;
        _reducerModule = _module;
        _type = _type2;
      } else if (slashCount === 2) {
        var _targetFirstParam$spl2 = targetFirstParam.split('/'),
            _module3 = _targetFirstParam$spl2[0],
            _reducerModule2 = _targetFirstParam$spl2[1],
            _type3 = _targetFirstParam$spl2[2];

        if (_module3 === '' || _module3 === ' ') _module = defaultModule; //targetFirstParam may like: /foo/changeName
        else _module = _module3;
        _module = _module3;
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
    } // pick user input reducerModule firstly!


    var targetReducerModule = _reducerModule || defaultReducerModule || _module;
    var p = new Promise(function (resolve, reject) {
      dispatch({
        targetRef: targetRef,
        module: _module,
        reducerModule: targetReducerModule,
        type: _type,
        payload: _payload,
        cb: _cb,
        __innerCb: _promiseErrorHandler(resolve, reject),
        ccKey: ccKey,
        ccUniqueKey: ccUniqueKey,
        ccClassKey: ccClassKey,
        delay: _delay,
        renderKey: _renderKey,
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
      (0, _setState["default"])(module, state, 0);
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