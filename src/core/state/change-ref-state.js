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

function getStateFor(inputModule, refModule) {
  return inputModule === refModule ? STATE_FOR_ONE_CC_INSTANCE_FIRSTLY : STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE;
}

function getActionType(calledBy, type) {
  if ([FORCE_UPDATE, SET_STATE, SET_MODULE_STATE, INVOKE, SYNC].includes(calledBy)) {
    return `ccApi/${calledBy}`;
  }else{
    return `dispatch/${type}`;
  }
}

//hook的setter本来是没有回调的，官方是推荐用useEffect代替，concent放在这里执行，以达到hook 和 class 的setState达到一样的效果
function triggerHookCb(reactCallback, targetRef) {
  if (reactCallback && targetRef.ctx.type === cst.CC_HOOK_PREFIX) {
    reactCallback(targetRef.state);
  }
}

export default function (state, {
  ccKey, ccUniqueKey, module, skipMiddleware = false,
  reactCallback, type, reducerModule, calledBy = SET_STATE, fnName, renderKey, delay = -1 } = {}, targetRef
) {
  const stateFor = getStateFor(module, targetRef.ctx.module);

  if (state === undefined) return;//do nothing
  // const isControlledByConcent = targetRef.ctx.isControlledByConcent;

  if (!isPlainJsonObject(state)) {
    justWarning(`cc found your commit state is not a plain json object!`);
    return;
  }

  const currentModule = targetRef.ctx.module;

  let passToMiddleware = {};
  if (skipMiddleware !== true) {
    passToMiddleware = { calledBy, type, ccKey, ccUniqueKey, state, stateFor, module, reducerModule, fnName };
  }

  //在triggerReactSetState之前把状态存储到store，
  //防止属于同一个模块的父组件套子组件渲染时，父组件修改了state，子组件初次挂载是不能第一时间拿到state
  const broadcastInfo = syncCommittedStateToStore(module, state);

  send(SIG_STATE_CHANGED, {
    committedState: state, sharedState: broadcastInfo.partialSharedState,
    module, type: getActionType(calledBy, type), ccUniqueKey
  });

  if (module === currentModule) {
    // who trigger changeRefState, who will receive the whole committed state 
    const renderType = triggerReactSetState(targetRef, renderKey, calledBy, state, stateFor, reactCallback);

    triggerBroadcastState(renderType, targetRef, skipMiddleware, passToMiddleware, broadcastInfo, stateFor, module, renderKey, delay,  reactCallback);
  } else {
    if (reactCallback) justWarning(`callback for react.setState will be ignore`);
    //触发修改状态的实例所属模块和目标模块不一致的时候，这里的stateFor必须是OF_ONE_MODULE
    triggerBroadcastState(RENDER_NO_OP, targetRef, skipMiddleware, passToMiddleware, broadcastInfo, STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, module, renderKey, delay, reactCallback);
  }
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

  const thisState = targetRef.state;
  const refCtx = targetRef.ctx;
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
        const { partialState: entireStoredState } = extractStateByKeys(thisState, storedKeys);
        const currentStoredState = Object.assign({}, entireStoredState, partialState);
        localStorage.setItem('CCSS_' + ccUniqueKey, JSON.stringify(currentStoredState));
      }
      refStore.setState(ccUniqueKey, partialState);
    }
  }

  computeValueForRef(refCtx, stateModule, thisState, state);
  const shouldCurrentRefUpdate = watchKeyForRef(refCtx, stateModule, thisState, state);

  refCtx.__$$ccSetState(state, reactCallback, shouldCurrentRefUpdate);
  return renderType;
}

function syncCommittedStateToStore(moduleName, committedState) {
  const stateKeys = moduleName_stateKeys_[moduleName]
  const { isStateEmpty: isPartialSharedStateEmpty, partialState: partialSharedState } = extractStateByKeys(committedState, stateKeys);

  let isSharedStateNull = false;
  //!!! save state to store
  if (!isPartialSharedStateEmpty) setState(moduleName, partialSharedState);
  else isSharedStateNull = true;

  return { partialSharedState, isSharedStateNull };
}

function triggerBroadcastState(renderType, targetRef, skipMiddleware, passToMiddleware, broadcastInfo, stateFor,
  moduleName, renderKey, delay, reactCallback
) {
  const { isSharedStateNull, partialSharedState } = broadcastInfo;
  const startBroadcastState = () => {
    broadcastState(renderType, targetRef, isSharedStateNull, stateFor, moduleName, partialSharedState, renderKey, reactCallback);
  };

  const willBroadcast = () => {
    if (delay > 0) {
      const feature = computeFeature(targetRef.ctx.ccUniqueKey, partialSharedState);
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
    passToMiddleware.sharedState = partialSharedState; //这个记录到store的状态也传给中间件ctx
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

function broadcastState(renderType, targetRef, isSharedStateNull, stateFor, moduleName, partialSharedState, renderKey, reactCallback) {
  if (isSharedStateNull) {
    return;
  }

  // if stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, it means currentCcInstance has triggered __$$ccSetState
  // so flag ignoreCurrentCcKey as true;
  const ignoreCurrentCcKey = stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY;
  const { ccUniqueKey: currentCcKey } = targetRef.ctx;

  if (renderKey) {
    //如果是基于renderKey触发的渲染，且传入的renderKey是ccUniqueKey, 组件刚刚被触发过渲染
    if (renderType === RENDER_BY_KEY && ccUkey_ref_[renderKey]) {
      //do nothing
    } else if (renderType === RENDER_NO_OP) {
      const ccUkeys = renderKey_ccUkeys_[renderKey];
      const refs = ccUkeys.map(ukey => ccUkey_ref_[ukey]);
      refs.forEach(ref => {
        if(ref.ctx.module === moduleName){
          //这里不对各个ukey对应的class查其watchedKeys然后提取partialSharedState了，renderKey优先级高于watchedKeys
          triggerReactSetState(ref, null, 'broadcastState', partialSharedState, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY);
        }else{
          // consider this is a redundant render behavior .....
          ref.__$$ccForceUpdate(reactCallback);
        }
      });
    }
  } else {
    // these ccClass are watching the same module's state
    const ccClassKeys = moduleName_ccClassKeys_[moduleName];
    if (ccClassKeys) {
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
          if (ccKey === currentCcKey && ignoreCurrentCcKey) return;
          const ref = ccUkey_ref_[ccKey];
          if (ref) {
            // 这里的calledBy直接用'broadcastState'，仅供concent内部运行时用，同时这里也不会发送信号给插件
            triggerReactSetState(ref, null, 'broadcastState', sharedStateForCurrentCcClass, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY);
          }
        });
      }

    }
  }
  
  broadcastConnectedState(moduleName, partialSharedState);
  triggerHookCb(reactCallback, targetRef);
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
