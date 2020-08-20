
import * as React from 'react';
import CcFragment from '../component/CcFragment';
import mapRegistrationInfo from '../core/base/map-registration-info';
import * as util from '../support/util';
import { CC_FRAGMENT } from '../support/constant';

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

// renderKeyClasses, tag, mapProps, module = MODULE_DEFAULT,
// watchedKeys = '*', storedKeys, persistStoredKeys, render: Dumb,
// connect = {}, state = {}, setup, bindCtxToMethod, compareProps, lite,
// bindCtxToMethod
export default function (registerOption, ccClassKey) {
  const _registerOption = util.getRegisterOptions(registerOption);
  const {
    renderKeyClasses, module, watchedKeys = '-', render: Dumb, connect = {},
  } = _registerOption;
  
  const { _module, _ccClassKey, _connect, _watchedKeys } = mapRegistrationInfo(
    module, ccClassKey, renderKeyClasses, CC_FRAGMENT, watchedKeys, connect, true
  );
  _registerOption.module = _module;
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
