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
    SIG_STATE_CHANGED = cst.SIG_STATE_CHANGED,
    RENDER_NO_OP = cst.RENDER_NO_OP,
    RENDER_BY_KEY = cst.RENDER_BY_KEY,
    RENDER_BY_STATE = cst.RENDER_BY_STATE;
var _ccContext$store = _ccContext["default"].store,
    setState = _ccContext$store.setState,
    getPrevState = _ccContext$store.getPrevState,
    middlewares = _ccContext["default"].middlewares,
    moduleName_ccClassKeys_ = _ccContext["default"].moduleName_ccClassKeys_,
    ccClassKey_ccClassContext_ = _ccContext["default"].ccClassKey_ccClassContext_,
    connectedModuleName_ccClassKeys_ = _ccContext["default"].connectedModuleName_ccClassKeys_,
    refStore = _ccContext["default"].refStore,
    moduleName_stateKeys_ = _ccContext["default"].moduleName_stateKeys_,
    ccUkey_ref_ = _ccContext["default"].ccUkey_ref_,
    renderKey_ccUkeys_ = _ccContext["default"].renderKey_ccUkeys_; //触发修改状态的实例所属模块和目标模块不一致的时候，stateFor是STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE

function getStateFor(targetModule, refModule) {
  return targetModule === refModule ? STATE_FOR_ONE_CC_INSTANCE_FIRSTLY : STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE;
}

function getActionType(calledBy, type) {
  if ([FORCE_UPDATE, SET_STATE, SET_MODULE_STATE, INVOKE, SYNC].includes(calledBy)) {
    return "ccApi/" + calledBy;
  } else {
    return "dispatch/" + type;
  }
}

function callMiddlewares(skipMiddleware, passToMiddleware, cb) {
  if (skipMiddleware !== true) {
    var len = middlewares.length;

    if (len > 0) {
      var index = 0;

      var next = function next() {
        if (index === len) {
          // all middlewares been executed
          cb();
        } else {
          var middlewareFn = middlewares[index];
          index++;
          middlewareFn(passToMiddleware, next);
        }
      };

      next();
    } else {
      cb();
    }
  } else {
    cb();
  }
}

function _default(state, _temp, targetRef) {
  var _ref = _temp === void 0 ? {} : _temp,
      module = _ref.module,
      _ref$skipMiddleware = _ref.skipMiddleware,
      skipMiddleware = _ref$skipMiddleware === void 0 ? false : _ref$skipMiddleware,
      reactCallback = _ref.reactCallback,
      type = _ref.type,
      reducerModule = _ref.reducerModule,
      _ref$calledBy = _ref.calledBy,
      calledBy = _ref$calledBy === void 0 ? SET_STATE : _ref$calledBy,
      _ref$fnName = _ref.fnName,
      fnName = _ref$fnName === void 0 ? '' : _ref$fnName,
      _ref$renderKey = _ref.renderKey,
      renderKey = _ref$renderKey === void 0 ? '' : _ref$renderKey,
      _ref$delay = _ref.delay,
      delay = _ref$delay === void 0 ? -1 : _ref$delay;

  if (!isPlainJsonObject(state)) {
    justWarning("your committed state is not a plain json object!");
    return;
  }

  var _targetRef$ctx = targetRef.ctx,
      refModule = _targetRef$ctx.module,
      ccUniqueKey = _targetRef$ctx.ccUniqueKey,
      ccKey = _targetRef$ctx.ccKey;
  var stateFor = getStateFor(module, refModule);
  var passToMiddleware = {
    calledBy: calledBy,
    type: type,
    ccKey: ccKey,
    ccUniqueKey: ccUniqueKey,
    state: state,
    refModule: refModule,
    module: module,
    reducerModule: reducerModule,
    fnName: fnName
  };
  callMiddlewares(skipMiddleware, passToMiddleware, function () {
    //在triggerReactSetState之前把状态存储到store，
    //防止属于同一个模块的父组件套子组件渲染时，父组件修改了state，子组件初次挂载是不能第一时间拿到state
    var passedCtx = stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY ? targetRef.ctx : null;
    var sharedState = syncCommittedStateToStore(module, state, passedCtx);
    (0, _plugin.send)(SIG_STATE_CHANGED, {
      committedState: state,
      sharedState: sharedState,
      module: module,
      type: getActionType(calledBy, type),
      ccUniqueKey: ccUniqueKey,
      renderKey: renderKey
    }); // source ref will receive the whole committed state 

    var renderType = triggerReactSetState(targetRef, renderKey, calledBy, state, stateFor, reactCallback);
    triggerBroadcastState(renderType, targetRef, sharedState, stateFor, module, renderKey, delay);
  });
}

function triggerReactSetState(targetRef, renderKey, calledBy, state, stateFor, reactCallback) {
  var refState = targetRef.state,
      refCtx = targetRef.ctx;

  if (targetRef.__$$isUnmounted === true || stateFor !== STATE_FOR_ONE_CC_INSTANCE_FIRSTLY || //确保forceUpdate能够刷新cc实例，因为state可能是{}，此时用户调用forceUpdate也要触发render
  calledBy !== FORCE_UPDATE && !isObjectNotNull(state)) {
    if (reactCallback) reactCallback(refState);
    return RENDER_NO_OP;
  }

  var stateModule = refCtx.module,
      storedKeys = refCtx.storedKeys,
      ccOption = refCtx.ccOption,
      ccUniqueKey = refCtx.ccUniqueKey;
  var renderType = RENDER_BY_STATE;

  if (renderKey) {
    //if user specify renderKey
    renderType = RENDER_BY_KEY;

    if (ccOption.renderKey !== renderKey) {
      // current instance can been rendered only if current instance's ccKey equal renderKey
      return RENDER_NO_OP;
    }
  }

  if (storedKeys.length > 0) {
    var _extractStateByKeys = (0, _extractStateByKeys5["default"])(state, storedKeys),
        partialState = _extractStateByKeys.partialState,
        isStateEmpty = _extractStateByKeys.isStateEmpty;

    if (!isStateEmpty) {
      if (ccOption.persistStoredKeys === true) {
        var _extractStateByKeys2 = (0, _extractStateByKeys5["default"])(refState, storedKeys),
            entireStoredState = _extractStateByKeys2.partialState;

        var currentStoredState = Object.assign({}, entireStoredState, partialState);
        localStorage.setItem('CCSS_' + ccUniqueKey, JSON.stringify(currentStoredState));
      }

      refStore.setState(ccUniqueKey, partialState);
    }
  }

  (0, _computeValueForRef["default"])(refCtx, stateModule, refState, state);
  var shouldCurrentRefUpdate = (0, _watchKeyForRef["default"])(refCtx, stateModule, refState, state);

  refCtx.__$$ccSetState(state, reactCallback, shouldCurrentRefUpdate);

  return renderType;
}

function syncCommittedStateToStore(moduleName, committedState, refCtx) {
  var stateKeys = moduleName_stateKeys_[moduleName];

  var _extractStateByKeys3 = (0, _extractStateByKeys5["default"])(committedState, stateKeys),
      isPartialSharedStateEmpty = _extractStateByKeys3.isStateEmpty,
      partialState = _extractStateByKeys3.partialState; //!!! save state to store


  if (!isPartialSharedStateEmpty) {
    setState(moduleName, partialState, refCtx);
    return partialState;
  }

  return null;
}

function triggerBroadcastState(renderType, targetRef, sharedState, stateFor, moduleName, renderKey, delay) {
  var startBroadcastState = function startBroadcastState() {
    broadcastState(renderType, targetRef, sharedState, stateFor, moduleName, renderKey);
  };

  if (delay > 0) {
    var feature = computeFeature(targetRef.ctx.ccUniqueKey, sharedState);
    (0, _runLater["default"])(startBroadcastState, feature, delay);
  } else {
    startBroadcastState();
  }
}

function updateRefs(ccUkeys, moduleName, partialSharedState) {
  ccUkeys.forEach(function (ukey) {
    var ref = ccUkey_ref_[ukey];

    if (ref.ctx.module === moduleName) {
      //这里不对各个ukey对应的class查其watchedKeys然后提取partialSharedState了，此时renderKey优先级高于watchedKeys
      triggerReactSetState(ref, null, 'broadcastState', partialSharedState, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY);
    } else {// consider this is a redundant render behavior .....
      // ref.__$$ccForceUpdate();
    }
  });
}

function broadcastState(renderType, targetRef, partialSharedState, stateFor, moduleName, renderKey) {
  if (!partialSharedState) {
    // null
    return;
  }

  var _targetRef$ctx2 = targetRef.ctx,
      currentCcUkey = _targetRef$ctx2.ccUniqueKey,
      ccClassKey = _targetRef$ctx2.ccClassKey;
  var targetClassContext = ccClassKey_ccClassContext_[ccClassKey];
  var renderKeyClasses = targetClassContext.renderKeyClasses;

  if (renderKey) {
    // 如果renderKey是ukey（此时renderType是RENDER_BY_KEY）, 则不会进入updateRefs逻辑
    if (renderType === RENDER_BY_KEY && !ccUkey_ref_[renderKey] || renderType === RENDER_NO_OP) {
      // targetRef刚刚已被触发过渲染，这里排除掉currentCcUkey
      var ccUkeys = renderKey_ccUkeys_[renderKey].slice();
      var ukeyIndex = ccUkeys.indexOf(currentCcUkey);
      if (ukeyIndex > -1) ccUkeys.splice(ukeyIndex, 1);
      updateRefs(ccUkeys, moduleName, partialSharedState);
    }
  }

  if (renderKeyClasses !== '*') {
    (function () {
      // if stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, it means currentCcInstance has triggered __$$ccSetState
      // so flag ignoreCurrentCcUkey as true;
      var ignoreCurrentCcUkey = stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY; // these ccClass are watching the same module's state

      var ccClassKeys = moduleName_ccClassKeys_[moduleName];

      if (ccClassKeys) {
        var keysLen = ccClassKeys.length;

        var _loop = function _loop(i) {
          var ccClassKey = ccClassKeys[i]; // 如ref渲染由RENDER_BY_KEY触犯，当前ccClassKey在renderKeyClasses范围内，它已经交给renderKey匹配规则去触发渲染了，这里直接跳出

          if (renderType === RENDER_BY_KEY && renderKeyClasses.includes(ccClassKey)) return "continue";
          var classContext = ccClassKey_ccClassContext_[ccClassKey];
          var ccKeys = classContext.ccKeys,
              watchedKeys = classContext.watchedKeys,
              originalWatchedKeys = classContext.originalWatchedKeys;
          if (ccKeys.length === 0) return "continue";
          if (watchedKeys.length === 0) return "continue";
          var sharedStateForCurrentCcClass = void 0;

          if (originalWatchedKeys === '*') {
            sharedStateForCurrentCcClass = partialSharedState;
          } else {
            var _extractStateByKeys4 = (0, _extractStateByKeys5["default"])(partialSharedState, watchedKeys, true),
                partialState = _extractStateByKeys4.partialState,
                isStateEmpty = _extractStateByKeys4.isStateEmpty;

            if (isStateEmpty) return "continue";
            sharedStateForCurrentCcClass = partialState;
          }

          ccKeys.forEach(function (ccKey) {
            if (ccKey === currentCcUkey && ignoreCurrentCcUkey) return;
            var ref = ccUkey_ref_[ccKey];

            if (ref) {
              // 这里的calledBy直接用'broadcastState'，仅供concent内部运行时用，同时这ignoreCurrentCcUkey里也不会发送信号给插件
              triggerReactSetState(ref, null, 'broadcastState', sharedStateForCurrentCcClass, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY);
            }
          });
        };

        for (var i = 0; i < keysLen; i++) {
          var _ret = _loop(i);

          if (_ret === "continue") continue;
        }
      }
    })();
  }

  broadcastConnectedState(moduleName, partialSharedState);
}

function broadcastConnectedState(commitModule, sharedState) {
  var sharedStateKeys = okeys(sharedState); //提前把sharedStateKeys拿到，省去了在updateConnectedState内部的多次获取过程

  var ccClassKeys = connectedModuleName_ccClassKeys_[commitModule] || [];
  ccClassKeys.forEach(function (ccClassKey) {
    var ccClassContext = ccClassKey_ccClassContext_[ccClassKey];
    updateConnectedState(ccClassContext, commitModule, sharedState, sharedStateKeys);
  });
}

function updateConnectedState(targetClassContext, targetModule, sharedState, sharedStateKeys) {
  var connectedModuleKeyMapping = targetClassContext.connectedModuleKeyMapping,
      connectedModule = targetClassContext.connectedModule;

  if (connectedModule[targetModule] === 1) {
    var ccKeys = targetClassContext.ccKeys;
    var isSetConnectedStateTriggered = false;
    var len = sharedStateKeys.length;

    for (var i = 0; i < len; i++) {
      var moduledStateKey = targetModule + "/" + sharedStateKeys[i];

      if (connectedModuleKeyMapping[moduledStateKey]) {
        isSetConnectedStateTriggered = true;
        break; //只要感知到有一个key发生变化，就可以跳出循环了，
        //因为connectedState指向的是store里state的引用，更新动作在store里修改时就已完成
      }
    } //针对targetClassContext，遍历完提交的state key，触发了更新connectedState的行为，把targetClassContext对应的cc实例都强制刷新一遍


    if (isSetConnectedStateTriggered === true) {
      var prevModuleState = getPrevState(targetModule);
      ccKeys.forEach(function (ccUniKey) {
        var ref = ccUkey_ref_[ccUniKey];

        if (ref && ref.__$$isUnmounted !== true) {
          var refCtx = ref.ctx;
          (0, _computeValueForRef["default"])(refCtx, targetModule, prevModuleState, sharedState);
          var shouldCurrentRefUpdate = (0, _watchKeyForRef["default"])(refCtx, targetModule, prevModuleState, sharedState);
          if (shouldCurrentRefUpdate) refCtx.__$$ccForceUpdate();
        }
      });
    }
  }
}