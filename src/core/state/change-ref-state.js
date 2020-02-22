import * as util from '../../support/util';
import * as cst from '../../support/constant';
import { NOT_A_JSON } from '../../support/priv-constant';
import runLater from '../base/run-later';
import ccContext from '../../cc-context';
import extractStateByKeys from '../state/extract-state-by-keys';
import watchKeyForRef from '../watch/watch-key-for-ref';
import computeValueForRef from '../computed/compute-value-for-ref';
import { send } from '../plugin';

const { isPlainJsonObject, justWarning, isObjectNotNull, computeFeature, okeys, removeArrElements } = util;
const {
  STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
  FORCE_UPDATE, SET_STATE, SET_MODULE_STATE, INVOKE, SYNC,
  SIG_STATE_CHANGED,
  RENDER_NO_OP, RENDER_BY_KEY, RENDER_BY_STATE,
} = cst;
const {
  store: { setState, getPrevState }, middlewares, moduleName_ccClassKeys_, ccClassKey_ccClassContext_,
  connectedModuleName_ccClassKeys_, refStore, moduleName_stateKeys_, ccUkey_ref_, renderKey_ccUkeys_,
} = ccContext;

//触发修改状态的实例所属模块和目标模块不一致的时候，stateFor是STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE
function getStateFor(targetModule, refModule) {
  return targetModule === refModule ? STATE_FOR_ONE_CC_INSTANCE_FIRSTLY : STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE;
}

function getActionType(calledBy, type) {
  if ([FORCE_UPDATE, SET_STATE, SET_MODULE_STATE, INVOKE, SYNC].includes(calledBy)) {
    return `ccApi/${calledBy}`;
  } else {
    return `dispatch/${type}`;
  }
}

function callMiddlewares(skipMiddleware, passToMiddleware, cb) {
  if (skipMiddleware !== true) {
    const len = middlewares.length;
    if (len > 0) {
      let index = 0;
      const next = () => {
        if (index === len) {// all middlewares been executed
          cb();
        } else {
          const middlewareFn = middlewares[index];
          index++;
          middlewareFn(passToMiddleware, next);
        }
      }
      next();
    } else {
      cb();
    }
  } else {
    cb();
  }
}

/**
 * 
 * @param {*} state 
 * @param {*} option 
 * @param {*} targetRef 
 */
export default function (state, {
  module, skipMiddleware = false, payload,
  reactCallback, type, reducerModule, calledBy = SET_STATE, fnName = '', renderKey = '', delay = -1 } = {}, targetRef
) {
  if (state === undefined) return;

  if (!isPlainJsonObject(state)) {
    justWarning(`your committed state ${NOT_A_JSON}`);
    return;
  }

  const { module: refModule, ccUniqueKey, ccKey } = targetRef.ctx;
  const stateFor = getStateFor(module, refModule);
  const passToMiddleware = {
    calledBy, type, payload, renderKey, delay, ccKey, ccUniqueKey,
    state, refModule, module, reducerModule, fnName
  };
  const callInfo = { payload, renderKey, ccKey };

  //在triggerReactSetState之前把状态存储到store，
  //防止属于同一个模块的父组件套子组件渲染时，父组件修改了state，子组件初次挂载是不能第一时间拿到state
  const passedCtx = stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY ? targetRef.ctx : null;
  const sharedState = syncCommittedStateToStore(module, state, { refCtx: passedCtx, callInfo });
  Object.assign(state, sharedState);

  // source ref will receive the whole committed state 
  triggerReactSetState(targetRef, callInfo, renderKey, calledBy, state, stateFor, reactCallback, (renderType, committedState) => {

    if (renderType === RENDER_NO_OP && !sharedState) {
    } else {
      send(SIG_STATE_CHANGED, {
        committedState, sharedState,
        module, type: getActionType(calledBy, type), ccUniqueKey, renderKey
      });
    }

    if (sharedState) triggerBroadcastState(callInfo, targetRef, sharedState, stateFor, module, renderKey, delay);
  }, skipMiddleware, passToMiddleware);
}

function triggerReactSetState(targetRef, callInfo, renderKey, calledBy, state, stateFor, reactCallback, next, skipMiddleware, passToMiddleware) {
  const { state: refState, ctx: refCtx } = targetRef;
  if (
    targetRef.__$$isUnmounted === true ||
    stateFor !== STATE_FOR_ONE_CC_INSTANCE_FIRSTLY ||
    //确保forceUpdate能够刷新cc实例，因为state可能是{}，此时用户调用forceUpdate也要触发render
    calledBy !== FORCE_UPDATE && !isObjectNotNull(state)
  ) {
    if (reactCallback) reactCallback(refState);
    return next && next(RENDER_NO_OP, state);
  }

  const { module: stateModule, storedKeys, ccUniqueKey } = refCtx;
  let renderType = RENDER_BY_STATE;

  if (renderKey) {//if user specify renderKey
    renderType = RENDER_BY_KEY;
    if (refCtx.renderKey !== renderKey) {// current instance can been rendered only if current instance's ccKey equal renderKey
      return next && next(RENDER_NO_OP, state);
    }
  }

  if (storedKeys.length > 0) {
    const { partialState, isStateEmpty } = extractStateByKeys(state, storedKeys);
    if (!isStateEmpty) {
      if (refCtx.persistStoredKeys === true) {
        const { partialState: entireStoredState } = extractStateByKeys(refState, storedKeys);
        const currentStoredState = Object.assign({}, entireStoredState, partialState);
        localStorage.setItem('CCSS_' + ccUniqueKey, JSON.stringify(currentStoredState));
      }
      refStore.setState(ccUniqueKey, partialState);
    }
  }

  let deltaCommittedState = computeValueForRef(refCtx, stateModule, refState, state, callInfo);
  const shouldCurrentRefUpdate = watchKeyForRef(refCtx, stateModule, refState, deltaCommittedState, callInfo, false, true);

  const ccSetState = () => refCtx.__$$ccSetState(deltaCommittedState, reactCallback, shouldCurrentRefUpdate);
  if (next) {
    passToMiddleware.state = deltaCommittedState;
    callMiddlewares(skipMiddleware, passToMiddleware, () => {
      ccSetState();
      next(renderType, deltaCommittedState);
    });
  } else {
    ccSetState();
  }
}

function syncCommittedStateToStore(moduleName, committedState, options) {
  const stateKeys = moduleName_stateKeys_[moduleName];
  // extract shared state
  const { partialState } = extractStateByKeys(committedState, stateKeys, true);

  // save state to store
  if (partialState) {
    const mayChangedState = setState(moduleName, partialState, options);
    Object.assign(partialState, mayChangedState);
    return partialState;
  }

  return partialState;
}

function triggerBroadcastState(callInfo, targetRef, sharedState, stateFor, moduleName, renderKey, delay) {
  const startBroadcastState = () => {
    broadcastState(callInfo, targetRef, sharedState, stateFor, moduleName, renderKey);
  };

  if (delay > 0) {
    const feature = computeFeature(targetRef.ctx.ccUniqueKey, sharedState);
    runLater(startBroadcastState, feature, delay);
  } else {
    startBroadcastState();
  }
}

function updateRefs(ccUkeys, moduleName, partialSharedState, callInfo) {
  ccUkeys.forEach(ukey => {
    const ref = ccUkey_ref_[ukey];
    const refModule = ref.ctx.module;
    if (refModule === moduleName) {
      //这里不对各个ukey对应的class查其watchedKeys然后提取partialSharedState了，此时renderKey优先级高于watchedKeys
      triggerReactSetState(ref, callInfo, null, 'broadcastState', partialSharedState, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY);
    } else {
      // consider this is a redundant render behavior .....
      // ref.__$$ccForceUpdate();
      util.justTip(`although ref's renderKey matched but its module ${refModule} mismatch target module ${moduleName}, cc will ignore trigger it re-render`);
    }
  });
}

function broadcastState(callInfo, targetRef, partialSharedState, stateFor, moduleName, renderKey) {
  if (!partialSharedState) {// null
    return;
  }

  const { ccUniqueKey: currentCcUkey, ccClassKey } = targetRef.ctx;
  const targetClassContext = ccClassKey_ccClassContext_[ccClassKey];
  const renderKeyClasses = targetClassContext.renderKeyClasses;

  // if stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, it means currentCcInstance has triggered __$$ccSetState
  // so flag ignoreCurrentCcUkey as true;
  const ignoreCurrentCcUkey = stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY;
  
  // these ccClass are watching the same module's state
  let ccClassKeys = moduleName_ccClassKeys_[moduleName] || [];
  let toExcludeUkeys = [];

  if (renderKey) {//调用发起者传递了renderKey
    // 此时renderType一定是 RENDER_BY_KEY or RENDER_NO_OP
    if (renderKeyClasses === '*') {
      // renderKey规则在同一个模块下没有类范围约束，所有renderKey属性为传入的{renderKey}的实例都会被触发渲染
      // 这里人工设置ccClassKeys为[]，让下面的遍历ccClassKeys找目标渲染被跳过，走renderKey匹配渲染规则
      ccClassKeys = [];
    } else {
      ccClassKeys = removeArrElements(ccClassKeys, renderKeyClasses);//移除掉指定的类
    }

    const ccUkeysOri = renderKey_ccUkeys_[renderKey] || [];
    // targetRef刚刚可能已被触发过渲染，这里排除掉currentCcUkey, 这里使用excludeArrStringItem比removeArrElements效率更高
    const ccUkeys = util.excludeArrStringItem(ccUkeysOri, currentCcUkey);
    toExcludeUkeys = ccUkeys;
    updateRefs(ccUkeys, moduleName, partialSharedState, callInfo);
  }

  const keysLen = ccClassKeys.length;
  for (let i = 0; i < keysLen; i++) {
    const ccClassKey = ccClassKeys[i];

    const classContext = ccClassKey_ccClassContext_[ccClassKey];
    const { ccKeys, watchedKeys, originalWatchedKeys } = classContext;
    if (ccKeys.length === 0) continue;
    if (watchedKeys.length === 0) continue;

    let sharedStateForCurrentCcClass;
    if (originalWatchedKeys === '*') {
      sharedStateForCurrentCcClass = partialSharedState;
    } else {
      const { partialState, isStateEmpty } = extractStateByKeys(partialSharedState, watchedKeys, true);
      if (isStateEmpty) continue;
      sharedStateForCurrentCcClass = partialState;
    }

    ccKeys.forEach(ccKey => {
      if (toExcludeUkeys.includes(ccKey)) return;
      if (ccKey === currentCcUkey && ignoreCurrentCcUkey) return;
      const ref = ccUkey_ref_[ccKey];
      if (ref) {
        // 这里的calledBy直接用'broadcastState'，仅供concent内部运行时用，同时这ignoreCurrentCcUkey里也不会发送信号给插件
        triggerReactSetState(ref, callInfo, null, 'broadcastState', sharedStateForCurrentCcClass, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY);
      }
    });
  }

  broadcastConnectedState(moduleName, partialSharedState, callInfo);
}

function broadcastConnectedState(commitModule, sharedState, callInfo) {
  const sharedStateKeys = okeys(sharedState);//提前把sharedStateKeys拿到，省去了在updateConnectedState内部的多次获取过程

  const ccClassKeys = connectedModuleName_ccClassKeys_[commitModule] || [];
  ccClassKeys.forEach(ccClassKey => {
    const ccClassContext = ccClassKey_ccClassContext_[ccClassKey];
    updateConnectedState(ccClassContext, commitModule, sharedState, sharedStateKeys, callInfo);
  });
}

function updateConnectedState(targetClassContext, targetModule, sharedState, sharedStateKeys, callInfo) {
  const { connectedModuleKeyMapping, connectedModule } = targetClassContext;
  if (connectedModule[targetModule] === 1) {

    const { ccKeys } = targetClassContext;
    let isSetConnectedStateTriggered = false;
    const len = sharedStateKeys.length;
    for (let i = 0; i < len; i++) {
      const moduledStateKey = `${targetModule}/${sharedStateKeys[i]}`;
      if (connectedModuleKeyMapping[moduledStateKey]) {
        isSetConnectedStateTriggered = true;
        break;
        //只要感知到有一个key发生变化，就可以跳出循环了，
        //因为connectedState指向的是store里state的引用，更新动作在store里修改时就已完成
      }
    }

    //针对targetClassContext，遍历完提交的state key，触发了更新connectedState的行为，把targetClassContext对应的cc实例都强制刷新一遍
    if (isSetConnectedStateTriggered === true) {
      const prevModuleState = getPrevState(targetModule);
      ccKeys.forEach(ccUniKey => {
        const ref = ccUkey_ref_[ccUniKey];
        if (ref && ref.__$$isUnmounted !== true) {
          const refCtx = ref.ctx;
          computeValueForRef(refCtx, targetModule, prevModuleState, sharedState, callInfo);
          const shouldCurrentRefUpdate = watchKeyForRef(refCtx, targetModule, prevModuleState, sharedState, callInfo);
          if (shouldCurrentRefUpdate) refCtx.__$$ccForceUpdate();
        }
      });
    }

  }
}
