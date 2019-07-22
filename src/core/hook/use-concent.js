import React from 'react';
import { CC_HOOK_COMP_PREFIX, SET_STATE } from '../../support/constant';
import buildFragmentRefCc from '../base/build-fragment-ref-cc';
import changeRefState from '../state/change-ref-state';
import ccContext from '../../cc-context';
import getWatchSpec from '../watch/get-watch-spec';
import computeValueForRef from '../computed/compute-value-for-ref';
import getComputedSpec from '../computed/get-computed-spec';
import buildFragmentRefCc from '../base/build-fragment-ref-cc';
import * as ccRef from '../ref';

const {
  ccClassKey_ccClassContext_, store: { getState, getPrevState },
  computed: { _computedValue }, ccKey_ref_
} = ccContext;

let refCursor = 1;
const cursor_refKey_ = {};
const cursor_fnCtx_ = {};

function getUsableCursor() {
  return refCursor;
}
function incCursor() {
  refCursor = refCursor + 1;
}


const makeSetState = (ccHookState, hookSetState) => partialState => {
  ccHookState.state = Object.assign(ccHookState.state, partialState);
  hookSetState(ccHookState);
}
const makeForceUpdate = (ccHookState, hookSetState) => () => {
  hookSetState(ccHookState);
}
function createHookRef(ccHookState, hookSetState) {
  return {
    __$$isUnmounted: false,
    state: ccHookState.state,
    forceUpdate: makeForceUpdate(ccHookState, hookSetState),
    setState: makeSetState(ccHookState, hookSetState),
  }
}

// if computed is fn: fnParams=> computedObj
function defineHookComputed(computed, hookCc, fnCtx) {
  const computedSpec = getComputedSpec(computed, fnCtx, hookCc.ccState.module);
  hookCc.computed = computed;
  hookCc.computedSpec = computedSpec;
}
function defineHookWatch(watch, hookCc, fnCtx) {
  const watchSpec = getWatchSpec(watch, fnCtx, hookCc.ccState.module);
  hookCc.watch = watch;
  hookCc.watchSpec = watchSpec;
}       

function triggerComputed(stateModule, fnCtx, hookState, hookCc, hookCtx){
  const computedSpec = hookCc.computedSpec;
  //触发计算computed
  if (computedSpec) {
    const curState = hookCtx.state;
    const refComputed = hookCc.refComputed, refConnectedComputed = hookCc.refConnectedComputed;
    //这里操作的是moduleState
    computeValueForRef(stateModule, computedSpec, refComputed, refConnectedComputed, curState, curState, fnCtx);
    hookState.connectModules.forEach(m => {
      const mState = getState(m);
      computeValueForRef(m, computedSpec, refComputed, refConnectedComputed, mState, mState, fnCtx);
    });
  }
}

export default (props) => {
  const { module, watchedKeys, connect={}, state = {}, computed } = props;
  const reactUseState = React.useState;
  if (!reactSetState) {
    throw new Error('make sure your react version is larger than or equal 16.8');
  }

  const connectModules = okeys(connect);

  const cursor = getUsableCursor();
  const [ccHookState, reactSetState] = reactUseState({ cursor: getUsableCursor(), module, watchedKeys, connect, connectModules, state });
  const nowCursor = ccHookState.cursor;

  const isFirstRender = nowCursor === cursor;
  let hookRef, hookCc;
  if (isFirstRender) {
    incCursor();
    hookRef = createHookRef(ccHookState, hookSetState, CC_HOOK_COMP_PREFIX);
    buildFragmentRefCc(hookRef, props);
    hookCc = hookRef.cc;
    cursor_refKey_[nowCursor] = hookCc.ccUniqueKey;
  } else {//existing period, replace setState and forceUpdate
    hookRef = ccKey_ref_[nowCursor];
    hookCc = hookRef.cc;
    hookRef.setState = makeSetState(ccHookState, hookSetState);
    hookRef.forceUpdate = makeForceUpdate(ccHookState, hookSetState);
  }

  const { ccClassKey, ccKey, ccUniqueKey, ccState, refConnectedComputed, refComputed } = hookCc;
  const fragmentModule = ccState.module;

  const setState = (state, delay, identity) => {
    changeRefState(state, {
      calledBy: SET_STATE, ccKey, ccUniqueKey, module:stateModule, delay, identity
    }, hookRef);
  }

  //for each render
  React.useEffect(() => {

  });

  const ctx = ccClassKey_ccClassContext_[ccClassKey];
  const connectedComputed = ctx.connectedComputed || {};
  const connectedState = ctx.connectedState || {};
  const moduleState = getState(fragmentModule);
  const moduleComputed = _computedValue[fragmentModule] || {};
  const stateModule = ccState.module;
  const dispatcher = ccRef.getDispatcherRef();
  const curState = ccHookState.state;
  const hookCtx = {
    setState,
    forceUpdate: (delay, identity) => {
      setState(curState, delay, identity);
    },
    dispatch: (paramObj, payloadWhenFirstParamIsString, userInputDelay, userInputIdentity) => {
      const stateModule = ccState.module;
      const d = dispatcher.__$$getDispatchHandler(hookRef, curState, false, ccKey, ccUniqueKey, ccClassKey, stateModule, stateModule, null, null, -1)
      return d(paramObj, payloadWhenFirstParamIsString, userInputDelay, userInputIdentity);
    },
    state: curState,
    moduleState,
    refComputed,
    refConnectedComputed, 
    moduleComputed,
    connectedState,
    connectedComputed,
  };

  let fnCtx;
  if (isFirstRender) {
    fnCtx = cursor_fnCtx_[nowCursor] = { hookRef, hookCtx };
  } else {//existing period, replace hookCtx
    fnCtx = cursor_fnCtx_[nowCursor];
    fnCtx.hookCtx = hookCtx;
  }

  if (isFirstRender) {
    defineHookComputed(computed, hookCc, fnCtx);
    defineHookWatch(watch, hookCc, fnCtx);
    triggerComputed(stateModule, fnCtx, ccHookState, hookCc, hookCtx);
  }

  return hookCtx;
}