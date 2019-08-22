import * as util from '../../support/util';
import * as cst from '../../support/constant';
import runLater from '../base/run-later';
import ccContext from '../../cc-context';
import extractStateByKeys from '../state/extract-state-by-keys';
import watchKeyForRef from '../watch/watch-key-for-ref';
import computeValueForRef from '../computed/compute-value-for-ref';
import { send } from '../plugin';

const { isPlainJsonObject, justWarning, isObjectNotNull, computeFeature, okeys, styleStr, color } = util;
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

export default function (state, {
  module, skipMiddleware = false,
  reactCallback, type, reducerModule, calledBy = SET_STATE, fnName, renderKey = '', delay = -1 } = {}, targetRef
) {
  if (!isPlainJsonObject(state)) {
    justWarning(`your committed state is not a plain json object!`);
    return;
  }

  const { module: refModule, ccUniqueKey, ccKey } = targetRef.ctx;
  const stateFor = getStateFor(module, refModule);

  //在triggerReactSetState之前把状态存储到store，
  //防止属于同一个模块的父组件套子组件渲染时，父组件修改了state，子组件初次挂载是不能第一时间拿到state
  const sharedState = syncCommittedStateToStore(module, state);

  let passToMiddleware = {};
  if (skipMiddleware !== true) {
    passToMiddleware = { calledBy, type, ccKey, ccUniqueKey, state, sharedState, stateFor, module, reducerModule, fnName };
  }

  send(SIG_STATE_CHANGED, {
    committedState: state, sharedState,
    module, type: getActionType(calledBy, type), ccUniqueKey, renderKey
  });

  // source ref will receive the whole committed state 
  const renderType = triggerReactSetState(targetRef, renderKey, calledBy, state, stateFor, reactCallback);
  triggerBroadcastState(renderType, targetRef, skipMiddleware, passToMiddleware, sharedState, stateFor, module, renderKey, delay);
}

function triggerReactSetState(targetRef, renderKey, calledBy, state, stateFor, reactCallback) {
  if (
    targetRef.__$$isUnmounted === true ||
    stateFor !== STATE_FOR_ONE_CC_INSTANCE_FIRSTLY ||
    //确保forceUpdate能够刷新cc实例，因为state可能是{}，此时用户调用forceUpdate也要触发render
    calledBy !== FORCE_UPDATE && !isObjectNotNull(state)
  ) {
    return RENDER_NO_OP;
  }

  const { state: refState, ctx: refCtx } = targetRef;
  const { module: stateModule, storedKeys, ccOption, ccUniqueKey } = refCtx;
  let renderType = RENDER_BY_STATE;

  if (renderKey) {//if user specify renderKey
    renderType = RENDER_BY_KEY;
    if (ccOption.renderKey !== renderKey) {// current instance can been rendered only if current instance's ccKey equal renderKey
      return RENDER_NO_OP;
    }
  }

  if (storedKeys.length > 0) {
    const { partialState, isStateEmpty } = extractStateByKeys(state, storedKeys);
    if (!isStateEmpty) {
      if (ccOption.persistStoredKeys === true) {
        const { partialState: entireStoredState } = extractStateByKeys(refState, storedKeys);
        const currentStoredState = Object.assign({}, entireStoredState, partialState);
        localStorage.setItem('CCSS_' + ccUniqueKey, JSON.stringify(currentStoredState));
      }
      refStore.setState(ccUniqueKey, partialState);
    }
  }

  computeValueForRef(refCtx, stateModule, refState, state);
  const shouldCurrentRefUpdate = watchKeyForRef(refCtx, stateModule, refState, state);
  refCtx.__$$ccSetState(state, reactCallback, shouldCurrentRefUpdate);
  return renderType;
}

function syncCommittedStateToStore(moduleName, committedState) {
  const stateKeys = moduleName_stateKeys_[moduleName]
  const { isStateEmpty: isPartialSharedStateEmpty, partialState } = extractStateByKeys(committedState, stateKeys);

  //!!! save state to store
  if (!isPartialSharedStateEmpty) {
    setState(moduleName, partialState);
    return partialState;
  }
  return null;
}

function triggerBroadcastState(renderType, targetRef, skipMiddleware, passToMiddleware, sharedState, stateFor,
  moduleName, renderKey, delay
) {
  const startBroadcastState = () => {
    broadcastState(renderType, targetRef, sharedState, stateFor, moduleName, renderKey);
  };

  const willBroadcast = () => {
    if (delay > 0) {
      const feature = computeFeature(targetRef.ctx.ccUniqueKey, sharedState);
      runLater(startBroadcastState, feature, delay);
    } else {
      startBroadcastState();
    }
  }

  if (skipMiddleware) {
    willBroadcast();
    return;
  }

  const len = middlewares.length;
  if (len > 0) {
    let index = 0;
    const next = () => {
      if (index === len) {// all middlewares been executed
        willBroadcast();
      } else {
        const middlewareFn = middlewares[index];
        index++;
        middlewareFn(passToMiddleware, next);
      }
    }
    next();
  } else {
    willBroadcast();
  }
}

function updateRefs(ccUkeys, moduleName, partialSharedState) {
  ccUkeys.forEach(ukey => {
    const ref = ccUkey_ref_[ukey];
    if (ref.ctx.module === moduleName) {
      //这里不对各个ukey对应的class查其watchedKeys然后提取partialSharedState了，此时renderKey优先级高于watchedKeys
      triggerReactSetState(ref, null, 'broadcastState', partialSharedState, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY);
    } else {
      // consider this is a redundant render behavior .....
      // ref.__$$ccForceUpdate();
    }
  });
}

function broadcastState(renderType, targetRef, partialSharedState, stateFor, moduleName, renderKey) {
  if (!partialSharedState) {// null
    return;
  }

  const { ccUniqueKey: currentCcUkey, ccClassKey } = targetRef.ctx;
  const targetClassContext = ccClassKey_ccClassContext_[ccClassKey];
  const renderKeyClasses = targetClassContext.renderKeyClasses;

  if (renderKey) {
    // 如果renderKey是ukey（此时renderType是RENDER_BY_KEY）, 则不会进入updateRefs逻辑
    if (
      (renderType === RENDER_BY_KEY && !ccUkey_ref_[renderKey]) ||
      renderType === RENDER_NO_OP
    ) {

      // targetRef刚刚已被触发过渲染，这里排除掉currentCcUkey
      const ccUkeys = renderKey_ccUkeys_[renderKey].slice();
      const ukeyIndex = ccUkeys.indexOf(currentCcUkey);
      if (ukeyIndex > -1) ccUkeys.splice(ukeyIndex, 1);

      updateRefs(ccUkeys, moduleName, partialSharedState);
    }
  }

  if (renderKeyClasses !== '*') {
    // if stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, it means currentCcInstance has triggered __$$ccSetState
    // so flag ignoreCurrentCcUkey as true;
    const ignoreCurrentCcUkey = stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY;

    // these ccClass are watching the same module's state
    const ccClassKeys = moduleName_ccClassKeys_[moduleName];
    if (ccClassKeys) {
      const keysLen = ccClassKeys.length;
      for (let i = 0; i < keysLen; i++) {
        const ccClassKey = ccClassKeys[i];
        // 如ref渲染由RENDER_BY_KEY触犯，当前ccClassKey在renderKeyClasses范围内，它已经交给renderKey匹配规则去触发渲染了，这里直接跳出
        if (renderType === RENDER_BY_KEY && renderKeyClasses.includes(ccClassKey)) continue;

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
          if (ccKey === currentCcUkey && ignoreCurrentCcUkey) return;
          const ref = ccUkey_ref_[ccKey];
          if (ref) {
            // 这里的calledBy直接用'broadcastState'，仅供concent内部运行时用，同时这ignoreCurrentCcUkey里也不会发送信号给插件
            triggerReactSetState(ref, null, 'broadcastState', sharedStateForCurrentCcClass, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY);
          }
        });
      }
    }
  }

  broadcastConnectedState(moduleName, partialSharedState);
}

function broadcastConnectedState(commitModule, sharedState) {
  const sharedStateKeys = okeys(sharedState);//提前把sharedStateKeys拿到，省去了在updateConnectedState内部的多次获取过程

  const ccClassKeys = connectedModuleName_ccClassKeys_[commitModule] || [];
  ccClassKeys.forEach(ccClassKey => {
    const ccClassContext = ccClassKey_ccClassContext_[ccClassKey];
    updateConnectedState(ccClassContext, commitModule, sharedState, sharedStateKeys);
  });
}

function updateConnectedState(targetClassContext, targetModule, sharedState, sharedStateKeys) {
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
          const shouldCurrentRefUpdate = watchKeyForRef(refCtx, targetModule, prevModuleState, sharedState);
          computeValueForRef(refCtx, targetModule, ref.state, sharedState);
          if (shouldCurrentRefUpdate) refCtx.__$$ccForceUpdate();
        }
      });
    }

  }
}
