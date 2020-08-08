/**
 * http://react.html.cn/docs/strict-mode.html
 * https://frontarm.com/daishi-kato/use-ref-in-concurrent-mode/
 */
import React from 'react';
import { CC_HOOK, CC_OB, CC_CUSTOMIZE } from '../../support/constant';
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
import beforeRender from '../ref/before-render';
import { isRegChanged } from './common';

const { ccUKey_ref_ } = ccContext;
const cursor_hookCtx_ = {};
let refCursor = 1;

function getUsableCursor() {
  let toReturn = refCursor;
  return toReturn; 
}
function incCursor() {
  refCursor = refCursor + 1;
}

function CcHook(state, hookSetter, props, hookCtx) {
  //new CcHook时，这里锁定的hookSetter就是后面一直可以用的setter
  //如果存在期一直替换hookSetter，反倒会造成打开react-dev-tool，点击面板里的dom后，视图便不再更新的bug
  this.setState = hookSetter;
  this.forceUpdate = hookSetter;
  this.state = state;
  this.isFirstRendered = true;
  this.props = props;
  this.hookCtx = hookCtx;
}

// rState: resolvedState, iState: initialState
function buildRef(ref, insType, hookCtx, rState, iState, regOpt, hookState, hookSetter, props, extra, ccClassKey) {
  incCursor();
  cursor_hookCtx_[hookCtx.cursor] = hookCtx;

  // when single file demo in hmr mode trigger buildRef, rState is 0 
  // so here call evalState again
  const state = rState || evalState(iState);
  const bindCtxToMethod = regOpt.bindCtxToMethod;

  const {
    renderKeyClasses, module, watchedKeys = '-',
    connect = {}, setup, lite,
  } = regOpt;

  const { _module, _ccClassKey, _connect, _watchedKeys } = mapRegistrationInfo(
    module, ccClassKey, renderKeyClasses, CC_HOOK, watchedKeys, connect, true
  );

  const hookRef = ref || new CcHook(hookState, hookSetter, props, hookCtx);
  hookCtx.hookRef = hookRef;

  const params = Object.assign({}, regOpt, {
    module: _module, watchedKeys: _watchedKeys, state, type: CC_HOOK, insType, extra,
    ccClassKey: _ccClassKey, connect: _connect,
    ccOption: props.ccOption, id: props.id, ccKey: props.ccKey,
  });
  hookRef.props = props;// keep shape same as class
  buildRefCtx(hookRef, params, lite);// in buildRefCtx cc will assign hookRef.props to ctx.prevProps

  hookRef.ctx.reactSetState = hf.makeRefSetState(hookRef);
  hookRef.ctx.reactForceUpdate = hf.makeRefForceUpdate(hookRef);

  const refCtx = hookRef.ctx;
  refCtx.props = props;// attach props to ctx
  beforeMount(hookRef, setup, bindCtxToMethod);

  // cursor_refKey_[cursor] = hookRef.ctx.ccUniqueKey;
  hookCtx.prevCcUKey = hookCtx.ccUKey;
  hookCtx.ccUKey = hookRef.ctx.ccUniqueKey;

  // rewrite useRef for CcHook
  refCtx.useRef = function useR(refName) {//give named function to avoid eslint error
    const ref = React.useRef(null);
    refCtx.refs[refName] = ref;
    return ref;
  }

  return hookRef;
}

function replaceSetter(ctx, hookSetter) {
  ctx.__boundSetState = hookSetter;
  ctx.__boundForceUpdate = hookSetter;
}

const tip = 'react version is LTE 16.8';

function _useConcent(registerOption = {}, ccClassKey, insType) {
  const cursor = getUsableCursor();
  const _registerOption = getRegisterOptions(registerOption);

  // ef: effectFlag
  const hookCtxContainer = React.useRef({ cursor, prevCcUKey: null, ccUKey: null, regOpt: _registerOption, ef: 0 });
  const hookCtx = hookCtxContainer.current;
  
  // here not allow user pass extra as undefined, it will been given value {} implicitly if pass undefined!!!
  let { state: iState = {}, props = {}, mapProps, layoutEffect = false, extra = {} } = _registerOption;
  
  const reactUseState = React.useState;
  if (!reactUseState) {
    throw new Error(tip);
  }
  
  const isFirstRendered = cursor === hookCtx.cursor;
  const state = isFirstRendered ? evalState(iState) : 0;
  const [hookState, hookSetter] = reactUseState(state);
  
  const cref = (ref) => buildRef(ref, insType, hookCtx, state, iState, _registerOption, hookState, hookSetter, props, extra, ccClassKey);
  
  let hookRef;
  // 组件刚挂载 or 渲染过程中变化module或者connect的值，触发创建新ref
  if (isFirstRendered || isRegChanged(hookCtx.regOpt, _registerOption, true)) {
    hookCtx.regOpt = _registerOption;
    hookRef = cref();
  } else {
    hookRef = ccUKey_ref_[hookCtx.ccUKey];
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
  const effectHandler = layoutEffect ? React.useLayoutEffect : React.useEffect;

  // after first render of hookRef just created 
  effectHandler(() => {
    const hookCtx = hookRef.hookCtx;
    hookCtx.ef = 1;

    // mock componentWillUnmount
    return () => {
      const targetCcUKey = hookCtx.prevCcUKey || hookCtx.ccUKey;
      const toUnmountRef = ccUKey_ref_[targetCcUKey];
      if (toUnmountRef) {
        hookCtx.prevCcUKey = null;
        beforeUnmount(toUnmountRef);
      }
      delete cursor_hookCtx_[cursor];
    }
  }, [hookRef]);// 渲染过程中变化module或者connect的值，触发卸载前一刻的ref

  //after every render
  effectHandler(() => {
    replaceSetter(refCtx, hookSetter);
    if (!hookRef.isFirstRendered) {// mock componentDidUpdate
      didUpdate(hookRef);
    } else {// mock componentDidMount
      hookRef.isFirstRendered = false;
      didMount(hookRef);
    }

    // dobule-invoking 机制导致初始化阶段生成了一个多余的hookRef
    // 虽然未存储到refs上，但是收集到的依赖存储到了waKey_uKeyMap_上
    // 这里通过触发beforeUnmount来清理多余的依赖
    if (!hookCtx.clearPrev) {
      hookCtx.clearPrev = true;
      const cursor = hookCtx.cursor;
      const prevCursor = cursor - 1;
      const prevHookCtx = cursor_hookCtx_[prevCursor];
      if (prevHookCtx && prevHookCtx.ef === 0) {
        delete cursor_hookCtx_[prevCursor];
        // 让来自于concent的渲染通知只触发一次, 注意prevHookRef没有被重复触发过diMount逻辑
        // 所以直接用prevHookCtx.hookRef来执行beforeUnmount
        beforeUnmount(prevHookCtx.hookRef);
      }
    }
  });

  beforeRender(hookRef);

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

/**
 * 仅供内部 component/Ob 调用
 */
export function useConcentForOb(registerOption, ccClassKey) {
  // 只针对Ob组件实例化检查时，reg参数是否已变化
  return _useConcent(registerOption, ccClassKey, CC_OB);
}

//写为具名函数，防止react-dev-tool里显示.default
function useConcent(registerOption, ccClassKey) {
  return _useConcent(registerOption, ccClassKey, CC_CUSTOMIZE);
}

export default useConcent;
