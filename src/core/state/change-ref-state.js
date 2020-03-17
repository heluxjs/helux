import * as util from '../../support/util';
import * as cst from '../../support/constant';
import { NOT_A_JSON } from '../../support/priv-constant';
import runLater from '../base/run-later';
import ccContext from '../../cc-context';
import extractStateByKeys from '../state/extract-state-by-keys';
import watchKeyForRef from '../watch/watch-key-for-ref';
import computeValueForRef from '../computed/compute-value-for-ref';
import findUpdateRefs from '../ref/find-update-refs';
import { send } from '../plugin';

const { isPJO, justWarning, isObjectNotNull, computeFeature, okeys } = util;
const {
  FOR_ONE_INS_FIRSTLY, FOR_ALL_INS_OF_A_MOD,
  FORCE_UPDATE, SET_STATE, SET_MODULE_STATE, INVOKE, SYNC,
  SIG_STATE_CHANGED,
  RENDER_NO_OP, RENDER_BY_KEY, RENDER_BY_STATE,
} = cst;
const {
  store: { setState, getPrevState, saveSharedState }, middlewares, ccClassKey_ccClassContext_,
  refStore, moduleName_stateKeys_
} = ccContext;

//触发修改状态的实例所属模块和目标模块不一致的时候，stateFor是FOR_ALL_INS_OF_A_MOD
function getStateFor(targetModule, refModule) {
  return targetModule === refModule ? FOR_ONE_INS_FIRSTLY : FOR_ALL_INS_OF_A_MOD;
}

function getActionType(calledBy, type) {
  if ([FORCE_UPDATE, SET_STATE, SET_MODULE_STATE, INVOKE, SYNC].includes(calledBy)) {
    return `ccApi/${calledBy}`;
  } else {
    return `dispatch/${type}`;
  }
}

function callMiddlewares(skipMiddleware, passToMiddleware, cb) {
  let hasMid = false;
  if (skipMiddleware !== true) {
    const len = middlewares.length;
    if (len > 0) {
      hasMid = true;
      let index = 0;
      const next = () => {
        if (index === len) {// all middlewares been executed
          cb(hasMid);
        } else {
          const middlewareFn = middlewares[index];
          index++;
          if(typeof middlewareFn === 'function')middlewareFn(passToMiddleware, next);
          else {
            justWarning(`found one middleware is not a function`);
            next();
          }
        }
      }
      next(hasMid);
    } else {
      cb();
    }
  } else {
    cb(hasMid);
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
  reactCallback, type, calledBy = SET_STATE, fnName = '', renderKey = '', delay = -1 } = {}, targetRef
) {
  if (state === undefined) return;

  if (!isPJO(state)) {
    justWarning(`your committed state ${NOT_A_JSON}`);
    return;
  }

  const { module: refModule, ccUniqueKey, ccKey } = targetRef.ctx;
  const stateFor = getStateFor(module, refModule);
  const callInfo = { payload, renderKey, ccKey, module, fnName };
  
  //在triggerReactSetState之前把状态存储到store，
  //防止属于同一个模块的父组件套子组件渲染时，父组件修改了state，子组件初次挂载是不能第一时间拿到state
  const passedCtx = stateFor === FOR_ONE_INS_FIRSTLY ? targetRef.ctx : null;
  // 标记noSave为true，延迟到后面可能存在的中间件执行结束后才save
  const sharedState = syncCommittedStateToStore(module, state, { refCtx: passedCtx, callInfo, noSave: true });

  Object.assign(state, sharedState);

  // source ref will receive the whole committed state 
  triggerReactSetState(targetRef, callInfo, renderKey, calledBy, state, stateFor, reactCallback,
    // committedState means final committedState
    (renderType, committedState, updateRef) => {

      const passToMiddleware = {
        calledBy, type, payload, renderKey, delay, ccKey, ccUniqueKey,
        committedState, refModule, module, fnName,
        sharedState: sharedState || {}, // 给一个空壳对象，防止用户直接用的时候报错null
      };

      // 修改或新增状态值
      // 修改并不会再次触发compute&watch过程，请明确你要修改的目的
      passToMiddleware.modState = (key, val) => {
        passToMiddleware.committedState[key] = val;
        passToMiddleware.sharedState[key] = val;
      };

      callMiddlewares(skipMiddleware, passToMiddleware, (hasMid) => {

        // 到这里才触发调用saveSharedState存储模块状态和updateRef更新调用实例，注这两者前后顺序不能调换
        // 因为updateRef里的beforeRender需要把最新的模块状态合进来
        // 允许在中间件过程中使用「modState」修改某些key的值，会影响到实例的更新结果，且不会再触发computed&watch
        // 调用此接口请明确知道后果,
        // 注不要直接修改sharedState或committedState，两个对象一起修改某个key才是正确的

        let realShare = sharedState;
        if (hasMid) {
          // 有中间件时，设置第三位参数为true，需再次提取一下sharedState, 防止用户扩展了sharedState上不存在于store的key
          // 合并committedState是防止用户修改了committedState上的moduleStateKey
          realShare = saveSharedState(module, passToMiddleware.sharedState, true);
        } else {
          sharedState && saveSharedState(module, sharedState);
        }

        updateRef && updateRef();

        if (renderType === RENDER_NO_OP && !realShare) {
        } else {
          send(SIG_STATE_CHANGED, {
            committedState, sharedState: realShare,
            module, type: getActionType(calledBy, type), ccUniqueKey, renderKey
          });
        }

        if (realShare) triggerBroadcastState(callInfo, targetRef, realShare, stateFor, module, renderKey, delay);
      });

    }
  );
}

function triggerReactSetState(targetRef, callInfo, renderKey, calledBy, state, stateFor, reactCallback, next) {
  const { state: refState, ctx: refCtx } = targetRef;
  if (
    // 未挂载上不用判断，react自己会安排到更新队列里，等到挂载上时再去触发更新
    // targetRef.__$$isMounted === false || // 还未挂载上

    targetRef.__$$isUnmounted === true || // 已卸载
    stateFor !== FOR_ONE_INS_FIRSTLY ||
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

  const ccSetState = () => {
     // 记录stateKeys，方便triggerRefEffect之用
    refCtx.__$$settedList.push({ module: stateModule, keys: okeys(deltaCommittedState) });
    refCtx.__$$ccSetState(deltaCommittedState, reactCallback, shouldCurrentRefUpdate);
  }

  if (next) {
    next(renderType, deltaCommittedState, ccSetState);
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
    return setState(moduleName, partialState, options);// {sharedState, saveSharedState}
  }

  return  partialState ;
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

function broadcastState(callInfo, targetRef, partialSharedState, stateFor, moduleName, renderKey) {
  if (!partialSharedState) {// null
    return;
  }
  const ccUKey_ref_ = ccContext.ccUKey_ref_;

  const { ccUniqueKey: currentCcUKey, ccClassKey } = targetRef.ctx;
  const renderKeyClasses = ccClassKey_ccClassContext_[ccClassKey].renderKeyClasses;

  // if stateFor === FOR_ONE_INS_FIRSTLY, it means currentCcInstance has triggered __$$ccSetState
  // so flag ignoreCurrentCcUkey as true;
  const ignoreCurrentCcUKey = stateFor === FOR_ONE_INS_FIRSTLY;

  const {
    sharedStateKeys, result: { belong: belongRefKeys, connect: connectRefKeys }
  } = findUpdateRefs(moduleName, partialSharedState, renderKey, renderKeyClasses);

  belongRefKeys.forEach(refKey => {
    const ref = ccUKey_ref_[refKey];
    const refUKey = ref.ctx.ccUniqueKey;

    if (ignoreCurrentCcUKey && refUKey === currentCcUKey) return;
    // 这里的calledBy直接用'broadcastState'，仅供concent内部运行时用，同时这ignoreCurrentCcUkey里也不会发送信号给插件
    triggerReactSetState(ref, callInfo, null, 'broadcastState', partialSharedState, FOR_ONE_INS_FIRSTLY);
  });

  const prevModuleState = getPrevState(moduleName);
  connectRefKeys.forEach(refKey => {
    const ref = ccUKey_ref_[refKey];

    if (ref.__$$isUnmounted !== true) {
      const refCtx = ref.ctx;
      computeValueForRef(refCtx, moduleName, prevModuleState, partialSharedState, callInfo);
      const shouldCurrentRefUpdate = watchKeyForRef(refCtx, moduleName, prevModuleState, partialSharedState, callInfo);

      // 记录sharedStateKeys，方便triggerRefEffect之用
      refCtx.__$$settedList.push({ module: moduleName, keys: sharedStateKeys });

      if (shouldCurrentRefUpdate) {
        refCtx.__$$ccForceUpdate();
      }
    }
  });

}

