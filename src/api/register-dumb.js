
import React from 'react';
import CcFragment from '../component/CcFragment';
import mapRegistrationInfo from '../core/base/map-registration-info';
import * as util from '../support/util';
import { CC_FRAGMENT_PREFIX, MODULE_DEFAULT } from '../support/constant';

function _registerDumb(
  Dumb, isSingle, module, reducerModule, watchedKeys, storedKeys, persistStoredKeys,
  connect, state, setup, bindCtxToMethod, ccClassKey, tag, mapProps, props, compareProps,
) {

  //对state做克隆,防止用同一个connectDumb结果包不同的fn组件,共享了同一份state
  //const c = registerDumb({state:{info:{a:1}}});
  // const UI1_ = c(UI1); const UI2_ = c(UI2);
  // 让UI1_和UI2_各自拥有自己的localState
  const stateType = typeof state;
  let clonedState = null;
  if (stateType === 'function') clonedState = state();
  else if (stateType !== 'object') {
    throw new Error('state must be a plain json object');
  } else {
    clonedState = util.clone(state);
  }

  const render = (ctx) => {
    if (mapProps) {
      ctx.mapped = mapProps(ctx);
      // if (generatedProps.ctx === undefined) generatedProps.ctx = ctx;
      return React.createElement(Dumb, ctx.mapped);
    } else {
      return React.createElement(Dumb, ctx);
    }
  };

  //优先读取实例化的时候传入的，再读connectDumb配置的
  const ccTag = props.ccTag || tag;

  const ccOption = { persistStoredKeys };
  //ccKey由实例化的Dumb组件props上透传下来
  return React.createElement(CcFragment, {
    isSingle, ccClassKey, __$$regDumb: true, tag: ccTag, ccKey: props.ccKey, props, module, reducerModule,
    watchedKeys, storedKeys, ccOption, connect, state: clonedState, setup, bindCtxToMethod, render, compareProps,
  });
}

export default function (registerOption, ccClassKey) {
  let _registerOption = typeof registerOption === 'string' ? { module: registerOption } : registerOption;
  if (!_registerOption) _registerOption = { module: MODULE_DEFAULT };

  const {
    isSingle, tag, mapProps, module = MODULE_DEFAULT, reducerModule,
    watchedKeys = '*', storedKeys, persistStoredKeys, render: Dumb,
    connect = {}, state = {}, setup, bindCtxToMethod, compareProps,
  } = _registerOption;

  const { _module, _reducerModule, _watchedKeys, _ccClassKey, _connect } = mapRegistrationInfo(
    module, ccClassKey, CC_FRAGMENT_PREFIX, watchedKeys, storedKeys, connect, reducerModule, true
  );

  function buildCcFragComp(Dumb) {
    //避免react dev tool显示的dom为Unknown
    const ConnectedFragment = props => _registerDumb(
      Dumb, isSingle, _module, _reducerModule, _watchedKeys, storedKeys, persistStoredKeys,
      _connect, state, setup, bindCtxToMethod, _ccClassKey, tag, mapProps, props, compareProps,
    );
    return ConnectedFragment;
  }

  if (Dumb) {
    return buildCcFragComp(Dumb);
  } else {
    return Dumb => buildCcFragComp(Dumb);
  }
}
