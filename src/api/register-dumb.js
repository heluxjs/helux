
import React from 'react';
import CcFragment from '../component/CcFragment';
import mapRegistrationInfo from '../core/base/map-registration-info';
import * as util from '../support/util';
import { CC_FRAGMENT_PREFIX } from '../support/constant';

function _registerDumb(Dumb, regOpt) {
  const { ccClassKey, mapProps, props = {} } = regOpt;

  const render = (ctx) => {
    if (mapProps) {
      ctx.mapped = mapProps(ctx);
      return React.createElement(Dumb, ctx.mapped);
    } else {
      return React.createElement(Dumb, ctx);
    }
  };

  //ccKey由实例化的Dumb组件props上透传下来
  const passProps = {
    __$$regDumb: true, props, ccOption: props.ccOption, ccClassKey, render, ccKey: props.ccKey,
    register: regOpt,
  };
  return React.createElement(CcFragment, passProps);
}

// renderKeyClasses, isSingle, tag, mapProps, module = MODULE_DEFAULT, reducerModule,
// watchedKeys = '*', storedKeys, persistStoredKeys, render: Dumb,
// connect = {}, state = {}, setup, bindCtxToMethod, compareProps, lite,
// bindCtxToMethod
export default function (registerOption, ccClassKey) {
  const _registerOption = util.getRegisterOptions(registerOption);
  const {
    renderKeyClasses, module, reducerModule, watchedKeys = '*', storedKeys, render: Dumb, connect = {},
  } = _registerOption;
  
  
  const { _module, _reducerModule, _watchedKeys, _ccClassKey, _connect } = mapRegistrationInfo(
    module, ccClassKey, renderKeyClasses, CC_FRAGMENT_PREFIX, watchedKeys, storedKeys, connect, reducerModule, true
  );
  _registerOption.module = _module;
  _registerOption.reducerModule = _reducerModule;
  _registerOption.watchedKeys = _watchedKeys;
  _registerOption.ccClassKey = _ccClassKey;
  _registerOption.connect = _connect;

  function buildCcFragComp(Dumb) {
    //避免react dev tool显示的dom为Unknown
    const ConnectedFragment = props => {
      _registerOption.props = props;
      return _registerDumb(Dumb, _registerOption);
    }
    return ConnectedFragment;
  }

  if (Dumb) {
    return buildCcFragComp(Dumb);
  } else {
    return Dumb => buildCcFragComp(Dumb);
  }
}
