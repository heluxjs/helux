import * as util from '../../support/util';
import * as cst from '../../support/constant';
import runLater from '../base/run-later';
import ccContext from '../../cc-context';
import extractStateByKeys from '../state/extract-state-by-keys';
import watchKeyForRef from '../watch/watch-key-for-ref';
import computeValueForRef from '../computed/compute-value-for-ref';

const { isPlainJsonObject, justWarning, isObjectNotNull, computeFeature, okeys, safeGetArrayFromObject, styleStr, color } = util;
const { STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, FORCE_UPDATE } = cst;
const {
  store: { setState: ccStoreSetState, getState }, middlewares, moduleName_ccClassKeys_, ccClassKey_ccClassContext_, 
  refStore, moduleName_stateKeys_, ccKey_ref_
} = ccContext;

function getStateFor(inputModule, refModule) {
  return inputModule === refModule ? STATE_FOR_ONE_CC_INSTANCE_FIRSTLY : STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE;
}

export default function (state, {
  ccKey, ccUniqueKey, module, skipMiddleware = false,
  cb: reactCallback, type, reducerModule, calledBy, fnName, delay = -1, identity } = {}, targetRef
) {//executionContext
  const stateFor = getStateFor(module, targetRef.cc.ccState.module);

  if (state === undefined) return;//do nothing
  // const isControlledByConcent = targetRef.cc.ccState.isControlledByConcent;

  if (!isPlainJsonObject(state)) {
    justWarning(`cc found your commit state is not a plain json object!`);
    return;
  }

  const refCc = targetRef.cc;
  const ccState = refCc.ccState;
  const currentModule = ccState.module;

  let passToMiddleware = {};
  if (skipMiddleware !== true) {
    passToMiddleware = { calledBy, type, ccKey, ccUniqueKey, state, stateFor, module, reducerModule, fnName };
  }

  //在prepareReactSetState之前把状态存储到store，
  //防止属于同一个模块的父组件套子组件渲染时，父组件修改了state，子组件初次挂载是不能第一时间拿到state
  //也防止prepareReactSetState里有异步的钩子函数，导致state同步到store有延迟而出现其他bug
  const broadcastInfo = syncCommittedStateToStore(module, state);
  if (module === currentModule) {
    // who trigger $$changeState, who will change the whole received state 
    prepareReactSetState(targetRef, identity, calledBy, state, stateFor, () => {
      prepareBroadcastState(targetRef, skipMiddleware, passToMiddleware, broadcastInfo, stateFor, module, state, delay, identity);
    }, reactCallback);
  } else {
    if (reactCallback) justWarning(`callback for react.setState will be ignore`);
    //触发修改状态的实例所属模块和目标模块不一致的时候，这里的stateFor必须是OF_ONE_MODULE
    prepareBroadcastState(targetRef, skipMiddleware, passToMiddleware, broadcastInfo, STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, module, state, delay, identity);
  }
}

function prepareReactSetState(targetRef, identity, calledBy, state, stateFor, next, reactCallback) {
  // 通过规范来约束用户，只要是可能变化的数据，都不要在$$cache里存
  // 要不然$$cache就没意义了
  // if(targetRef.$$cache){
  //   targetRef.$$refCache = targetRef.$$cache();
  // }
  const thisState = targetRef.state;
  const thisCc = targetRef.cc;
  const { module: stateModule, connect, storedKeys, ccOption } = thisCc.ccState;
  const ccUniqueKey = thisCc.ccUniqueKey;

  if (stateFor !== STATE_FOR_ONE_CC_INSTANCE_FIRSTLY) {
    if (next) next();
    return;
  }
  if (identity) {//if user specify identity
    if (thisCc.ccKey !== identity) {// current instance would have been rendered only if current instance's ccKey equal identity
      if (next) next();
      return;
    }
  }

  if (storedKeys.length > 0) {
    const { partialState, isStateEmpty } = extractStateByKeys(state, storedKeys);
    if (!isStateEmpty) {
      if (ccOption.storeInLocalStorage === true) {
        const { partialState: entireStoredState } = extractStateByKeys(thisState, storedKeys);
        const currentStoredState = Object.assign({}, entireStoredState, partialState);
        localStorage.setItem('CCSS_' + ccUniqueKey, JSON.stringify(currentStoredState));
      }
      refStore.setState(ccUniqueKey, partialState);
    }
  }

  //确保forceUpdate能够刷新cc实例，因为state可能是{}，此时用户调用forceUpdate也要触发render
  if (calledBy !== FORCE_UPDATE && !isObjectNotNull(state)) {
    if (next) next();
    return;
  }

  computeValueForRef(stateModule, thisCc.computedSpec, thisCc.refComputed, thisCc.refConnectedComputed, thisState, state);
  const ctx = targetRef.__fragmentParams || targetRef.cc;
  const shouldCurrentRefUpdate = watchKeyForRef(stateModule, thisCc.watchSpec, connect, thisState, state, ctx);

  if (shouldCurrentRefUpdate === false) {
    if (next) next();
  }

  if (targetRef.__$$isUnmounted !== true) thisCc.reactSetState(state, reactCallback);
  if (next) next();
}

function syncCommittedStateToStore(moduleName, committedState) {
  const stateKeys = moduleName_stateKeys_[moduleName]
  const { isStateEmpty: isPartialSharedStateEmpty, partialState: partialSharedState } = extractStateByKeys(committedState, stateKeys);

  let skipBroadcastRefState = false;
  //!!! save state to store
  if (!isPartialSharedStateEmpty) ccStoreSetState(moduleName, partialSharedState);
  else skipBroadcastRefState = true;

  return { partialSharedState, skipBroadcastRefState };
}

function prepareBroadcastState(targetRef, skipMiddleware, passToMiddleware, broadcastInfo, stateFor, moduleName, committedState, delay, identity) {
  const { skipBroadcastRefState, partialSharedState } = broadcastInfo;
  const startBroadcastState = () => {
    broadcastState(targetRef, skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, identity);
  };

  const willBroadcast = () => {
    if (delay > 0) {
      const feature = computeFeature(targetRef.cc.ccUniqueKey, committedState);
      runLater(startBroadcastState, feature, delay);
    } else {
      startBroadcastState();
    }
  }

  if (skipMiddleware) {
    willBroadcast();
    return;
  }

  const middlewaresLen = middlewares.length;
  if (middlewaresLen > 0) {
    passToMiddleware.sharedState = partialSharedState; //这个记录到store的状态也传给中间件ctx
    let index = 0;
    const next = () => {
      if (index === middlewaresLen) {// all middlewares been executed
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

function broadcastState(targetRef, skipBroadcastRefState, originalState, stateFor, moduleName, partialSharedState, identity) {
  if (skipBroadcastRefState === false) {
    const { ccUniqueKey: currentCcKey } = targetRef.cc.ccState;

    // if stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, it means currentCcInstance has triggered reactSetState
    // so flag ignoreCurrentCcKey as true;
    const ignoreCurrentCcKey = stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY;

    const ccClassKeys = moduleName_ccClassKeys_[moduleName];
    if (ccClassKeys) {
      //  these ccClass are watching the same module's state
      ccClassKeys.forEach(ccClassKey => {
        const classContext = ccClassKey_ccClassContext_[ccClassKey];
        const { ccKeys, watchedKeys, originalWatchedKeys } = classContext;
        if (ccKeys.length === 0) return;
        if (watchedKeys.length === 0) return;

        let sharedStateForCurrentCcClass;
        if (originalWatchedKeys === '*') {
          sharedStateForCurrentCcClass = partialSharedState;
        } else {
          const { partialState, isStateEmpty } = extractStateByKeys(partialSharedState, watchedKeys, true);
          if (isStateEmpty) return;
          sharedStateForCurrentCcClass = partialState;
        }

        ccKeys.forEach(ccKey => {
          if (ccKey === currentCcKey && ignoreCurrentCcKey) return;

          const ref = ccKey_ref_[ccKey];
          if (ref) {
            if (ccContext.isDebug) {
              console.log(styleStr(`received state for ref ${ccKey} is broadcasted from same module's other ref ${currentCcKey}`), color());
            }
            prepareReactSetState(ref, identity, 'broadcastState', sharedStateForCurrentCcClass, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY)
          }
        });

      });
    }
  }

  broadcastConnectedState(moduleName, originalState);
}

function broadcastConnectedState(commitModule, commitState) {
  // if there is no any react class registered to module, here will get undefined, so use safeGetArrayFromObject
  const commitStateKeys = okeys(commitState);//提前把commitStateKeys拿到，省去了在updateConnectedState内部的多次获取过程
  okeys(moduleName_ccClassKeys_).forEach(moduleName => {
    const ccClassKeys = safeGetArrayFromObject(moduleName_ccClassKeys_, moduleName);
    ccClassKeys.forEach(ccClassKey => {
      const ccClassContext = ccClassKey_ccClassContext_[ccClassKey];
      updateConnectedState(ccClassContext, commitModule, commitState, commitStateKeys);
    });
  });
}

function updateConnectedState(targetClassContext, commitModule, commitState, commitStateKeys) {
  const { stateToPropMapping, connectedModule } = targetClassContext;
  if (connectedModule[commitModule] === 1) {

    const { ccKeys } = targetClassContext;
    let isSetConnectedStateTriggered = false;
    const len = commitStateKeys.length;
    for (let i = 0; i < len; i++) {
      const moduledStateKey = `${commitModule}/${commitStateKeys[i]}`;
      if (stateToPropMapping[moduledStateKey]) {
        isSetConnectedStateTriggered = true;
        break;
        //只要感知到有一个key发生变化，就可以跳出循环了，
        //因为connectedState指向的是store里state的引用，更新动作在store里修改时就已完成
      }
    }

    //针对targetClassContext，遍历完提交的state key，触发了更新connectedState的行为，把targetClassContext对应的cc实例都强制刷新一遍
    if (isSetConnectedStateTriggered === true) {
      ccKeys.forEach(ccUniKey => {
        const ref = ccKey_ref_[ccUniKey];
        if (ref) {
          const refCc = ref.cc;
          const watchSpec = refCc.watchSpec;
          const computedSpec = refCc.computedSpec;
          const shouldCurrentRefUpdate = watchKeyForRef(commitModule, watchSpec, refCc.ccState.connect, getState(commitModule), commitState, ref.__fragmentParams);
          //如果ref是CcFragment实例，将获得ctx
          computeValueForRef(commitModule, computedSpec, refCc.refComputed, refCc.refConnectedComputed, ref.state, commitState, ref.__fragmentParams);
          if (shouldCurrentRefUpdate) refCc.reactForceUpdate();
        }
      });
    }
  }
}
