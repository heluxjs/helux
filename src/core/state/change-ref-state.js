/* eslint-disable camelcase */
/** @typedef {import('../../types').ICtxBase} ICtxBase */
import * as util from '../../support/util';
import * as cst from '../../support/constant';
import { INAF } from '../../support/priv-constant';
import runLater from '../base/run-later';
import ccContext from '../../cc-context';
import extractStateByKeys from '../state/extract-state-by-keys';
import watchKeyForRef from '../watch/watch-key-for-ref';
import computeValueForRef from '../computed/compute-value-for-ref';
import findUpdateRefs from '../ref/find-update-refs';
import { send } from '../plugin';

const { isPJO, justWarning, isObjectNull, computeFeature, okeys } = util;
const {
  FOR_CUR_MOD, FOR_ANOTHER_MOD,
  FORCE_UPDATE, SET_STATE,
  SIG_STATE_CHANGED,
  RENDER_NO_OP, RENDER_BY_KEY, RENDER_BY_STATE,
  UNMOUNTED, NOT_MOUNT,
} = cst;
const {
  store: { setState: storeSetState, getPrevState, saveSharedState }, middlewares, ccClassKey2Context,
  refStore, getModuleStateKeys, runtimeVar
} = ccContext;

// 触发修改状态的实例所属模块和目标模块不一致的时候，stateFor是 FOR_ANOTHER_MOD
function getStateFor(targetModule, refModule) {
  return targetModule === refModule ? FOR_CUR_MOD : FOR_ANOTHER_MOD;
}

function callMiddlewares(skipMiddleware, passToMiddleware, cb) {
  if (skipMiddleware !== true) {
    const len = middlewares.length;
    if (len > 0) {
      let index = 0;
      const next = () => {
        if (index === len) { // all middlewares been executed
          cb();
        } else {
          const middlewareFn = middlewares[index];
          index++;
          if (util.isFn(middlewareFn)) middlewareFn(passToMiddleware, next);
          else {
            justWarning(`found one middleware ${INAF}`);
            next();
          }
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

// 调用者优先取 alwaysRenderCaller，再去force参数
function getCallerForce(force) {
  return runtimeVar.alwaysRenderCaller || force;
}

/**
 * 修改状态入口函数
 */
function changeRefState(inputState, {
  module, skipMiddleware = false, payload, stateChangedCb, force = false, stateSnapshot,
  keys = [], keyPath = '', // sync api 透传
  reactCallback, type, calledBy = SET_STATE, fnName = '', renderKey, delay = -1 } = {}, callerRef
) {
  if (!inputState) return;

  if (!isPJO(inputState)) {
    return;
  }
  let state = inputState;

  const targetRenderKey = util.extractRenderKey(renderKey);
  const targetDelay = (renderKey && renderKey.delay) ? renderKey.delay : delay;

  const { module: refModule, ccUniqueKey, ccKey } = callerRef.ctx;
  const stateFor = getStateFor(module, refModule);
  const callInfo = {
    calledBy, payload, renderKey: targetRenderKey, force, ccKey, module, fnName,
    keys, keyPath,
  };

  // 在triggerReactSetState之前把状态存储到store，
  // 防止属于同一个模块的父组件套子组件渲染时，父组件修改了state，子组件初次挂载是不能第一时间拿到state
  // const passedRef = stateFor === FOR_CUR_MOD ? targetRef : null;
  // 标记noSave为true，延迟到后面可能存在的中间件执行结束后才save
  const {
    partialState: sharedState, hasDelta, hasPrivState
  } = syncCommittedStateToStore(module, inputState, { ref: callerRef, callInfo, noSave: true, force });

  // 有 computed 提交了新的 state
  if (hasDelta) {
    state = Object.assign({}, inputState, sharedState);
  }
  // 不包含私有状态，仅包含模块状态，交给 belongRefs 那里去触发渲染，这样可以让已失去依赖的当前实例减少一次渲染
  // 因为 belongRefs 那里是根据有无依赖来确定要不要渲染，这样的话如果失去了依赖不把它查出来就不触发它渲染了
  const ignoreRender = !hasPrivState && !!sharedState;

  // source ref will receive the whole committed state 
  triggerReactSetState(callerRef, callInfo, targetRenderKey, calledBy, state, stateFor, ignoreRender,
    reactCallback, getCallerForce(force), (renderType, committedState, refUpdater) => {
      // committedState means final committedState
      const passToMiddleware = {
        calledBy, type, payload, renderKey: targetRenderKey, delay: targetDelay, ccKey, ccUniqueKey,
        committedState, refModule, module, fnName,
        sharedState: sharedState || {}, // 给一个空壳对象，防止用户直接用的时候报错null
      };

      let modStateCalled = false;
      // 修改或新增状态值
      // 修改并不会再次触发compute&watch过程，请明确你要修改的目的
      passToMiddleware.modState = (key, val) => {
        modStateCalled = true;
        passToMiddleware.committedState[key] = val;
        passToMiddleware.sharedState[key] = val;
      };

      callMiddlewares(skipMiddleware, passToMiddleware, () => {
        // 到这里才触发调用 saveSharedState 存储模块状态和 并用 refUpdater 更新调用实例，注这两者前后顺序不能调换
        // 因为 callerRef 里的 beforeRender 步骤会把最新的模块状态合进来
        // 允许在中间件过程中使用「modState」修改某些key的值，会影响到实例的更新结果，但不会再触发computed&watch
        // 所以调用此接口请明确知道上面的后果，可能导致以外的bug
        // 注不要直接修改 sharedState 或 committedState，如非要修改，应该是对两个对象一起修改某个key才是正确的
        const midSharedState = passToMiddleware.sharedState;
        // 如 finalSharedState 为空，表示提交的状态和模块状态没有发生变化
        const finalSharedState = saveSharedState(module, midSharedState, modStateCalled, force);

        // TODO: 查看其它模块的cu函数里读取了当前模块的state或computed作为输入产生了的新的计算结果
        // 然后做相应的关联更新 {'$$global/key1': {foo: ['cuKey1', 'cuKey2'] } }
        // code here

        // 执行完毕所有的中间件，才更新触发调用的源头实例
        refUpdater && refUpdater();

        if (renderType === RENDER_NO_OP && !finalSharedState) {
          if (ignoreRender) {
            // 此时 refUpdater 为 null, 主动为 caller 执行一次 triggerReactSetState，
            // 以便让 triggerReactSetState 内部有机会触发 reactCallback
            triggerReactSetState(callerRef, callInfo, [], SET_STATE, midSharedState, stateFor, true, reactCallback, getCallerForce(force));
          }
        } else {
          send(SIG_STATE_CHANGED, {
            calledBy, type, committedState, sharedState: finalSharedState || {}, payload,
            module, ccUniqueKey, renderKey: targetRenderKey, stateSnapshot,
          });
        }

        // 无论是否真的有状态改变，此回调都会被触发
        if (stateChangedCb) stateChangedCb();

        // 当前上下文的ignoreRender 为true时， 等效于入参 allowOriInsRender 为true，允许查询出oriIns后触发它渲染
        if (finalSharedState) triggerBroadcastState(
          stateFor, callInfo, callerRef, finalSharedState, ignoreRender, module, reactCallback, targetRenderKey, targetDelay, force
        );
      });
    }
  );
}

function triggerReactSetState(
  callerRef, callInfo, renderKeys, calledBy, state, stateFor, ignoreRender, reactCallback, force, next
) {
  const refCtx = callerRef.ctx;
  const refState = refCtx.unProxyState;
  const nextNoop = () => {
    next && next(RENDER_NO_OP, state);
    // fix issue: https://github.com/concentjs/concent/issues/70
    // 没有任何依赖的组件，定义了cb，也让其有机会执行
    if (reactCallback) {
      const { __$$mstate } = refCtx
      const newState = Object.assign({}, refState, __$$mstate);
      reactCallback(newState);
    }
  };

  if (ignoreRender) {
    return nextNoop();
  }

  if (
    callerRef.__$$ms === UNMOUNTED // 已卸载
    || stateFor !== FOR_CUR_MOD
    // 确保 forceUpdate 能够刷新cc实例，因为state可能是{}，此时用户调用forceUpdate也要触发render
    || (calledBy !== FORCE_UPDATE && isObjectNull(state))
  ) {
    return nextNoop();
  }

  const { module: stateModule, storedKeys, ccUniqueKey } = refCtx;
  let renderType = RENDER_BY_STATE;

  if (renderKeys.length) {// if user specify renderKeys
    renderType = RENDER_BY_KEY;
    if (renderKeys.includes(refCtx.renderKey)) {
      // current instance can been rendered only if ctx.renderKey included in renderKeys
      return nextNoop();
    }
  }

  if (storedKeys.length > 0) {
    const { partialState, isStateEmpty } = extractStateByKeys(state, storedKeys);
    if (!isStateEmpty) {
      if (refCtx.persistStoredKeys === true) {
        const { partialState: entireStoredState } = extractStateByKeys(refState, storedKeys);
        const currentStoredState = Object.assign({}, entireStoredState, partialState);
        if (ccContext.localStorage) {
          ccContext.localStorage.setItem(`CCSS_${ccUniqueKey}`, JSON.stringify(currentStoredState));
        }
      }
      refStore.setState(ccUniqueKey, partialState);
    }
  }

  const deltaCommittedState = Object.assign({}, state);
  computeValueForRef(callerRef, stateModule, refState, deltaCommittedState, callInfo);
  watchKeyForRef(callerRef, stateModule, refState, deltaCommittedState, callInfo);

  const ccSetState = () => {
    // 使用 unProxyState ，避免触发get
    let mayChangedState;
    if (force === true) mayChangedState = deltaCommittedState;
    else mayChangedState = util.extractChangedState(refCtx.unProxyState, deltaCommittedState)

    if (mayChangedState) {
      // 记录 stateKeys，方便 triggerRefEffect 之用
      refCtx.__$$settedList.push({ module: stateModule, keys: okeys(mayChangedState) });
      const upCb = () => refCtx.__$$ccSetState(mayChangedState, reactCallback);
      if (callerRef.__$$ms === NOT_MOUNT) {
        refCtx.__$$queuedUpdaters.push(upCb);
      } else {
        upCb();
      }
    }
  }

  if (next) {
    next(renderType, deltaCommittedState, ccSetState);
  } else {
    ccSetState();
  }
}

function syncCommittedStateToStore(moduleName, committedState, options) {
  const stateKeys = getModuleStateKeys(moduleName);

  // extract shared state
  const { partialState, missKeyInState: hasPrivState } = extractStateByKeys(committedState, stateKeys, true);

  // save state to store
  if (partialState) {
    const { hasDelta, deltaCommittedState } = storeSetState(moduleName, partialState, options);
    return { partialState: deltaCommittedState, hasDelta, hasPrivState };
  }

  return { partialState, hasDelta: false, hasPrivState };
}

function triggerBroadcastState(
  stateFor, callInfo, targetRef, sharedState, allowOriInsRender, moduleName, reactCallback, renderKeys, delay, force
) {
  let passAllowOri = allowOriInsRender;
  if (delay > 0) {
    if (passAllowOri) { // 优先将当前实例渲染了
      triggerReactSetState(targetRef, callInfo, [], SET_STATE, sharedState, stateFor, false, reactCallback, getCallerForce(force));
    }
    passAllowOri = false; // 置为false，后面的runLater里不会再次触发当前实例渲染
  }

  const startBroadcastState = () => {
    broadcastState(callInfo, targetRef, sharedState, passAllowOri, moduleName, reactCallback, renderKeys, force);
  };

  if (delay > 0) {
    const feature = computeFeature(targetRef.ctx.ccUniqueKey, sharedState);
    runLater(startBroadcastState, feature, delay);
  } else {
    startBroadcastState();
  }
}

function broadcastState(
  callInfo, targetRef, partialSharedState, allowOriInsRender, moduleName, reactCallback, renderKeys, force
) {
  if (!partialSharedState) { // null
    return;
  }
  const ccUKey2ref = ccContext.ccUKey2ref;

  /** @type ICtxBase */
  const { ccUniqueKey: currentCcUKey, ccClassKey } = targetRef.ctx;
  const renderKeyClasses = ccClassKey2Context[ccClassKey].renderKeyClasses;

  const {
    sharedStateKeys, result: { belong: belongRefKeys, connect: connectRefKeys }
  } = findUpdateRefs(moduleName, partialSharedState, renderKeys, renderKeyClasses);

  const renderedInBelong = {};
  belongRefKeys.forEach(refKey => {
    const ref = ccUKey2ref[refKey];
    if (!ref) return;
    const refUKey = ref.ctx.ccUniqueKey;

    let rcb = null;
    // 这里的calledBy直接用'broadcastState'，仅供concent内部运行时用
    let calledBy = 'broadcastState';
    if (refUKey === currentCcUKey) {
      if (!allowOriInsRender) return;
      rcb = reactCallback;
      calledBy = callInfo.calledBy;
    }
    triggerReactSetState(ref, callInfo, [], calledBy, partialSharedState, FOR_CUR_MOD, false, rcb, force);
    renderedInBelong[refKey] = 1;
  });

  const prevModuleState = getPrevState(moduleName);
  connectRefKeys.forEach(refKey => {
    // 对于即属于又连接的实例，避免一次重复的渲染
    if (renderedInBelong[refKey]) {
      return;
    }

    const ref = ccUKey2ref[refKey];
    if (!ref) return;

    if (ref.__$$ms === UNMOUNTED) {
      return;
    }

    const refCtx = ref.ctx;
    const {
      hasDelta: hasDeltaInCu, newCommittedState: cuCommittedState,
    } = computeValueForRef(ref, moduleName, prevModuleState, partialSharedState, callInfo, false, false);
    const {
      hasDelta: hasDeltaInWa, newCommittedState: waCommittedState,
    } = watchKeyForRef(ref, moduleName, prevModuleState, partialSharedState, callInfo, false, false);

    // computed & watch 过程中提交了新的state，合并到 unProxyState 里
    // 注意这里，computeValueForRef watchKeyForRef 调用的 findDepFnsToExecute 内部
    // 保证了实例里cu或者wa函数 commit 提交的状态只能是 privateStateKey，所以合并到 unProxyState 是安全的
    if (hasDeltaInCu || hasDeltaInWa) {
      const changedRefPrivState = Object.assign(cuCommittedState, waCommittedState);
      const refModule = refCtx.module;
      const refState = refCtx.unProxyState;

      computeValueForRef(ref, refModule, refState, changedRefPrivState, callInfo);
      watchKeyForRef(ref, refModule, refState, changedRefPrivState, callInfo);

      Object.assign(refState, changedRefPrivState);
      Object.assign(refCtx.state, changedRefPrivState);
      refCtx.__$$settedList.push({ module: refModule, keys: okeys(changedRefPrivState) });
    }

    // 记录 sharedStateKeys，方便 triggerRefEffect 之用
    refCtx.__$$settedList.push({ module: moduleName, keys: sharedStateKeys });
    const upCb = () => refCtx.__$$ccForceUpdate();
    if (ref.__$$ms === NOT_MOUNT) {
      refCtx.__$$queuedUpdaters.push(upCb);
    } else {
      upCb();
    }
  });
}

export default function startChangeRefState(state, options, ref) {
  /**
   * 避免死循环，利用 setTimeout 将执行流程放到下一轮事件循环里
   *  在 <= v2.10.13之前
   *  1 watch 回调里执行 setState 导致无限死循环
   *  2 setup 块里直接执行 setState 导致无限死循环
   * 
   *  以 watch 为例：
   * function setup({watch, setState, initState}){
   *   initState({privKey: 2});
   *   watch('num', ()=>{
   *     // 因为watch是在组件渲染前执行，当设置 immediate 为 true 时
   *     // 组件处于 beforeMount 步骤，cUKey2Ref 并未记录具体的 ref,
   *     // 此时回调里调用setState会导致 use-concent 134 [KEY_1] 处判断失败后
   *     // 然后一直触发 cref 函数，一直进入新的 beforeMount 流程
   *     setState({privKey:1});
   *   }, {immediate:true});
   * }
   */

  // TODO:  此问题待排查是否由 concent 引入
  // Warning: Cannot update a component (`XXX`) while rendering a different component (`YYY`)

  if (ref.ctx.__$$inBM) {
    // <= 2.15.7
    // setTimeout(() => startChangeRefState(state, options, ref), 0);

    // > 2.15.7 调整为此逻辑
    // 满足一些的确需要在 setup 里及时的将数据写入 store 的场景
    // 由 permanentDispatcher 去触发其他组件实例渲染
    // 自身的 state 直接合入，这样在实例首次渲染的函数体能拿到 setup 里写入的最新状态


    const permanentDispatcher = ccContext.getDispatcher();
    if (permanentDispatcher) {
      permanentDispatcher.ctx.changeState(state, options);
    }
    Object.assign(ref.ctx.state, state);
    Object.assign(ref.state, state);
    return;
  }
  changeRefState(state, options, ref);
}
