import React from 'react';
import { CC_HOOK } from '../../support/constant';
import { NOT_A_JSON } from '../../support/priv-constant';
import buildRefCtx from '../ref/build-ref-ctx';
import ccContext from '../../cc-context';
import mapRegistrationInfo from '../base/map-registration-info';
import beforeMount from '../base/before-mount';
import didMount from '../base/did-mount';
import didUpdate from '../base/did-update';
import beforeUnmount from '../base/before-unmount';
import * as hf from '../state/handler-factory';
import { isPJO, getRegisterOptions, evalState } from '../../support/util';

const { ccUkey_ref_ } = ccContext;

let refCursor = 1;

function getUsableCursor() {
  return refCursor;
}
function incCursor() {
  refCursor = refCursor + 1;
}

function CcHook(state, hookSetter, props) {
  //new CcHook时，这里锁定的hookSetter就是后面一直可以用的setter
  //如果存在期一直替换hookSetter，反倒会造成打开react-dev-tool，点击面板里的dom后，视图便不再更新的bug
  this.setState = hookSetter;
  this.forceUpdate = hookSetter;
  this.state = state;
  this.isFirstRendered = true;
  this.props = props;
}

// rState: resolvedState, iState: initialState
function buildRef(ref, refKeyContainer, rState, iState, regOpt, hookState, hookSetter, props, extra, ccClassKey) {
  // when single file demo in hmr mode trigger buildRef, rState is 0 
  // so here call evalState again
  const state = rState || evalState(iState);
  const bindCtxToMethod = regOpt.bindCtxToMethod;

  const {
    renderKeyClasses, module, watchedKeys = '*', storedKeys = [],
    connect = {}, setup, lite,
  } = regOpt;

  incCursor();
  const { _module, _watchedKeys, _ccClassKey, _connect } = mapRegistrationInfo(
    module, ccClassKey, renderKeyClasses, CC_HOOK, watchedKeys, storedKeys, connect, true
  );

  const hookRef = ref || new CcHook(hookState, hookSetter, props);

  const params = Object.assign({}, regOpt, {
    module: _module, watchedKeys: _watchedKeys, state, type: CC_HOOK,
    ccClassKey: _ccClassKey, connect: _connect, ccOption: props.ccOption
  });
  hookRef.props = props;// keep shape same as class
  buildRefCtx(hookRef, params, lite);// in buildRefCtx cc will assign hookRef.props to ctx.prevProps

  hookRef.ctx.reactSetState = hf.makeRefSetState(hookRef);
  hookRef.ctx.reactForceUpdate = hf.makeRefForceUpdate(hookRef);

  const refCtx = hookRef.ctx;
  refCtx.props = props;// attach props to ctx
  refCtx.extra = extra;// attach extra before setup process
  beforeMount(hookRef, setup, bindCtxToMethod);

  // cursor_refKey_[cursor] = hookRef.ctx.ccUniqueKey;
  refKeyContainer.current = hookRef.ctx.ccUniqueKey;

  // rewrite useRef for CcHook
  refCtx.useRef = function useR(refName) {//give named function to avoid eslint error
    const ref = React.useRef(null);
    refCtx.refs[refName] = ref;
    return ref;
  }

  return hookRef;
}

function replaceSetter(ctx, hookSetter){
  ctx.__boundSetState = hookSetter;
  ctx.__boundForceUpdate = hookSetter;
}

const tip = 'react version is LTE 16.8';
//写为具名函数，防止react devtoo里显示.default
export default function useConcent(registerOption, ccClassKey){
  const _registerOption = getRegisterOptions(registerOption);
  // here not allow user pass extra as undefined, it will been given value {} implicitly if pass undefined!!!
  let { state: iState = {}, props = {}, mapProps, layoutEffect = false, extra = {} } = _registerOption;

  const reactUseState = React.useState;
  if (!reactUseState) {
    throw new Error(tip);
  }

  const cursor = getUsableCursor();
  const [lockedCursor] = reactUseState(cursor);
  const isFirstRendered = lockedCursor === cursor;

  const state = isFirstRendered ? evalState(iState) : 0;
  const [hookState, hookSetter] = reactUseState(state);

  const refKeyContainer = React.useRef(null);

  const cref = (ref) => buildRef(ref, refKeyContainer, state, iState, _registerOption, hookState, hookSetter, props, extra, ccClassKey);
  let hookRef;

  if (isFirstRendered) {
    hookRef = cref();
  } else {
    hookRef = ccUkey_ref_[refKeyContainer.current];
    if (!hookRef) {// single file demo in hot reload mode
      hookRef = cref();
    } else {
      const refCtx = hookRef.ctx;
      refCtx.prevProps = refCtx.props;
      hookRef.props = refCtx.props = props;
      refCtx.extra = extra;
    }
  }

  const refCtx = hookRef.ctx; 
  // ???does user really need beforeMount,mounted,beforeUpdate,updated,beforeUnmount in setup???
  const effectHandler = layoutEffect ? React.useLayoutEffect : React.useEffect;
  //after every render
  effectHandler(() => {
    if (!hookRef.isFirstRendered) {// mock componentDidUpdate
      didUpdate(hookRef);
    }
    replaceSetter(refCtx, hookSetter);
  });

  //after first render
  effectHandler(() => {// mock componentDidMount
    // 正常情况走到这里应该是true，如果是false，则是热加载情况下的hook行为，此前已走了一次beforeUnmount
    // 需要走重新初始化当前组件的整个流程，否则热加载时的setup等参数将无效，只是不需要再次创建ref
    if (hookRef.isFirstRendered === false) {
      cref(hookRef);
    } else {
      hookRef.isFirstRendered = false;
    }
    replaceSetter(refCtx, hookSetter);
    didMount(hookRef);
    
    return () => {// mock componentWillUnmount
      beforeUnmount(hookRef);
    }
  }, []);

  // before every render
  if (mapProps) {
    const mapped = mapProps(refCtx);
    if (!isPJO(mapped)) {
      throw new Error(`mapProps ret ${NOT_A_JSON}`)
    }
    refCtx.mapped = mapped;
  }

  return refCtx;
}
