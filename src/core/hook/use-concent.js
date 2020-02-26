import React from 'react';
import { CC_HOOK_PREFIX } from '../../support/constant';
import { NOT_A_JSON } from '../../support/priv-constant';
import buildRefCtx from '../ref/build-ref-ctx';
import ccContext from '../../cc-context';
import mapRegistrationInfo from '../base/map-registration-info';
import beforeMount from '../base/before-mount';
import didMount from '../base/did-mount';
import didUpdate from '../base/did-update';
import beforeUnmount from '../base/before-unmount';
import { isPlainJsonObject, getRegisterOptions, evalState } from '../../support/util';
import setRef from '../ref/set-ref';

const { ccUkey_ref_ } = ccContext;

let refCursor = 1;
const cursor_refKey_ = {};

function getUsableCursor() {
  return refCursor;
}
function incCursor() {
  refCursor = refCursor + 1;
}

const makeSetState = (ccHookState, hookSetState) => (partialState, cb) => {
  const newHookState = Object.assign({}, ccHookState, partialState);
  hookSetState(newHookState);

  // 和class setState(partialState, cb); 保持一致
  if (cb) cb(newHookState);
}

const makeForceUpdate = (ccHookState, hookSetState) => cb => {
  const newHookState = Object.assign({}, ccHookState);
  hookSetState(newHookState);
  if (cb) cb(newHookState);
}

function CcHook(ccHookState, hookSetState, props) {
  this.setState = makeSetState(ccHookState, hookSetState);
  this.forceUpdate = makeForceUpdate(ccHookState, hookSetState);
  this.state = ccHookState;
  this.isFirstRendered = true;
  this.props = props;
}

//写为具名函数，防止react devtoo里显示.default
export default function useConcent(registerOption, ccClassKey){
  const _registerOption = getRegisterOptions(registerOption);
  let { state: iState = {}, props = {}, mapProps, layoutEffect = false, extra = {} } = _registerOption;

  const reactUseState = React.useState;
  if (!reactUseState) {
    throw new Error('make sure your react version is LTE 16.8');
  }

  const cursor = getUsableCursor();
  const [curCursor] = reactUseState(cursor);
  const isFirstRendered = curCursor === cursor;

  let state = null;
  if (isFirstRendered) {
    state = evalState(iState);
  }

  const [ccHookState, hookSetState] = reactUseState(state);
  let hookRef;
  
  const buildRef = ()=>{
    if (!state) state = evalState(iState);// avoid single file demo in hmr mode trigger buildRef
    const bindCtxToMethod = _registerOption.bindCtxToMethod;

    const {
      renderKeyClasses, module, watchedKeys = '*', storedKeys = [],
      connect = {}, setup, lite,
    } = _registerOption;

    incCursor();
    const { _module, _watchedKeys, _ccClassKey, _connect } = mapRegistrationInfo(
      module, ccClassKey, renderKeyClasses, CC_HOOK_PREFIX, watchedKeys, storedKeys, connect, true
    );
    hookRef = new CcHook(ccHookState, hookSetState, props);

    const params = Object.assign({}, _registerOption, {
      module: _module, watchedKeys: _watchedKeys, state, type: CC_HOOK_PREFIX,
      ccClassKey: _ccClassKey, connect: _connect, ccOption: props.ccOption
    });

    buildRefCtx(hookRef, params, lite);
    beforeMount(hookRef, setup, bindCtxToMethod);
    cursor_refKey_[curCursor] = hookRef.ctx.ccUniqueKey;

    const refCtx = hookRef.ctx;
    // rewrite useRef for CcHook
    refCtx.useRef = function useR(refName) {//give named function to avoid eslint error
      const ref = React.useRef(null);
      refCtx.refs[refName] = ref;
      return ref;
    }
  }

  if (isFirstRendered) {
    buildRef();
  } else {
    const refKey = cursor_refKey_[curCursor];
    hookRef = ccUkey_ref_[refKey];
    if (!hookRef && Date.now() - ccContext.info.latestStartupTime < 1000) {// single file demo in hot reload mode
      buildRef();
    } else {
      const refCtx = hookRef.ctx;
      // existing period, replace reactSetState and reactForceUpdate
      refCtx.reactSetState = makeSetState(ccHookState, hookSetState);
      refCtx.reactForceUpdate = makeForceUpdate(ccHookState, hookSetState);
    }
  }
  
  const refCtx = hookRef.ctx;
  refCtx.prevProps = refCtx.props;
  hookRef.props = refCtx.props = props;// keep shape same as class
  refCtx.extra = extra;

  // ???does user really need beforeMount,mounted,beforeUpdate,updated,beforeUnmount in setup???

  const effectHandler = layoutEffect ? React.useLayoutEffect : React.useEffect;
  //after every render
  effectHandler(() => {
    if (!hookRef.isFirstRendered) {// mock componentDidUpdate
      didUpdate(hookRef);
    }
  });

  //after first render
  effectHandler(() => {// mock componentDidMount
    // 正常情况走到这里应该是true，如果是false，则是热加载情况下的hook行为
    if (hookRef.isFirstRendered === false) {
      // 记录一下丢失的ref，因为上面不再会走buildRefCtx beforeMount流程
      const { isSingle, ccClassKey, ccKey, ccUniqueKey } = hookRef.ctx;
      setRef(hookRef, isSingle, ccClassKey, ccKey, ccUniqueKey);
    } else {
      hookRef.isFirstRendered = false;
      didMount(hookRef);
    }

    return () => {// mock componentWillUnmount
      beforeUnmount(hookRef);
    }
  }, []);

  // before every render
  if (mapProps) {
    const mapped = mapProps(refCtx);
    if (!isPlainJsonObject(mapped)) {
      throw new Error(`mapProps ret ${NOT_A_JSON}`)
    }
    refCtx.mapped = mapped;
  }

  return refCtx;
}
