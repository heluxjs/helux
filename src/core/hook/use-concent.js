import React from 'react';
import { CC_HOOK_PREFIX } from '../../support/constant';
import buildRefCtx from '../ref/build-ref-ctx';
import ccContext from '../../cc-context';
import mapRegistrationInfo from '../base/map-registration-info';
import beforeMount from '../base/before-mount';
import beforeUnmount from '../base/before-unmount';
import triggerSetupEffect from '../base/trigger-setup-effect';
import getStoredKeys from '../base/get-stored-keys';

const { ccUkey_ref_, moduleName_stateKeys_ } = ccContext;

let refCursor = 1;
const cursor_refKey_ = {};

function getUsableCursor() {
  return refCursor;
}
function incCursor() {
  refCursor = refCursor + 1;
}

const makeSetState = (ccHookState, hookSetState) => partialState => {
  ccHookState.state = Object.assign({}, ccHookState.state, partialState);
  const newHookState = Object.assign({}, ccHookState);
  hookSetState(newHookState);
}
const makeForceUpdate = (ccHookState, hookSetState) => () => {
  const newHookState = Object.assign({}, ccHookState);
  hookSetState(newHookState);
}

function CcHook(ccHookState, hookSetState, props) {
  this.setState = makeSetState(ccHookState, hookSetState);
  this.forceUpdate = makeForceUpdate(ccHookState, hookSetState);
  this.__$$isUnmounted = false;
  this.state = ccHookState.state;
  this.isFirstRendered = true;
  this.props = props;
}

export default (registerOption) => {
  let _registerOption = registerOption;
  if (typeof registerOption === 'string') {
    _registerOption = { module: registerOption };
  }

  const { state = {}, props = {}, mapProps } = _registerOption;
  const reactUseState = React.useState;
  if (!reactUseState) {
    throw new Error('make sure your react version is LTE 16.8');
  }

  const cursor = getUsableCursor();
  const [ccHookState, hookSetState] = reactUseState({ cursor, state });
  const nowCursor = ccHookState.cursor;

  const isFirstRendered = nowCursor === cursor;
  let hookRef;
  if (isFirstRendered) {
    const {
      ccClassKey, module, reducerModule, watchedKeys = '*', storedKeys = [],
      persistStoredKeys, connect = {}, setup, bindCtxToMethod,
    } = _registerOption;

    incCursor();
    const { _module, _reducerModule, _watchedKeys, _ccClassKey, _connect } = mapRegistrationInfo(
      module, ccClassKey, CC_HOOK_PREFIX, watchedKeys, storedKeys, connect, reducerModule, true
    );
    hookRef = new CcHook(ccHookState, hookSetState, props);

    const ccOption = props.ccOption || { persistStoredKeys };
    const _storedKeys = getStoredKeys(state, moduleName_stateKeys_[_module], ccOption.storedKeys, storedKeys);
    const params = Object.assign({}, _registerOption, {
      module: _module, reducerModule: _reducerModule, watchedKeys: _watchedKeys, type: CC_HOOK_PREFIX,
      ccClassKey: _ccClassKey, connect: _connect, ccOption, storedKeys: _storedKeys,
    });

    buildRefCtx(hookRef, params);
    beforeMount(hookRef, setup, bindCtxToMethod);
    cursor_refKey_[nowCursor] = hookRef.ctx.ccUniqueKey;
  } else {
    const refKey = cursor_refKey_[nowCursor];
    hookRef = ccUkey_ref_[refKey];

    const refCtx = hookRef.ctx;
    //existing period, replace reactSetState and reactForceUpdate
    refCtx.reactSetState = makeSetState(ccHookState, hookSetState);
    refCtx.reactForceUpdate = makeForceUpdate(ccHookState, hookSetState);
    refCtx.props = props;
  }

  const refCtx = hookRef.ctx;

  // ???does user really need beforeMount,mounted,beforeUpdate,updated,beforeUnmount???

  //for every render
  React.useEffect(() => {
    if (!hookRef.isFirstRendered) {// mock componentDidUpdate
      triggerSetupEffect(hookRef, false);
      hookRef.ctx.prevState = Object.assign({}, hookRef.state);//方便下一轮渲染比较用
    }
  });

  //for first render
  React.useEffect(() => {// mock componentDidMount
    hookRef.isFirstRendered = false;
    triggerSetupEffect(hookRef, true);
    return () => {// mock componentWillUnmount
      beforeUnmount(hookRef);
    }
  }, []);

  // before every render
  if (mapProps) {
    refCtx.mapped = mapProps(refCtx);
  }

  return refCtx;
}
