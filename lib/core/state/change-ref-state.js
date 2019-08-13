"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var util = _interopRequireWildcard(require("../../support/util"));

var cst = _interopRequireWildcard(require("../../support/constant"));

var _runLater = _interopRequireDefault(require("../base/run-later"));

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _extractStateByKeys5 = _interopRequireDefault(require("../state/extract-state-by-keys"));

var _watchKeyForRef = _interopRequireDefault(require("../watch/watch-key-for-ref"));

var _computeValueForRef = _interopRequireDefault(require("../computed/compute-value-for-ref"));

var _plugin = require("../plugin");

var isPlainJsonObject = util.isPlainJsonObject,
    justWarning = util.justWarning,
    isObjectNotNull = util.isObjectNotNull,
    computeFeature = util.computeFeature,
    okeys = util.okeys,
    styleStr = util.styleStr,
    color = util.color;
var STATE_FOR_ONE_CC_INSTANCE_FIRSTLY = cst.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
    STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE = cst.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
    FORCE_UPDATE = cst.FORCE_UPDATE,
    SET_STATE = cst.SET_STATE,
    SET_MODULE_STATE = cst.SET_MODULE_STATE,
    INVOKE = cst.INVOKE,
    SYNC = cst.SYNC,
    SIG_STATE_CHANGED = cst.SIG_STATE_CHANGED;
var _ccContext$store = _ccContext["default"].store,
    setState = _ccContext$store.setState,
    getPrevState = _ccContext$store.getPrevState,
    middlewares = _ccContext["default"].middlewares,
    moduleName_ccClassKeys_ = _ccContext["default"].moduleName_ccClassKeys_,
    ccClassKey_ccClassContext_ = _ccContext["default"].ccClassKey_ccClassContext_,
    connectedModuleName_ccClassKeys_ = _ccContext["default"].connectedModuleName_ccClassKeys_,
    refStore = _ccContext["default"].refStore,
    moduleName_stateKeys_ = _ccContext["default"].moduleName_stateKeys_,
    ccUkey_ref_ = _ccContext["default"].ccUkey_ref_;

function getStateFor(inputModule, refModule) {
  return inputModule === refModule ? STATE_FOR_ONE_CC_INSTANCE_FIRSTLY : STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE;
}

function getActionType(calledBy, type) {
  if ([FORCE_UPDATE, SET_STATE, SET_MODULE_STATE, INVOKE, SYNC].includes(calledBy)) {
    return "ccApi/" + calledBy;
  } else {
    return "dispatch/" + type;
  }
}

function _default(state, _temp, targetRef) {
  var _ref = _temp === void 0 ? {} : _temp,
      ccKey = _ref.ccKey,
      ccUniqueKey = _ref.ccUniqueKey,
      module = _ref.module,
      _ref$skipMiddleware = _ref.skipMiddleware,
      skipMiddleware = _ref$skipMiddleware === void 0 ? false : _ref$skipMiddleware,
      reactCallback = _ref.reactCallback,
      type = _ref.type,
      reducerModule = _ref.reducerModule,
      _ref$calledBy = _ref.calledBy,
      calledBy = _ref$calledBy === void 0 ? SET_STATE : _ref$calledBy,
      fnName = _ref.fnName,
      _ref$delay = _ref.delay,
      delay = _ref$delay === void 0 ? -1 : _ref$delay,
      renderKey = _ref.renderKey;

  var stateFor = getStateFor(module, targetRef.ctx.module);
  if (state === undefined) return; //do nothing
  // const isControlledByConcent = targetRef.ctx.isControlledByConcent;

  if (!isPlainJsonObject(state)) {
    justWarning("cc found your commit state is not a plain json object!");
    return;
  }

  var currentModule = targetRef.ctx.module;
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


  var broadcastInfo = syncCommittedStateToStore(module, state);
  (0, _plugin.send)(SIG_STATE_CHANGED, {
    committedState: state,
    sharedState: broadcastInfo.partialSharedState,
    module: module,
    type: getActionType(calledBy, type),
    ccUniqueKey: ccUniqueKey
  });

  if (module === currentModule) {
    // who trigger $$changeState, who will change the whole received state 
    prepareReactSetState(targetRef, renderKey, calledBy, state, stateFor, function () {
      prepareBroadcastState(targetRef, skipMiddleware, passToMiddleware, broadcastInfo, stateFor, module, state, delay, renderKey, reactCallback);
    }, reactCallback);
  } else {
    if (reactCallback) justWarning("callback for react.setState will be ignore"); //触发修改状态的实例所属模块和目标模块不一致的时候，这里的stateFor必须是OF_ONE_MODULE

    prepareBroadcastState(targetRef, skipMiddleware, passToMiddleware, broadcastInfo, STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, module, state, delay, renderKey, reactCallback);
  }
}

function prepareReactSetState(targetRef, renderKey, calledBy, state, stateFor, next, reactCallback) {
  var thisState = targetRef.state;
  var refCtx = targetRef.ctx;
  var stateModule = refCtx.module,
      storedKeys = refCtx.storedKeys,
      ccOption = refCtx.ccOption,
      ccUniqueKey = refCtx.ccUniqueKey;

  if (stateFor !== STATE_FOR_ONE_CC_INSTANCE_FIRSTLY) {
    if (next) next();
    return;
  }

  if (renderKey) {
    //if user specify renderKey
    if (ccOption.renderKey !== renderKey) {
      // current instance can been rendered only if current instance's ccKey equal renderKey
      if (next) next();
      return;
    }
  }

  if (storedKeys.length > 0) {
    var _extractStateByKeys = (0, _extractStateByKeys5["default"])(state, storedKeys),
        partialState = _extractStateByKeys.partialState,
        isStateEmpty = _extractStateByKeys.isStateEmpty;

    if (!isStateEmpty) {
      if (ccOption.persistStoredKeys === true) {
        var _extractStateByKeys2 = (0, _extractStateByKeys5["default"])(thisState, storedKeys),
            entireStoredState = _extractStateByKeys2.partialState;

        var currentStoredState = Object.assign({}, entireStoredState, partialState);
        localStorage.setItem('CCSS_' + ccUniqueKey, JSON.stringify(currentStoredState));
      }

      refStore.setState(ccUniqueKey, partialState);
    }
  } //确保forceUpdate能够刷新cc实例，因为state可能是{}，此时用户调用forceUpdate也要触发render


  if (calledBy !== FORCE_UPDATE && !isObjectNotNull(state)) {
    if (next) next();
    return;
  }

  (0, _computeValueForRef["default"])(refCtx, stateModule, thisState, state);
  var shouldCurrentRefUpdate = (0, _watchKeyForRef["default"])(refCtx, stateModule, thisState, state);

  if (targetRef.__$$isUnmounted !== true) {
    refCtx.__$$ccSetState(state, reactCallback, shouldCurrentRefUpdate);
  }

  if (next) next();
}

function syncCommittedStateToStore(moduleName, committedState) {
  var stateKeys = moduleName_stateKeys_[moduleName];

  var _extractStateByKeys3 = (0, _extractStateByKeys5["default"])(committedState, stateKeys),
      isPartialSharedStateEmpty = _extractStateByKeys3.isStateEmpty,
      partialSharedState = _extractStateByKeys3.partialState;

  var skipBroadcastRefState = false; //!!! save state to store

  if (!isPartialSharedStateEmpty) setState(moduleName, partialSharedState);else skipBroadcastRefState = true;
  return {
    partialSharedState: partialSharedState,
    skipBroadcastRefState: skipBroadcastRefState
  };
}

function prepareBroadcastState(targetRef, skipMiddleware, passToMiddleware, broadcastInfo, stateFor, moduleName, committedState, delay, renderKey, reactCallback) {
  var skipBroadcastRefState = broadcastInfo.skipBroadcastRefState,
      partialSharedState = broadcastInfo.partialSharedState;

  var startBroadcastState = function startBroadcastState() {
    broadcastState(targetRef, skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, renderKey, reactCallback);
  };

  var willBroadcast = function willBroadcast() {
    if (delay > 0) {
      var feature = computeFeature(targetRef.ctx.ccUniqueKey, committedState);
      (0, _runLater["default"])(startBroadcastState, feature, delay);
    } else {
      startBroadcastState();
    }
  };

  if (skipMiddleware) {
    willBroadcast();
    return;
  }

  var len = middlewares.length;

  if (len > 0) {
    passToMiddleware.sharedState = partialSharedState; //这个记录到store的状态也传给中间件ctx

    var index = 0;

    var next = function next() {
      if (index === len) {
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
}

function broadcastState(targetRef, skipBroadcastRefState, originalState, stateFor, moduleName, partialSharedState, renderKey, reactCallback) {
  if (skipBroadcastRefState === false) {
    var currentCcKey = targetRef.ctx.ccUniqueKey; // if stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, it means currentCcInstance has triggered __$$ccSetState
    // so flag ignoreCurrentCcKey as true;

    var ignoreCurrentCcKey = stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY;
    var ccClassKeys = moduleName_ccClassKeys_[moduleName];

    if (ccClassKeys) {
      //  these ccClass are watching the same module's state
      ccClassKeys.forEach(function (ccClassKey) {
        var classContext = ccClassKey_ccClassContext_[ccClassKey];
        var ccKeys = classContext.ccKeys,
            watchedKeys = classContext.watchedKeys,
            originalWatchedKeys = classContext.originalWatchedKeys;
        if (ccKeys.length === 0) return;
        if (watchedKeys.length === 0) return;
        var sharedStateForCurrentCcClass;

        if (originalWatchedKeys === '*') {
          sharedStateForCurrentCcClass = partialSharedState;
        } else {
          var _extractStateByKeys4 = (0, _extractStateByKeys5["default"])(partialSharedState, watchedKeys, true),
              partialState = _extractStateByKeys4.partialState,
              isStateEmpty = _extractStateByKeys4.isStateEmpty;

          if (isStateEmpty) return;
          sharedStateForCurrentCcClass = partialState;
        }

        ccKeys.forEach(function (ccKey) {
          if (ccKey === currentCcKey && ignoreCurrentCcKey) return;
          var ref = ccUkey_ref_[ccKey];

          if (ref) {
            if (_ccContext["default"].isDebug) {
              console.log(styleStr("received state for ref[" + ccKey + "] is broadcasted from same module's other ref " + currentCcKey), color());
            } // 这里的calledBy直接用'broadcastState'，仅供concent内部运行时用，同时这里也不会发送信号给插件


            prepareReactSetState(ref, renderKey, 'broadcastState', sharedStateForCurrentCcClass, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY);
          }
        });
      });
    }
  }

  broadcastConnectedState(moduleName, originalState); //hook的setter本来是没有回调的，官方是推荐用useEffect代替，concent放在这里执行，以达到hook 和 class 的setState达到一样的效果

  if (reactCallback && targetRef.ctx.type === cst.CC_HOOK_PREFIX) {
    reactCallback(targetRef.state);
  }
}

function broadcastConnectedState(commitModule, commitState) {
  var commitStateKeys = okeys(commitState); //提前把commitStateKeys拿到，省去了在updateConnectedState内部的多次获取过程

  var ccClassKeys = connectedModuleName_ccClassKeys_[commitModule] || [];
  ccClassKeys.forEach(function (ccClassKey) {
    var ccClassContext = ccClassKey_ccClassContext_[ccClassKey];
    updateConnectedState(ccClassContext, commitModule, commitState, commitStateKeys);
  });
}

function updateConnectedState(targetClassContext, commitModule, committedState, committedStateKeys) {
  var connectedModuleKeyMapping = targetClassContext.connectedModuleKeyMapping,
      connectedModule = targetClassContext.connectedModule;

  if (connectedModule[commitModule] === 1) {
    var ccKeys = targetClassContext.ccKeys;
    var isSetConnectedStateTriggered = false;
    var len = committedStateKeys.length;

    for (var i = 0; i < len; i++) {
      var moduledStateKey = commitModule + "/" + committedStateKeys[i];

      if (connectedModuleKeyMapping[moduledStateKey]) {
        isSetConnectedStateTriggered = true;
        break; //只要感知到有一个key发生变化，就可以跳出循环了，
        //因为connectedState指向的是store里state的引用，更新动作在store里修改时就已完成
      }
    } //针对targetClassContext，遍历完提交的state key，触发了更新connectedState的行为，把targetClassContext对应的cc实例都强制刷新一遍


    if (isSetConnectedStateTriggered === true) {
      var prevModuleState = getPrevState(commitModule);
      ccKeys.forEach(function (ccUniKey) {
        var ref = ccUkey_ref_[ccUniKey];

        if (ref && ref.__$$isUnmounted !== true) {
          var refCtx = ref.ctx;
          var shouldCurrentRefUpdate = (0, _watchKeyForRef["default"])(refCtx, commitModule, prevModuleState, committedState);
          (0, _computeValueForRef["default"])(refCtx, commitModule, ref.state, committedState);
          if (shouldCurrentRefUpdate) refCtx.__$$ccForceUpdate();
        }
      });
    }
  }
}