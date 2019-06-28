"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = register;

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _react = _interopRequireDefault(require("react"));

var _constant = require("../../support/constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _util = _interopRequireWildcard(require("../../support/util"));

var _co = _interopRequireDefault(require("co"));

var _extractStateByKeys6 = _interopRequireDefault(require("../state/extract-state-by-keys"));

var _buildCcClassContext = _interopRequireDefault(require("./build-cc-class-context"));

var _catchCcError = _interopRequireDefault(require("./catch-cc-error"));

var _mapModuleAndCcClassKeys = _interopRequireDefault(require("../mapper/map-module-and-cc-class-keys"));

var _unsetRef = _interopRequireDefault(require("../ref/unset-ref"));

var _setRef = _interopRequireDefault(require("../ref/set-ref"));

var _runLater = _interopRequireDefault(require("./run-later"));

var _computeCcUniqueKey2 = _interopRequireDefault(require("./compute-cc-unique-key"));

var _buildMockEvent = _interopRequireDefault(require("./build-mock-event"));

var _getFeatureStrAndStpmapping = _interopRequireDefault(require("./get-feature-str-and-stpmapping"));

var _extractStateByCcsync2 = _interopRequireDefault(require("../state/extract-state-by-ccsync"));

var _chain = require("../chain");

var _plugin = require("../plugin");

var checker = _interopRequireWildcard(require("../checker"));

var ev = _interopRequireWildcard(require("../event"));

var _watchKeyForRef = _interopRequireDefault(require("../watch/watch-key-for-ref"));

var _computeValueForRef = _interopRequireDefault(require("../computed/compute-value-for-ref"));

var _getWatchSpec = _interopRequireDefault(require("../watch/get-watch-spec"));

var _getComputedSpec = _interopRequireDefault(require("../computed/get-computed-spec"));

// import hoistNonReactStatic from 'hoist-non-react-statics';
// import setConnectedState from '../state/set-connected-state';
var verifyKeys = _util["default"].verifyKeys,
    ccClassDisplayName = _util["default"].ccClassDisplayName,
    styleStr = _util["default"].styleStr,
    color = _util["default"].color,
    verboseInfo = _util["default"].verboseInfo,
    makeError = _util["default"].makeError,
    justWarning = _util["default"].justWarning,
    throwCcHmrError = _util["default"].throwCcHmrError;
var _ccContext$store = _ccContext["default"].store,
    _state = _ccContext$store._state,
    getState = _ccContext$store.getState,
    ccStoreSetState = _ccContext$store.setState,
    _reducer = _ccContext["default"].reducer._reducer,
    refStore = _ccContext["default"].refStore,
    _computedValue = _ccContext["default"].computed._computedValue,
    moduleName_sharedStateKeys_ = _ccContext["default"].moduleName_sharedStateKeys_,
    moduleName_stateKeys_ = _ccContext["default"].moduleName_stateKeys_,
    ccKey_ref_ = _ccContext["default"].ccKey_ref_,
    ccKey_option_ = _ccContext["default"].ccKey_option_,
    moduleName_ccClassKeys_ = _ccContext["default"].moduleName_ccClassKeys_,
    ccClassKey_ccClassContext_ = _ccContext["default"].ccClassKey_ccClassContext_,
    middlewares = _ccContext["default"].middlewares;
var cl = color;
var ss = styleStr;
var me = makeError;
var vbi = verboseInfo;
var DISPATCH = 'dispatch';
var SET_STATE = 'setState';
var SET_MODULE_STATE = 'setModuleState';
var FORCE_UPDATE = 'forceUpdate';
var INVOKE = 'invoke';

function paramCallBackShouldNotSupply(module, currentModule) {
  return "if you pass param reactCallback, param module must equal current CCInstance's module, module: " + module + ", CCInstance's module:" + currentModule + ", now the cb will never been triggered! ";
}

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
} // any error in this function will not been throwed, cc just warning, 


function isStateModuleValid(inputModule, currentModule, reactCallback, cb) {
  var targetCb = reactCallback;

  if (checkStoreModule(inputModule, false)) {
    if (inputModule != currentModule) {
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

function getSharedKeys(module, ccClassKey, inputSharedStateKeys) {
  var sharedStateKeys = inputSharedStateKeys;

  if (inputSharedStateKeys === '*') {
    sharedStateKeys = Object.keys(getState(module));
  }

  var _verifyKeys = verifyKeys(sharedStateKeys, []),
      notArray = _verifyKeys.notArray,
      keyElementNotString = _verifyKeys.keyElementNotString;

  if (notArray) {
    throw me(_constant.ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY, vbi("ccClassKey:" + ccClassKey));
  }

  if (keyElementNotString) {
    throw me(_constant.ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT, vbi("ccClassKey:" + ccClassKey));
  }

  return sharedStateKeys;
}

function checkCcStartupOrNot() {
  if (!window.cc || _ccContext["default"].isCcAlreadyStartup !== true) {
    throw new Error('you must startup cc by call startup method before register ReactClass to cc!');
  }
} //to let cc know a specified module are watching what sharedStateKeys


function mapModuleAndSharedStateKeys(moduleName, partialSharedStateKeys) {
  var sharedStateKeysOfModule = moduleName_sharedStateKeys_[moduleName];
  if (!sharedStateKeysOfModule) sharedStateKeysOfModule = moduleName_sharedStateKeys_[moduleName] = [];
  partialSharedStateKeys.forEach(function (sKey) {
    if (!sharedStateKeysOfModule.includes(sKey)) sharedStateKeysOfModule.push(sKey);
  });
} //tell cc this ccClass is watching some sharedStateKeys of a module state


function mapCcClassKeyAndCcClassContext(ccClassKey, moduleName, originalSharedStateKeys, sharedStateKeys, connectSpec) {
  var fragmentPrefixLen = _constant.CC_FRAGMENT_PREFIX.length;

  if (ccClassKey.toLowerCase().substring(0, fragmentPrefixLen) === _constant.CC_FRAGMENT_PREFIX) {
    throw me(_constant.ERR.CC_CLASS_KEY_FRAGMENT_NOT_ALLOWED);
  }

  var _getFeatureStrAndStpM = (0, _getFeatureStrAndStpmapping["default"])(connectSpec),
      stateToPropMapping = _getFeatureStrAndStpM.stateToPropMapping,
      connectedModuleNames = _getFeatureStrAndStpM.connectedModuleNames;

  var contextMap = _ccContext["default"].ccClassKey_ccClassContext_;
  var ctx = contextMap[ccClassKey];

  if (ctx !== undefined) {
    // analyze is ccClassKey really duplicated
    if (_util["default"].isHotReloadMode()) {
      var str1 = ctx.originalSharedStateKeys.toString() + JSON.stringify(ctx.stateToPropMapping);
      var str2 = originalSharedStateKeys.toString() + JSON.stringify(stateToPropMapping);

      if (str1 !== str2) {
        throw me(_constant.ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
      } else {
        throwCcHmrError(me(_constant.ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate"));
      }
    } else {
      throw me(_constant.ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
    }
  }

  (0, _buildCcClassContext["default"])(ccClassKey, moduleName, originalSharedStateKeys, sharedStateKeys, stateToPropMapping, connectedModuleNames);
}
/**
 * register针对sharedStateKeys设定的默认策略是
 * SHARE_STATE_BELONG_TO_MODULE：sharedStateKeys仅仅代表关心变化的key，concent允许实例调用的reducer提交不属于sharedStateKeys描述的key，但是属于这个模块的key
 */


function getSuitableSharedStateKeys(sharedStrategy, isDispatcher, stateFor, moduleName, ccClassSharedStateKeys) {
  ////dispatcher实例调用的话，本身是不携带任何***StateKeys信息的
  if (sharedStrategy == _constant.SHARE_STATE_BELONG_TO_MODULE || isDispatcher) {
    return moduleName_stateKeys_[moduleName] || [];
  }

  var sharedStateKeys;

  if (stateFor === _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY) {
    sharedStateKeys = ccClassSharedStateKeys;
  } else if (stateFor === _constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE) {
    // user may declare module but no any class register to the module,
    // and a cc class define stateToPropMapping to watch this module's state change,
    sharedStateKeys = moduleName_sharedStateKeys_[moduleName] || [];
  } else {
    throw new Error("stateFor is not set correctly! ");
  }

  return sharedStateKeys;
}

function mapModuleAssociateDataToCcContext(ccClassKey, stateModule, sharedStateKeys, connectSpec) {
  var targetSharedStateKeys = getSharedKeys(stateModule, ccClassKey, sharedStateKeys);
  mapCcClassKeyAndCcClassContext(ccClassKey, stateModule, sharedStateKeys, targetSharedStateKeys, connectSpec);
  mapModuleAndSharedStateKeys(stateModule, targetSharedStateKeys);
  (0, _mapModuleAndCcClassKeys["default"])(stateModule, ccClassKey);
  return targetSharedStateKeys;
}

function updateConnectedState(targetClassContext, commitModule, commitState, commitStateKeys) {
  var stateToPropMapping = targetClassContext.stateToPropMapping,
      connectedModule = targetClassContext.connectedModule;

  if (connectedModule[commitModule] === 1) {
    var ccKeys = targetClassContext.ccKeys;
    var isSetConnectedStateTriggered = false;
    var len = commitStateKeys.length;

    for (var i = 0; i < len; i++) {
      var moduledStateKey = commitModule + "/" + commitStateKeys[i];

      if (stateToPropMapping[moduledStateKey]) {
        isSetConnectedStateTriggered = true;
        break; //只要感知到有一个key发生变化，就可以跳出循环了，
        //因为connectedState指向的是store里state的引用，更新动作在store里修改时就已完成
      }
    } // const { connectedState, ccKeys } = targetClassContext;
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
      ccKeys.forEach(function (ccUniKey) {
        var ref = ccKey_ref_[ccUniKey];

        if (ref) {
          var refCc = ref.cc;
          var watchSpec = refCc.watchSpec;
          var computedSpec = refCc.computedSpec;
          var shouldCurrentRefUpdate = (0, _watchKeyForRef["default"])(commitModule, watchSpec, refCc.ccState.connect, getState(commitModule), commitState, ref.__fragmentParams); //如果ref是CcFragment实例，将获得ctx

          (0, _computeValueForRef["default"])(commitModule, computedSpec, refCc.refComputed, refCc.refConnectedComputed, ref.state, commitState, ref.__fragmentParams);
          if (shouldCurrentRefUpdate) refCc.reactForceUpdate();
        }
      });
    }
  }
}

function broadcastConnectedState(commitModule, commitState) {
  // if there is no any react class registered to module, here will get undefined, so use safeGetArrayFromObject
  var commitStateKeys = Object.keys(commitState); //提前把commitStateKeys拿到，省去了在updateConnectedState内部的多次获取过程

  Object.keys(moduleName_ccClassKeys_).forEach(function (moduleName) {
    var ccClassKeys = _util["default"].safeGetArrayFromObject(moduleName_ccClassKeys_, moduleName);

    ccClassKeys.forEach(function (ccClassKey) {
      var ccClassContext = ccClassKey_ccClassContext_[ccClassKey];
      updateConnectedState(ccClassContext, commitModule, commitState, commitStateKeys);
    });
  });
}

function _promiseErrorHandler(resolve, reject) {
  return function (err) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return err ? reject(err) : resolve.apply(void 0, args);
  };
}

function _promisifyCcFn(ccFn, userLogicFn, executionContext, payload) {
  return new Promise(function (resolve, reject) {
    var _executionContext = Object.assign(executionContext, {
      __innerCb: _promiseErrorHandler(resolve, reject)
    });

    ccFn(userLogicFn, _executionContext, payload);
  })["catch"](_catchCcError["default"]);
}

function handleCcFnError(err, __innerCb) {
  if (err) {
    if (__innerCb) __innerCb(err);else {
      justWarning(err);
      if (_ccContext["default"].errorHandler) _ccContext["default"].errorHandler(err);
    }
  }
}

function getStateFor(inputModule, currentModule) {
  return inputModule === currentModule ? _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY : _constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE;
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
}

function register(ccClassKey, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$module = _ref.module,
      module = _ref$module === void 0 ? _constant.MODULE_DEFAULT : _ref$module,
      _ref$sharedStateKeys = _ref.sharedStateKeys,
      inputSharedStateKeys = _ref$sharedStateKeys === void 0 ? [] : _ref$sharedStateKeys,
      _ref$storedStateKeys = _ref.storedStateKeys,
      inputStoredStateKeys = _ref$storedStateKeys === void 0 ? [] : _ref$storedStateKeys,
      _ref$connect = _ref.connect,
      connect = _ref$connect === void 0 ? {} : _ref$connect,
      reducerModule = _ref.reducerModule,
      _ref$isPropsProxy = _ref.isPropsProxy,
      isPropsProxy = _ref$isPropsProxy === void 0 ? false : _ref$isPropsProxy,
      _ref$isSingle = _ref.isSingle,
      isSingle = _ref$isSingle === void 0 ? false : _ref$isSingle,
      _ref$sharedStrategy = _ref.sharedStrategy,
      sharedStrategy = _ref$sharedStrategy === void 0 ? _constant.SHARE_STATE_BELONG_TO_MODULE : _ref$sharedStrategy,
      _ref$asyncLifecycleHo = _ref.asyncLifecycleHook,
      asyncLifecycleHook = _ref$asyncLifecycleHo === void 0 ? true : _ref$asyncLifecycleHo,
      _ref$__checkStartUp = _ref.__checkStartUp,
      __checkStartUp = _ref$__checkStartUp === void 0 ? true : _ref$__checkStartUp,
      __calledBy = _ref.__calledBy;

  try {
    if (!ccClassKey) throw new Error("[[register]]: ccClassKey is undefined!");
    if (__checkStartUp === true) checkCcStartupOrNot();

    if (__calledBy !== 'cc') {
      if (ccClassKey.toLowerCase() === _constant.CC_DISPATCHER.toLowerCase()) {
        throw new Error(_constant.CC_DISPATCHER + " is cc built-in ccClassKey name, if you want to customize your dispatcher, \n        you can set autoCreateDispatcher=false in StartupOption, and use createDispatcher then.");
      }
    }

    var _curStateModule = module;
    var _asyncLifecycleHook = asyncLifecycleHook;

    var _reducerModule = reducerModule || _curStateModule; //if reducerModule not defined, will be equal module;


    checkStoreModule(_curStateModule);
    var sKeys = mapModuleAssociateDataToCcContext(ccClassKey, _curStateModule, inputSharedStateKeys, connect);
    var sharedStateKeys = sKeys;
    var isIssArr = Array.isArray(inputStoredStateKeys);

    if (!isIssArr && inputStoredStateKeys !== '*') {
      throw new Error("register.option.storedStateKeys type err, it is must be an array or string *");
    }

    if (isIssArr) {
      inputStoredStateKeys.forEach(function (v) {
        if (sKeys.includes(v)) {
          throw new Error("register.option.storedStateKeys key err, the key[" + v + "] is already been declared in sharedStateKeys");
        }
      });
    }

    return function (ReactClass) {
      if (ReactClass.prototype.$$changeState && ReactClass.prototype.__$$mapCcToInstance) {
        throw me(_constant.ERR.CC_REGISTER_A_CC_CLASS, vbi("if you want to register " + ccClassKey + " to cc successfully, the ReactClass can not be a CcClass!"));
      }

      var ToBeExtendedClass = isPropsProxy === false ? ReactClass : _react["default"].Component;

      var CcClass =
      /*#__PURE__*/
      function (_ToBeExtendedClass) {
        (0, _inheritsLoose2["default"])(CcClass, _ToBeExtendedClass);

        function CcClass(props, context) {
          var _this;

          try {
            _this = _ToBeExtendedClass.call(this, props, context) || this;
            if (!_this.state) _this.state = {};
            var ccKey = props.ccKey,
                _props$ccOption = props.ccOption,
                ccOption = _props$ccOption === void 0 ? {} : _props$ccOption;
            var originalCcKey = ccKey; //这些方法是cc自己注入的

            _util["default"].bindThis((0, _assertThisInitialized2["default"])(_this), ['__$$mapCcToInstance', '$$changeState', '__$$recoverState', '$$domDispatch', '$$sync', '$$syncBool', '$$syncInt', '$$set', '__$$sync', '$$setBool', '__$$getInvokeHandler', '__$$makeInvokeHandler', '__$$getChangeStateHandler', '__$$getDispatchHandler', '$$attach']);

            if (ccOption.asyncLifecycleHook === undefined) ccOption.asyncLifecycleHook = _asyncLifecycleHook;
            var _asyncLifecycleHook2 = ccOption.asyncLifecycleHook;

            var _computeCcUniqueKey = (0, _computeCcUniqueKey2["default"])(isSingle, ccClassKey, ccKey),
                newCcKey = _computeCcUniqueKey.ccKey,
                ccUniqueKey = _computeCcUniqueKey.ccUniqueKey,
                isCcUniqueKeyAutoGenerated = _computeCcUniqueKey.isCcUniqueKeyAutoGenerated;

            var ccClassContext = ccClassKey_ccClassContext_[ccClassKey];
            (0, _setRef["default"])((0, _assertThisInitialized2["default"])(_this), isSingle, ccClassKey, newCcKey, ccUniqueKey, ccOption);

            if (!ccOption.storedStateKeys) {
              ccOption.storedStateKeys = inputStoredStateKeys;
            }

            if (ccOption.storedStateKeys === '*') {
              var toExcludeKeys = sharedStateKeys;
              var allKeys = Object.keys(_this.state);
              var storedStateKeys = allKeys.filter(function (k) {
                return !toExcludeKeys.includes(k);
              });
              ccOption.storedStateKeys = storedStateKeys;
            }

            _this.__$$mapCcToInstance(isSingle, _asyncLifecycleHook2, ccClassKey, originalCcKey, newCcKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, ccOption.storedStateKeys, ccOption, ccClassContext, _curStateModule, _reducerModule, sharedStateKeys, connect);

            _this.$$connectedState = _this.cc.connectedState;
            _this.$$globalState = _this.cc.globalState;
            _this.$$refComputed = _this.cc.refComputed;
            _this.$$refConnectedComputed = _this.cc.refConnectedComputed; //这些方法是cc交给用户定义的，放置到cc下统一管理，因为多重装饰器模式下，这里属性是从this上取不到的
            //放在__$$recoverState之前，优先设置this.cc.computed

            if (_this.$$watch) {
              _this.cc.watch = _this.$$watch.bind((0, _assertThisInitialized2["default"])(_this)); //区别于CcFragment, 对于class组件，不把this当作上下文传进去了

              _this.cc.watchSpec = (0, _getWatchSpec["default"])(_this.cc.watch, null, _curStateModule);
            }

            if (_this.$$computed) {
              _this.cc.computed = _this.$$computed.bind((0, _assertThisInitialized2["default"])(_this));
              _this.cc.computedSpec = (0, _getComputedSpec["default"])(_this.cc.computed, null, _curStateModule);
            }

            if (_this.$$onUrlChanged) _this.cc.onUrlChanged = _this.$$onUrlChanged.bind((0, _assertThisInitialized2["default"])(_this));
            if (_this.$$execute) _this.cc.execute = _this.$$execute.bind((0, _assertThisInitialized2["default"])(_this)); //$$cache要注意使用规范

            if (_this.$$cache) {
              _this.$$cache = _this.$$cache.bind((0, _assertThisInitialized2["default"])(_this));
              _this.$$refCache = _this.$$cache();
            } else {
              _this.$$refCache = {};
            }

            _this.__$$recoverState(_curStateModule, sharedStateKeys, ccUniqueKey, connect);
          } catch (err) {
            (0, _catchCcError["default"])(err);
          }

          return _this;
        } // 如果代理组件或者继承组件没有没有实现scu，则concent采用只比较state的方式来决定组件要不要更新，不再关心nextProps


        var _proto = CcClass.prototype;

        _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
          var childRef = this.cc.childRef;

          if (childRef && childRef.shouldComponentUpdate) {
            return childRef.shouldComponentUpdate(nextProps, nextState);
          } else if (_ToBeExtendedClass.prototype.shouldComponentUpdate) {
            return _ToBeExtendedClass.prototype.shouldComponentUpdate.call(this, nextProps, nextState);
          }

          return this.state !== nextState;
        };

        _proto.__$$recoverState = function __$$recoverState(currentModule, sharedStateKeys, ccUniqueKey, connect) {
          var refStoredState = refStore._state[ccUniqueKey] || {};
          var sharedState = _state[currentModule];

          var _extractStateByKeys = (0, _extractStateByKeys6["default"])(sharedState, sharedStateKeys),
              partialSharedState = _extractStateByKeys.partialState;

          var refState = this.state;
          var entireState = Object.assign({}, refState, refStoredState, partialSharedState);
          this.state = entireState;
          var thisCc = this.cc;
          var computedSpec = thisCc.computedSpec;

          if (computedSpec) {
            var refComputed = thisCc.refComputed,
                refConnectedComputed = thisCc.refConnectedComputed;
            (0, _computeValueForRef["default"])(currentModule, computedSpec, refComputed, refConnectedComputed, entireState, entireState);
            (0, _util.okeys)(connect).forEach(function (m) {
              var mState = getState(m);
              (0, _computeValueForRef["default"])(m, computedSpec, refComputed, refConnectedComputed, mState, mState);
            });
          }
        } //!!! 存在多重装饰器时, 或者用户想使用this.props.***来用concent类时
        //!!! 必需在类的【constructor】 里调用 this.props.$$attach(this),紧接着state定义之后
        ;

        _proto.$$attach = function $$attach(childRef) {
          var _this2 = this;

          var attachMethods = ['$$domDispatch', '$$dispatch', '$$dispatchIdentity', '$$d', '$$di', '$$on', '$$onIdentity', '$$emit', '$$emitIdentity', '$$emitWith', '$$off', '$$set', '$$setBool', '$$sync', '$$syncBool', '$$syncInt', '$$invoke', '$$lazyInvoke', 'setState', 'setGlobalState', 'setModuleState', 'forceUpdate'];
          attachMethods.forEach(function (m) {
            childRef[m] = _this2[m].bind(_this2);
          }); //这些负责搜集结果的key，单独绑定

          childRef.$$refComputed = this.cc.refComputed;
          childRef.$$refConnectedComputed = this.cc.refConnectedComputed;
          childRef.$$connectedComputed = this.cc.connectedComputed;
          childRef.$$moduleComputed = this.cc.moduleComputed;
          childRef.$$globalComputed = this.cc.globalComputed;
          childRef.$$connectedState = this.cc.connectedState;
          childRef.$$globalState = this.cc.globalState;
          var thisCc = this.cc;
          var curModule = thisCc.ccState.module;
          childRef.cc = thisCc;

          var bindChildRefCcApi = function bindChildRefCcApi(cRef, method, ccMethod) {
            if (cRef[method]) {
              childRef[method] = childRef[method].bind(childRef);
              thisCc[ccMethod] = childRef[method];
              if (method === '$$watch') thisCc.watchSpec = (0, _getWatchSpec["default"])(thisCc.$$watch, null, curModule);else if (method === '$$computed') thisCc.computedSpec = (0, _getComputedSpec["default"])(thisCc.$$computed, null, curModule);
            }
          }; //这些方法绑定的this指向childRef


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

          var childRefState = childRef.state;
          var newState = Object.assign({}, childRefState, this.state);
          this.state = newState; //避免提示 Warning: Expected {Component} state to match memoized state before componentDidMount
          // childRef.state = newState;//在childRef进入首次render流程前，提前赋值

          (0, _util.okeys)(newState).forEach(function (key) {
            return childRefState[key] = newState[key];
          });
          this.cc.childRef = childRef;
        };

        _proto.componentDidMount = function componentDidMount() {
          if (_ToBeExtendedClass.prototype.componentDidMount) _ToBeExtendedClass.prototype.componentDidMount.call(this);

          if (isPropsProxy === true) {
            if (!this.cc.childRef) {
              throw new Error('you forgot to call this.props.$$attach(this) constructor, and you must call it after super() next line!');
            } else {
              //执行到父组件的componentDidMount，可以等同于认为孩子mounted了
              this.cc.isChildRefMounted = true;
            }
          }
        };

        _proto.__$$mapCcToInstance = function __$$mapCcToInstance(isSingle, asyncLifecycleHook, ccClassKey, originalCcKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys, ccOption, ccClassContext, currentModule, currentReducerModule, sharedStateKeys, connect) {
          var _this3 = this;

          var reactSetStateRef = this.setState.bind(this);
          var reactForceUpdateRef = this.forceUpdate.bind(this);

          var isControlledByConcent = sharedStateKeys.length > 0 || _util["default"].isObjectNotNull(connect);

          var ccState = {
            renderCount: 1,
            isSingle: isSingle,
            asyncLifecycleHook: asyncLifecycleHook,
            ccClassKey: ccClassKey,
            ccKey: ccKey,
            originalCcKey: originalCcKey,
            ccUniqueKey: ccUniqueKey,
            isCcUniqueKeyAutoGenerated: isCcUniqueKeyAutoGenerated,
            storedStateKeys: storedStateKeys,
            ccOption: ccOption,
            ccClassContext: ccClassContext,
            module: currentModule,
            reducerModule: currentReducerModule,
            sharedStateKeys: sharedStateKeys,
            initTime: Date.now(),
            connect: connect,
            isControlledByConcent: isControlledByConcent
          };
          var refConnectedComputed = {};
          (0, _util.okeys)(connect).forEach(function (moduleName) {
            refConnectedComputed[moduleName] = {};
          });

          var _verifyKeys2 = verifyKeys(sharedStateKeys, storedStateKeys),
              duplicate = _verifyKeys2.duplicate,
              notArray = _verifyKeys2.notArray,
              keyElementNotString = _verifyKeys2.keyElementNotString;

          if (notArray) {
            throw me(_constant.ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY, vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey));
          }

          if (keyElementNotString) {
            throw me(_constant.ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT, vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey));
          }

          if (duplicate) {
            throw me(_constant.ERR.CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS, vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " sharedStateKeys:" + sharedStateKeys + " storedStateKeys:" + storedStateKeys));
          }

          if (storedStateKeys.length > 0 && isCcUniqueKeyAutoGenerated) {
            throw me(_constant.ERR.CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS, vbi("ccClassKey:" + ccClassKey));
          }

          var connectedState = ccClassContext.connectedState || {};
          var globalState = getState(_constant.MODULE_GLOBAL);
          this.cc = {
            isChildRefMounted: false,
            onUrlChanged: null,
            watch: null,
            watchSpec: null,
            computed: null,
            computedSpec: null,
            refComputed: {},
            refConnectedComputed: refConnectedComputed,
            //定义在类里的带模块名字的computedKey计算计算结果收集对象
            connectedComputed: {},
            globalComputed: {},
            moduleComputed: {},
            connectedState: connectedState,
            globalState: globalState,
            execute: null,
            ccState: ccState,
            ccClassKey: ccClassKey,
            originalCcKey: originalCcKey,
            ccKey: ccKey,
            ccUniqueKey: ccUniqueKey,
            beforeSetState: this.$$beforeSetState,
            beforeBroadcastState: this.$$beforeBroadcastState,
            afterSetState: this.$$afterSetState,
            reactSetState: function reactSetState(state, cb) {
              ccState.renderCount += 1; //采用此种写法的话，dispatch.ctx不能暴露state了，只能暴露getState句柄，才能保证取到最新的state
              // this.state = Object.assign(this.state, state);
              //采用okeys写法，让dispatch.ctx里的state总是指向同一个引用

              (0, _util.okeys)(state).forEach(function (k) {
                return _this3.state[k] = state[k];
              });
              reactSetStateRef(state, cb);
            },
            reactForceUpdate: function reactForceUpdate(cb) {
              ccState.renderCount += 1;
              reactForceUpdateRef(cb);
            },
            setState: function setState(state, cb, delay, identity) {
              if (delay === void 0) {
                delay = -1;
              }

              _this3.$$changeState(state, {
                ccKey: ccKey,
                identity: identity,
                module: currentModule,
                stateFor: _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                cb: cb,
                calledBy: SET_STATE,
                delay: delay
              });
            },
            setModuleState: function setModuleState(module, state, delay, identity) {
              if (delay === void 0) {
                delay = -1;
              }

              var stateFor = getStateFor(module, _curStateModule);

              _this3.$$changeState(state, {
                ccKey: ccKey,
                identity: identity,
                module: module,
                stateFor: stateFor,
                calledBy: SET_MODULE_STATE,
                delay: delay
              });
            },
            setGlobalState: function setGlobalState(partialGlobalState, delay, identity) {
              if (delay === void 0) {
                delay = -1;
              }

              _this3.cc.setModuleState(_constant.MODULE_GLOBAL, partialGlobalState, delay, identity);
            },
            forceUpdate: function forceUpdate(cb, delay, identity) {
              _this3.$$changeState(_this3.state, {
                ccKey: ccKey,
                identity: identity,
                stateFor: _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                module: currentModule,
                cb: cb,
                calledBy: FORCE_UPDATE,
                delay: delay
              });
            },
            __invoke: function __invoke(userLogicFn, option, payload) {
              var ccKey = option.ccKey,
                  ccUniqueKey = option.ccUniqueKey,
                  ccClassKey = option.ccClassKey,
                  delay = option.delay,
                  identity = option.identity,
                  calledBy = option.calledBy,
                  module = option.module,
                  chainId = option.chainId,
                  oriChainId = option.oriChainId,
                  chainId_depth_ = option.chainId_depth_;
              var stateFor = getStateFor(module, _curStateModule);
              return _this3.cc.__promisifiedInvokeWith(userLogicFn, {
                ccKey: ccKey,
                ccUniqueKey: ccUniqueKey,
                stateFor: stateFor,
                context: true,
                module: module,
                ccClassKey: ccClassKey,
                calledBy: calledBy,
                fnName: userLogicFn.name,
                delay: delay,
                identity: identity,
                chainId: chainId,
                oriChainId: oriChainId,
                chainId_depth_: chainId_depth_
              }, payload);
            },
            __promisifiedInvokeWith: function __promisifiedInvokeWith(userLogicFn, executionContext, payload) {
              return _promisifyCcFn(_this3.cc.__invokeWith, userLogicFn, executionContext, payload);
            },
            __invokeWith: function __invokeWith(userLogicFn, executionContext, payload) {
              //ccKey ccClassKey 表示调用源头组件的ccKey和ccClassKey
              var ccKey = executionContext.ccKey,
                  ccUniqueKey = executionContext.ccUniqueKey,
                  ccClassKey = executionContext.ccClassKey,
                  stateFor = executionContext.stateFor,
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
                  identity = executionContext.identity,
                  refState = executionContext.refState,
                  chainId = executionContext.chainId,
                  oriChainId = executionContext.oriChainId,
                  chainId_depth_ = executionContext.chainId_depth_;
              isStateModuleValid(targetModule, _curStateModule, cb, function (err, newCb) {
                if (err) return handleCcFnError(err, __innerCb);
                var moduleState = getState(targetModule);
                var executionContextForUser = {};

                if (context) {
                  //调用前先加1
                  chainId_depth_[chainId] = chainId_depth_[chainId] + 1; //暂时不考虑在ctx提供lazyDispatch功能

                  var dispatch = _this3.__$$getDispatchHandler(refState, false, ccKey, ccUniqueKey, ccClassKey, _constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, targetModule, reducerModule, null, null, -1, identity, chainId, oriChainId, chainId_depth_);

                  var dispatchIdentity = _this3.__$$getDispatchHandler(refState, false, ccKey, ccUniqueKey, ccClassKey, _constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, targetModule, reducerModule, null, null, -1, identity, chainId, oriChainId, chainId_depth_);

                  var sourceClassContext = ccClassKey_ccClassContext_[ccClassKey]; //不能将state赋给executionContextForUser，给一个getState才能保证dispatch函数的state是最新的
                  //目前先保留state

                  var _refState = refState || _this3.state; //优先取透传的，再取自己的，因为有可能是Dispatcher调用


                  executionContextForUser = Object.assign(executionContext, {
                    // 将targetModule一直携带下去，让链式调用里所以句柄隐含的指向最初调用方的module
                    invoke: _this3.__$$getInvokeHandler(targetModule, ccKey, ccUniqueKey, ccClassKey, {
                      chainId: chainId,
                      oriChainId: oriChainId,
                      chainId_depth_: chainId_depth_
                    }),
                    //oriChainId, chainId_depth_ 一直携带下去，设置isLazy，会重新生成chainId
                    lazyInvoke: _this3.__$$getInvokeHandler(targetModule, ccKey, ccUniqueKey, ccClassKey, {
                      isLazy: true,
                      oriChainId: oriChainId,
                      chainId_depth_: chainId_depth_
                    }),
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
                    //!!!指的是调用源cc类实例的state
                    refState: _refState,
                    //其他ref相关的属性，不再传递给上下文，concent不鼓励用户在reducer使用ref相关数据，因为不同调用方传递不同的ref值，会引起用户不注意的bug
                    dispatch: dispatch,
                    dispatchIdentity: dispatchIdentity,
                    d: dispatch,
                    di: dispatchIdentity
                  });
                }

                (0, _plugin.send)(_constant.SIG_FN_START, {
                  module: targetModule,
                  chainId: chainId,
                  fn: userLogicFn
                });

                _co["default"].wrap(userLogicFn)(payload, moduleState, executionContextForUser).then(function (partialState) {
                  chainId_depth_[chainId] = chainId_depth_[chainId] - 1; //调用结束减1

                  var curDepth = chainId_depth_[chainId];
                  var commitStateList = [];
                  (0, _plugin.send)(_constant.SIG_FN_END, {
                    module: targetModule,
                    chainId: chainId
                  }); // if (chainId == oriChainId) {//是源头函数结束，发送函数结束的信号给插件
                  //   send(SIG_FN_END, { module: targetModule, chainId });
                  // }
                  // targetModule, sourceModule相等与否不用判断了，chainState里按模块为key去记录提交到不同模块的state

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
                    _this3.$$changeState(v.state, {
                      identity: identity,
                      ccKey: ccKey,
                      ccUniqueKey: ccUniqueKey,
                      stateFor: stateFor,
                      module: v.module,
                      cb: newCb,
                      type: type,
                      reducerModule: reducerModule,
                      calledBy: calledBy,
                      fnName: fnName,
                      delay: delay
                    });
                  });
                  if (__innerCb) __innerCb(null, partialState);
                })["catch"](function (err) {
                  (0, _plugin.send)(_constant.SIG_FN_ERR, {
                    module: targetModule,
                    chainId: chainId
                  });
                  handleCcFnError(err, __innerCb);
                });
              });
            },
            dispatch: function dispatch(_temp2) {
              var _ref2 = _temp2 === void 0 ? {} : _temp2,
                  refState = _ref2.refState,
                  ccKey = _ref2.ccKey,
                  ccUniqueKey = _ref2.ccUniqueKey,
                  ccClassKey = _ref2.ccClassKey,
                  stateFor = _ref2.stateFor,
                  inputModule = _ref2.module,
                  inputReducerModule = _ref2.reducerModule,
                  identity = _ref2.identity,
                  type = _ref2.type,
                  payload = _ref2.payload,
                  reactCallback = _ref2.cb,
                  __innerCb = _ref2.__innerCb,
                  _ref2$delay = _ref2.delay,
                  delay = _ref2$delay === void 0 ? -1 : _ref2$delay,
                  chainId = _ref2.chainId,
                  oriChainId = _ref2.oriChainId,
                  chainId_depth_ = _ref2.chainId_depth_;

              //if module not defined, targetStateModule will be currentModule
              var targetStateModule = inputModule || currentModule; //if reducerModule not defined, cc will treat targetReducerModule as targetStateModule

              var targetReducerModule = inputReducerModule || targetStateModule;
              var targetReducerMap = _reducer[targetReducerModule];

              if (!targetReducerMap) {
                return __innerCb(new Error("no reducerMap found for reducer module:" + targetReducerModule));
              }

              var reducerFn = targetReducerMap[type];

              if (!reducerFn) {
                var fns = Object.keys(targetReducerMap);
                return __innerCb(new Error("no reducer defined in ccContext for reducer module:" + targetReducerModule + " type:" + type + ", maybe you want to invoke one of them:" + fns));
              } // const errMsg = util.isCcActionValid({ type, payload });
              // if (errMsg) return justWarning(errMsg);


              isStateModuleValid(targetStateModule, currentModule, reactCallback, function (err, newCb) {
                if (err) return __innerCb(err);
                var executionContext = {
                  ccKey: ccKey,
                  ccClassKey: ccClassKey,
                  stateFor: stateFor,
                  ccUniqueKey: ccUniqueKey,
                  ccOption: ccOption,
                  module: targetStateModule,
                  reducerModule: targetReducerModule,
                  type: type,
                  cb: newCb,
                  context: true,
                  __innerCb: __innerCb,
                  calledBy: DISPATCH,
                  delay: delay,
                  identity: identity,
                  refState: refState,
                  chainId: chainId,
                  oriChainId: oriChainId,
                  chainId_depth_: chainId_depth_
                };

                _this3.cc.__invokeWith(reducerFn, executionContext, payload);
              });
            },
            prepareReactSetState: function prepareReactSetState(identity, calledBy, state, stateFor, next, reactCallback) {
              // 通过规范来约束用户，只要是可能变化的数据，都不要在$$cache里存
              // 要不然$$cache就没意义了
              // if(this.$$cache){
              //   this.$$refCache = this.$$cache();
              // }
              if (stateFor !== _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY) {
                if (next) next();
                return;
              }

              if (identity) {
                //if user specify identity
                if (_this3.cc.ccKey !== identity) {
                  // current instance would have been rendered only if current instance's ccKey equal identity
                  if (next) next();
                  return;
                }
              }

              if (storedStateKeys.length > 0) {
                var _extractStateByKeys2 = (0, _extractStateByKeys6["default"])(state, storedStateKeys),
                    partialState = _extractStateByKeys2.partialState,
                    isStateEmpty = _extractStateByKeys2.isStateEmpty;

                if (!isStateEmpty) {
                  if (ccOption.storeInLocalStorage === true) {
                    var _extractStateByKeys3 = (0, _extractStateByKeys6["default"])(_this3.state, storedStateKeys),
                        entireStoredState = _extractStateByKeys3.partialState;

                    var currentStoredState = Object.assign({}, entireStoredState, partialState);
                    localStorage.setItem('CCSS_' + ccUniqueKey, JSON.stringify(currentStoredState));
                  }

                  refStore.setState(ccUniqueKey, partialState);
                }
              } //确保forceUpdate能够刷新cc实例，因为state可能是{}，此时用户调用forceUpdate也要触发render


              if (calledBy !== FORCE_UPDATE && !_util["default"].isObjectNotNull(state)) {
                if (next) next();
                return;
              }

              var thisState = _this3.state;
              var thisCc = _this3.cc;
              var _thisCc$ccState = thisCc.ccState,
                  stateModule = _thisCc$ccState.module,
                  connect = _thisCc$ccState.connect;
              (0, _computeValueForRef["default"])(stateModule, thisCc.computedSpec, thisCc.refComputed, thisCc.refConnectedComputed, thisState, state);
              var shouldCurrentRefUpdate = (0, _watchKeyForRef["default"])(stateModule, thisCc.watchSpec, connect, thisState, state);

              if (shouldCurrentRefUpdate === false) {
                if (next) next();
              }

              if (_this3.$$beforeSetState) {
                if (asyncLifecycleHook) {
                  _this3.$$beforeSetState({
                    state: state
                  });

                  _this3.cc.reactSetState(state, reactCallback);

                  if (next) next();
                } else {
                  // if user don't call next in ccIns's $$beforeSetState,reactSetState will never been invoked
                  // $$beforeSetState(context, next){}
                  _this3.$$beforeSetState({
                    state: state
                  }, function () {
                    _this3.cc.reactSetState(state, reactCallback);

                    if (next) next();
                  });
                }
              } else {
                _this3.cc.reactSetState(state, reactCallback);

                if (next) next();
              }
            },
            syncCommittedStateToStore: function syncCommittedStateToStore(stateFor, moduleName, committedState) {
              var isDispatcher = _this3.cc.ccClassKey === _constant.CC_DISPATCHER;
              var targetSharedStateKeys = getSuitableSharedStateKeys(sharedStrategy, isDispatcher, stateFor, moduleName, sharedStateKeys);
              var skipBroadcastRefState = false;

              if (stateFor === _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY) {
                if (targetSharedStateKeys.length === 0) {
                  skipBroadcastRefState = true;
                }
              }

              var _extractStateByKeys4 = (0, _extractStateByKeys6["default"])(committedState, targetSharedStateKeys),
                  isPartialSharedStateEmpty = _extractStateByKeys4.isStateEmpty,
                  partialSharedState = _extractStateByKeys4.partialState; //!!! save state to store


              if (!isPartialSharedStateEmpty) ccStoreSetState(moduleName, partialSharedState);
              return {
                partialSharedState: partialSharedState,
                skipBroadcastRefState: skipBroadcastRefState
              };
            },
            prepareBroadcastState: function prepareBroadcastState(skipMiddleware, passToMiddleware, broadcastInfo, stateFor, moduleName, committedState, delay, identity) {
              var skipBroadcastRefState = broadcastInfo.skipBroadcastRefState,
                  partialSharedState = broadcastInfo.partialSharedState;

              var startBroadcastState = function startBroadcastState() {
                if (_this3.$$beforeBroadcastState) {
                  //check if user define a life cycle hook $$beforeBroadcastState
                  if (asyncLifecycleHook) {
                    _this3.$$beforeBroadcastState({}, function () {
                      _this3.cc.broadcastState(skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, identity);
                    });
                  } else {
                    _this3.$$beforeBroadcastState({});

                    _this3.cc.broadcastState(skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, identity);
                  }
                } else {
                  _this3.cc.broadcastState(skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, identity);
                }
              };

              var willBroadcast = function willBroadcast() {
                if (delay > 0) {
                  var feature = _util["default"].computeFeature(ccUniqueKey, committedState);

                  (0, _runLater["default"])(startBroadcastState, feature, delay);
                } else {
                  startBroadcastState();
                }
              };

              if (skipMiddleware) {
                willBroadcast();
                return;
              }

              var middlewaresLen = middlewares.length;

              if (middlewaresLen > 0) {
                passToMiddleware.sharedState = partialSharedState; //这个记录到store的状态也传给中间件ctx

                var index = 0;

                var next = function next() {
                  if (index === middlewaresLen) {
                    // all middlewares been executed
                    willBroadcast();
                  } else {
                    var middlewareFn = middlewares[index];
                    index++;
                    middlewareFn(passToMiddleware, next);
                  }
                };

                next();
              } else {
                willBroadcast();
              }
            },
            broadcastState: function broadcastState(skipBroadcastRefState, originalState, stateFor, moduleName, partialSharedState, identity) {
              if (skipBroadcastRefState === false) {
                var _partialSharedState = partialSharedState;
                var currentCcKey = _this3.cc.ccState.ccUniqueKey; // if stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, it means currentCcInstance has triggered reactSetState
                // so flag ignoreCurrentCcKey as true;

                var ignoreCurrentCcKey = stateFor === _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY;
                var ccClassKeys = moduleName_ccClassKeys_[moduleName];

                if (ccClassKeys) {
                  //  these ccClass are watching the same module's state
                  ccClassKeys.forEach(function (ccClassKey) {
                    var classContext = ccClassKey_ccClassContext_[ccClassKey];
                    var ccKeys = classContext.ccKeys,
                        sharedStateKeys = classContext.sharedStateKeys;
                    if (ccKeys.length === 0) return;
                    if (sharedStateKeys.length === 0) return; //  extract _partialSharedState again! because different class with a same module may have different sharedStateKeys!!!

                    var _extractStateByKeys5 = (0, _extractStateByKeys6["default"])(_partialSharedState, sharedStateKeys, true),
                        sharedStateForCurrentCcClass = _extractStateByKeys5.partialState,
                        isSharedStateEmpty = _extractStateByKeys5.isStateEmpty;

                    if (isSharedStateEmpty) return;
                    ccKeys.forEach(function (ccKey) {
                      if (ccKey === currentCcKey && ignoreCurrentCcKey) return;
                      var ref = ccKey_ref_[ccKey];

                      if (ref) {
                        if (_ccContext["default"].isDebug) {
                          console.log(ss("received state for ref " + ccKey + " is broadcasted from same module's other ref " + currentCcKey), cl());
                        }

                        ref.cc.prepareReactSetState(identity, 'broadcastState', sharedStateForCurrentCcClass, _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY);
                      }
                    });
                  });
                }
              }

              broadcastConnectedState(moduleName, originalState);
            },
            emit: function emit(event) {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }

              ev.findEventHandlersToPerform.apply(ev, [event, {
                identity: null
              }].concat(args));
            },
            emitIdentity: function emitIdentity(event, identity) {
              for (var _len3 = arguments.length, args = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
                args[_key3 - 2] = arguments[_key3];
              }

              ev.findEventHandlersToPerform.apply(ev, [event, {
                identity: identity
              }].concat(args));
            },
            emitWith: function emitWith(event, option) {
              for (var _len4 = arguments.length, args = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
                args[_key4 - 2] = arguments[_key4];
              }

              ev.findEventHandlersToPerform.apply(ev, [event, option].concat(args));
            },
            on: function on(event, handler) {
              ev.bindEventHandlerToCcContext(currentModule, ccClassKey, ccUniqueKey, event, null, handler);
            },
            onIdentity: function onIdentity(event, identity, handler) {
              ev.bindEventHandlerToCcContext(currentModule, ccClassKey, ccUniqueKey, event, identity, handler);
            },
            off: function off(event, _temp3) {
              var _ref3 = _temp3 === void 0 ? {} : _temp3,
                  module = _ref3.module,
                  ccClassKey = _ref3.ccClassKey,
                  identity = _ref3.identity;

              //  consider if module === currentModule, let off happened?
              ev.findEventHandlersToOff(event, {
                module: module,
                ccClassKey: ccClassKey,
                identity: identity
              });
            }
          };
          var thisCC = this.cc; // when call $$dispatch in a ccInstance, state extraction strategy will be STATE_FOR_ONE_CC_INSTANCE_FIRSTLY

          var d = this.__$$getDispatchHandler(null, false, ccKey, ccUniqueKey, ccClassKey, _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, currentModule, null, null, null, -1);

          var di = this.__$$getDispatchHandler(null, false, ccKey, ccUniqueKey, ccClassKey, _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, currentModule, null, null, null, -1, ccKey); //ccKey is identity by default


          this.$$lazyDispatch = this.__$$getDispatchHandler(null, true, ccKey, ccUniqueKey, ccClassKey, _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, currentModule, null, null, null, -1);
          this.$$d = d;
          this.$$di = di;
          this.$$dispatch = d;
          this.$$dispatchIdentity = di;
          this.$$dispatchForModule = this.__$$getDispatchHandler(null, false, ccKey, ccUniqueKey, ccClassKey, _constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, currentModule, null, null, null, -1);
          this.$$lazyDispatchForModule = this.__$$getDispatchHandler(null, true, ccKey, ccUniqueKey, ccClassKey, _constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, currentModule, null, null, null, -1);
          this.$$invoke = this.__$$getInvokeHandler(_curStateModule, ccKey, ccUniqueKey, ccClassKey);
          this.$$lazyInvoke = this.__$$getInvokeHandler(_curStateModule, ccKey, ccUniqueKey, ccClassKey, {
            isLazy: true
          });
          this.$$emit = thisCC.emit;
          this.$$emitIdentity = thisCC.emitIdentity;
          this.$$emitWith = thisCC.emitWith;
          this.$$on = thisCC.on;
          this.$$onIdentity = thisCC.onIdentity;
          this.$$off = thisCC.off;
          this.$$moduleComputed = thisCC.moduleComputed = _computedValue[currentModule] || {};
          this.$$globalComputed = thisCC.globalComputed = _computedValue[_constant.MODULE_GLOBAL] || {};
          this.$$connectedComputed = thisCC.connectedComputed = ccClassContext.connectedComputed;
          this.setState = thisCC.setState; //let setState call cc.setState

          this.setGlobalState = thisCC.setGlobalState; //let setGlobalState call cc.setGlobalState

          this.setModuleState = thisCC.setModuleState; //let setModuleState call cc.setModuleState

          this.forceUpdate = thisCC.forceUpdate; //let forceUpdate call cc.forceUpdate
        } // this method is service only for concent
        // so make sure you know what you want, and you don't need call this method most of the time,
        ;

        _proto.$$changeState = function $$changeState(state, _temp4) {
          var _this4 = this;

          var _ref4 = _temp4 === void 0 ? {} : _temp4,
              ccKey = _ref4.ccKey,
              ccUniqueKey = _ref4.ccUniqueKey,
              _ref4$stateFor = _ref4.stateFor,
              stateFor = _ref4$stateFor === void 0 ? _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY : _ref4$stateFor,
              module = _ref4.module,
              _ref4$skipMiddleware = _ref4.skipMiddleware,
              skipMiddleware = _ref4$skipMiddleware === void 0 ? false : _ref4$skipMiddleware,
              reactCallback = _ref4.cb,
              type = _ref4.type,
              reducerModule = _ref4.reducerModule,
              calledBy = _ref4.calledBy,
              fnName = _ref4.fnName,
              _ref4$delay = _ref4.delay,
              delay = _ref4$delay === void 0 ? -1 : _ref4$delay,
              identity = _ref4.identity;

          //executionContext
          if (state == undefined) return; //do nothing
          // const isControlledByConcent = this.cc.ccState.isControlledByConcent;

          if (!(0, _util.isPlainJsonObject)(state)) {
            justWarning("cc found your commit state is not a plain json object!");
            return;
          }

          var ccState = this.cc.ccState;
          var currentModule = ccState.module;
          var passToMiddleware = {};

          if (skipMiddleware !== true) {
            passToMiddleware = {
              calledBy: calledBy,
              type: type,
              ccKey: ccKey,
              ccUniqueKey: ccUniqueKey,
              state: state,
              stateFor: stateFor,
              module: module,
              reducerModule: reducerModule,
              fnName: fnName
            };
          } //在prepareReactSetState之前把状态存储到store，
          //防止属于同一个模块的父组件套子组件渲染时，父组件修改了state，子组件初次挂载是不能第一时间拿到state
          //也防止prepareReactSetState里有异步的钩子函数，导致state同步到store有延迟而出现其他bug


          var broadcastInfo = this.cc.syncCommittedStateToStore(stateFor, module, state);

          if (module === currentModule) {
            // who trigger $$changeState, who will change the whole received state 
            this.cc.prepareReactSetState(identity, calledBy, state, stateFor, function () {
              _this4.cc.prepareBroadcastState(skipMiddleware, passToMiddleware, broadcastInfo, stateFor, module, state, delay, identity);
            }, reactCallback);
          } else {
            if (reactCallback) justWarning("callback for react.setState will be ignore"); //触发修改状态的实例所属模块和目标模块不一致的时候，这里的stateFor必须是OF_ONE_MODULE

            this.cc.prepareBroadcastState(skipMiddleware, passToMiddleware, broadcastInfo, _constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, module, state, delay, identity);
          }
        };

        _proto.__$$getChangeStateHandler = function __$$getChangeStateHandler(executionContext) {
          var _this5 = this;

          return function (state) {
            return _this5.$$changeState(state, executionContext);
          };
        };

        _proto.__$$getInvokeHandler = function __$$getInvokeHandler(module, ccKey, ccUniqueKey, ccClassKey, chainData) {
          return this.__$$makeInvokeHandler(module, ccKey, ccUniqueKey, ccClassKey, chainData);
        };

        _proto.__$$makeInvokeHandler = function __$$makeInvokeHandler(module, ccKey, ccUniqueKey, ccClassKey, _temp5) {
          var _this6 = this;

          var _ref5 = _temp5 === void 0 ? {} : _temp5,
              chainId = _ref5.chainId,
              oriChainId = _ref5.oriChainId,
              isLazy = _ref5.isLazy,
              _ref5$chainId_depth_ = _ref5.chainId_depth_,
              chainId_depth_ = _ref5$chainId_depth_ === void 0 ? {} : _ref5$chainId_depth_;

          return function (firstParam, payload) {
            var _getNewChainData = getNewChainData(isLazy, chainId, oriChainId, chainId_depth_),
                _chainId = _getNewChainData._chainId,
                _oriChainId = _getNewChainData._oriChainId;

            var firstParamType = typeof firstParam;
            var option = {
              ccKey: ccKey,
              ccUniqueKey: ccUniqueKey,
              ccClassKey: ccClassKey,
              calledBy: INVOKE,
              module: module,
              chainId: _chainId,
              oriChainId: _oriChainId,
              chainId_depth_: chainId_depth_
            };
            var err = new Error("param type error, correct usage: invoke(userFn:function, ...args:any[]) or invoke(option:{fn:function, delay:number, identity:string}, ...args:any[])");

            if (firstParamType === 'function') {
              return _this6.cc.__invoke(firstParam, option, payload);
            } else if (firstParamType === 'object') {
              //firstParam: {fn:function, delay:number, identity:string}
              // const { fn, ...option } = firstParam;//防止某些版本的create-react-app运行瓷出错，这里不采用对象延展符的写法
              var fn = firstParam.fn,
                  delay = firstParam.delay,
                  identity = firstParam.identity,
                  userInputModule = firstParam.module;
              if (typeof fn != 'function') throw err;
              option.delay = delay;
              option.identity = identity;
              if (userInputModule) option.module = userInputModule; //用某个模块的实例去修改另外模块的数据

              return _this6.cc.__invoke(fn, option, payload);
            } else {
              throw err;
            } // return ()=>{}

          };
        };

        _proto.__$$getDispatchHandler = function __$$getDispatchHandler(refState, isLazy, ccKey, ccUniqueKey, ccClassKey, stateFor, targetModule, targetReducerModule, inputType, inputPayload, delay, defaultIdentity, chainId, oriChainId, chainId_depth_ // sourceModule, oriChainId, oriChainDepth
        ) {
          var _this7 = this;

          if (delay === void 0) {
            delay = -1;
          }

          if (defaultIdentity === void 0) {
            defaultIdentity = '';
          }

          if (chainId_depth_ === void 0) {
            chainId_depth_ = {};
          }

          return function (paramObj, payloadWhenFirstParamIsString, userInputDelay, userInputIdentity) {
            if (paramObj === void 0) {
              paramObj = {};
            }

            var _getNewChainData2 = getNewChainData(isLazy, chainId, oriChainId, chainId_depth_),
                _chainId = _getNewChainData2._chainId,
                _oriChainId = _getNewChainData2._oriChainId;

            var paramObjType = typeof paramObj;

            var _module = targetModule,
                _reducerModule,
                _type,
                _payload = inputPayload,
                _cb,
                _delay = delay;

            var _identity = defaultIdentity;

            if (paramObjType === 'object') {
              var _paramObj = paramObj,
                  _paramObj$module = _paramObj.module,
                  _module2 = _paramObj$module === void 0 ? targetModule : _paramObj$module,
                  _reducerModule2 = _paramObj.reducerModule,
                  _paramObj$type = _paramObj.type,
                  type = _paramObj$type === void 0 ? inputType : _paramObj$type,
                  _paramObj$payload = _paramObj.payload,
                  payload = _paramObj$payload === void 0 ? inputPayload : _paramObj$payload,
                  cb = _paramObj.cb,
                  _paramObj$delay = _paramObj.delay,
                  _delay2 = _paramObj$delay === void 0 ? -1 : _paramObj$delay,
                  identity = _paramObj.identity;

              _module = _module2;
              _reducerModule = _reducerModule2 || _module2;
              _type = type;
              _payload = payload;
              _cb = cb;
              _delay = _delay2;
              if (identity) _identity = identity;
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
              if (userInputIdentity) _identity = userInputIdentity;
              if (userInputDelay !== undefined) _delay = userInputDelay;

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
                    _reducerModule3 = _targetFirstParam$spl2[1],
                    _type3 = _targetFirstParam$spl2[2];

                if (_module4 === '' || _module4 === ' ') _module = targetModule; //targetFirstParam may like: /foo/changeName
                else _module = _module4;
                _module = _module4;
                _reducerModule = _reducerModule3;
                _type = _type3;
              } else {
                return Promise.reject(me(_constant.ERR.CC_DISPATCH_STRING_INVALID, vbi(targetFirstParam)));
              }
            } else {
              return Promise.reject(me(_constant.ERR.CC_DISPATCH_PARAM_INVALID));
            }

            if (_module === '*') {
              return Promise.reject('cc instance api dispatch do not support multi dispatch, please use top api[cc.dispatch] instead!');
            } // pick user input reducerModule firstly


            var nowReducerModule = _reducerModule || targetReducerModule || module;
            var p = new Promise(function (resolve, reject) {
              _this7.cc.dispatch({
                stateFor: stateFor,
                module: _module,
                reducerModule: nowReducerModule,
                type: _type,
                payload: _payload,
                cb: _cb,
                __innerCb: _promiseErrorHandler(resolve, reject),
                ccKey: ccKey,
                ccUniqueKey: ccUniqueKey,
                ccClassKey: ccClassKey,
                delay: _delay,
                identity: _identity,
                refState: refState,
                chainId: _chainId,
                oriChainId: _oriChainId,
                chainId_depth_: chainId_depth_ // oriChainId: _oriChainId, oriChainDepth: _oriChainDepth, sourceModule: _sourceModule,

              });
            })["catch"](_catchCcError["default"]);
            return p;
          };
        };

        _proto.$$domDispatch = function $$domDispatch(event) {
          var currentTarget = event.currentTarget;
          var value = currentTarget.value,
              dataset = currentTarget.dataset;
          var type = dataset.cct,
              module = dataset.ccm,
              reducerModule = dataset.ccrm,
              _dataset$ccdelay = dataset.ccdelay,
              ccdelay = _dataset$ccdelay === void 0 ? -1 : _dataset$ccdelay,
              _dataset$ccidt = dataset.ccidt,
              ccidt = _dataset$ccidt === void 0 ? '' : _dataset$ccidt;
          var payload = {
            event: event,
            dataset: dataset,
            value: value
          };
          var _this$cc = this.cc,
              ccKey = _this$cc.ccKey,
              ccUniqueKey = _this$cc.ccUniqueKey;

          var handler = this.__$$getDispatchHandler(null, false, ccKey, ccUniqueKey, ccClassKey, _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module, reducerModule, type, payload, ccdelay, ccidt);

          handler()["catch"](handleCcFnError);
        };

        _proto.$$syncBool = function $$syncBool(e, delay, idt) {
          var _this$__$$sync$bind;

          if (delay === void 0) {
            delay = -1;
          }

          if (idt === void 0) {
            idt = '';
          }

          if (typeof e === 'string') return this.__$$sync.bind(this, (_this$__$$sync$bind = {}, _this$__$$sync$bind[_constant.CCSYNC_KEY] = e, _this$__$$sync$bind.type = 'bool', _this$__$$sync$bind.delay = delay, _this$__$$sync$bind.idt = idt, _this$__$$sync$bind));

          this.__$$sync({
            type: 'bool'
          }, e);
        };

        _proto.$$syncInt = function $$syncInt(e, delay, idt) {
          var _this$__$$sync$bind2;

          if (delay === void 0) {
            delay = -1;
          }

          if (idt === void 0) {
            idt = '';
          }

          if (typeof e === 'string') return this.__$$sync.bind(this, (_this$__$$sync$bind2 = {}, _this$__$$sync$bind2[_constant.CCSYNC_KEY] = e, _this$__$$sync$bind2.type = 'int', _this$__$$sync$bind2.delay = delay, _this$__$$sync$bind2.idt = idt, _this$__$$sync$bind2));

          this.__$$sync({
            type: 'int'
          }, e);
        };

        _proto.$$set = function $$set(ccsync, val, delay, idt) {
          var _this$__$$sync;

          this.__$$sync((_this$__$$sync = {}, _this$__$$sync[_constant.CCSYNC_KEY] = ccsync, _this$__$$sync.type = 'val', _this$__$$sync.val = val, _this$__$$sync.delay = delay, _this$__$$sync.idt = idt, _this$__$$sync));
        } //对布尔值自动取反
        ;

        _proto.$$setBool = function $$setBool(ccsync, delay, idt) {
          var _this$__$$sync2;

          this.__$$sync((_this$__$$sync2 = {}, _this$__$$sync2[_constant.CCSYNC_KEY] = ccsync, _this$__$$sync2.type = 'bool', _this$__$$sync2.delay = delay, _this$__$$sync2.idt = idt, _this$__$$sync2));
        };

        _proto.$$sync = function $$sync(e, val, delay, idt) {
          if (typeof e === 'string') {
            var _this$__$$sync$bind3;

            return this.__$$sync.bind(this, (_this$__$$sync$bind3 = {}, _this$__$$sync$bind3[_constant.CCSYNC_KEY] = e, _this$__$$sync$bind3.type = 'val', _this$__$$sync$bind3.val = val, _this$__$$sync$bind3.delay = delay, _this$__$$sync$bind3.idt = idt, _this$__$$sync$bind3));
          } else if (e && e[_constant.MOCKE_KEY]) {
            return this.__$$sync(e);
          }

          this.__$$sync({
            type: 'val'
          }, e); // for <input data-ccsync="foo/f1" onChange={this.$$sync} />

        };

        _proto.__$$sync = function __$$sync(spec, e) {
          var mockE = null;

          if (spec[_constant.MOCKE_KEY]) {
            mockE = spec;
          } else if (spec[_constant.CCSYNC_KEY] !== undefined) {
            //来自$$sync生成的setter调用
            mockE = (0, _buildMockEvent["default"])(spec, e);
          } else {
            mockE = (0, _util.convertToStandardEvent)(e);
          }

          if (!mockE) return; //参数无效

          if (e && e.stopPropagation) e.stopPropagation();
          var currentTarget = mockE.currentTarget;
          var dataset = currentTarget.dataset;
          var ccsync = dataset.ccsync,
              ccint = dataset.ccint,
              ccdelay = dataset.ccdelay,
              ccidt = dataset.ccidt;
          var value = currentTarget.value;
          var currentModule = this.cc.ccState.module;
          var _module = currentModule;

          if (ccsync.includes('/')) {
            _module = ccsync.split('/')[0];
          }

          var fullState = _module !== currentModule ? getState(_module) : this.state;

          var _extractStateByCcsync = (0, _extractStateByCcsync2["default"])(ccsync, value, ccint, fullState, mockE.isToggleBool),
              state = _extractStateByCcsync.state;

          var targetStateFor = mockE.stateFor;

          if (!targetStateFor) {
            targetStateFor = _module !== currentModule ? _constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE : _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY;
          }

          this.$$changeState(state, {
            ccKey: this.cc.ccKey,
            stateFor: targetStateFor,
            module: _module,
            delay: ccdelay,
            identity: ccidt
          });
        };

        _proto.componentDidUpdate = function componentDidUpdate() {
          if (_ToBeExtendedClass.prototype.componentDidUpdate) _ToBeExtendedClass.prototype.componentDidUpdate.call(this);
          if (this.$$afterSetState) this.$$afterSetState();
        };

        _proto.componentWillUnmount = function componentWillUnmount() {
          var _this$cc$ccState = this.cc.ccState,
              ccUniqueKey = _this$cc$ccState.ccUniqueKey,
              ccClassKey = _this$cc$ccState.ccClassKey;
          ev.offEventHandlersByCcUniqueKey(ccUniqueKey);
          (0, _unsetRef["default"])(ccClassKey, ccUniqueKey); //if father component implement componentWillUnmount，call it again

          if (_ToBeExtendedClass.prototype.componentWillUnmount) _ToBeExtendedClass.prototype.componentWillUnmount.call(this);
        };

        _proto.render = function render() {
          if (_ccContext["default"].isDebug) {
            console.log(ss("@@@ render " + ccClassDisplayName(ccClassKey)), cl());
          }

          if (isPropsProxy === false) {
            //now cc class extends ReactClass, call super.render()
            return _ToBeExtendedClass.prototype.render.call(this);
          } else {
            var thisCc = this.cc; //只将$$attach传递下去，让用户在构造器里紧接着super之后调this.props.$$attach()
            // const props = Object.assign({}, this.props, { $$attach: this.$$attach });

            var props = Object.assign({}, this, {
              $$attach: this.$$attach
            });

            if (thisCc.isChildRefMounted) {
              var childRefState = thisCc.childRef.state;
              var thisState = this.state;
              (0, _util.okeys)(this.state).forEach(function (key) {
                childRefState[key] = thisState[key];
              }); //不能采用直接赋值，这相当于隐式的替换了state，会造成更新失败
              // thisCc.childRef.state = this.state;
            }

            return _react["default"].createElement(ReactClass, props);
          }
        };

        return CcClass;
      }(ToBeExtendedClass);

      if (ccClassKey === _constant.CC_DISPATCHER) CcClass.displayName = 'CcDispatcher';else CcClass.displayName = ccClassDisplayName(ccClassKey);
      return CcClass;
    };
  } catch (err) {
    (0, _catchCcError["default"])(err);
  }
}