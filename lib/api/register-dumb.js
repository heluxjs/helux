"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _react = _interopRequireDefault(require("react"));

var _CcFragment = _interopRequireDefault(require("../component/CcFragment"));

var _mapRegistrationInfo2 = _interopRequireDefault(require("../core/base/map-registration-info"));

var util = _interopRequireWildcard(require("../support/util"));

var _constant = require("../support/constant");

function _registerDumb(Dumb, isSingle, module, reducerModule, watchedKeys, storedKeys, persistStoredKeys, connect, state, setup, bindCtxToMethod, ccClassKey, tag, mapProps, props, compareProps, lite) {
  //对state做克隆,防止用同一个connectDumb结果包不同的fn组件,共享了同一份state
  //const c = registerDumb({state:{info:{a:1}}});
  // const UI1_ = c(UI1); const UI2_ = c(UI2);
  // 让UI1_和UI2_各自拥有自己的localState
  var stateType = typeof state;
  var clonedState = null;
  if (stateType === 'function') clonedState = state();else if (stateType !== 'object') {
    throw new Error('state must be a plain json object');
  } else {
    clonedState = util.clone(state);
  }

  var render = function render(ctx) {
    if (mapProps) {
      ctx.mapped = mapProps(ctx);
      return _react["default"].createElement(Dumb, ctx.mapped);
    } else {
      return _react["default"].createElement(Dumb, ctx);
    }
  }; //优先读取实例化的时候传入的，再读connectDumb配置的


  var ccOption = props.ccOption || {
    persistStoredKeys: persistStoredKeys
  };
  var passProps = {
    __$$regDumb: true,
    props: props,
    ccOption: ccOption,
    ccClassKey: ccClassKey,
    render: render,
    ccKey: props.ccKey,
    register: {
      isSingle: isSingle,
      tag: tag,
      module: module,
      reducerModule: reducerModule,
      lite: lite,
      watchedKeys: watchedKeys,
      storedKeys: storedKeys,
      connect: connect,
      state: clonedState,
      setup: setup,
      bindCtxToMethod: bindCtxToMethod,
      compareProps: compareProps
    }
  }; //ccKey由实例化的Dumb组件props上透传下来

  return _react["default"].createElement(_CcFragment["default"], passProps);
}

function _default(registerOption, ccClassKey) {
  var _registerOption = util.getRegisterOptions(registerOption);

  var renderKeyClasses = _registerOption.renderKeyClasses,
      isSingle = _registerOption.isSingle,
      tag = _registerOption.tag,
      mapProps = _registerOption.mapProps,
      _registerOption$modul = _registerOption.module,
      module = _registerOption$modul === void 0 ? _constant.MODULE_DEFAULT : _registerOption$modul,
      reducerModule = _registerOption.reducerModule,
      _registerOption$watch = _registerOption.watchedKeys,
      watchedKeys = _registerOption$watch === void 0 ? '*' : _registerOption$watch,
      storedKeys = _registerOption.storedKeys,
      persistStoredKeys = _registerOption.persistStoredKeys,
      Dumb = _registerOption.render,
      _registerOption$conne = _registerOption.connect,
      connect = _registerOption$conne === void 0 ? {} : _registerOption$conne,
      _registerOption$state = _registerOption.state,
      state = _registerOption$state === void 0 ? {} : _registerOption$state,
      setup = _registerOption.setup,
      bindCtxToMethod = _registerOption.bindCtxToMethod,
      compareProps = _registerOption.compareProps,
      lite = _registerOption.lite;

  var _mapRegistrationInfo = (0, _mapRegistrationInfo2["default"])(module, ccClassKey, renderKeyClasses, _constant.CC_FRAGMENT_PREFIX, watchedKeys, storedKeys, connect, reducerModule, true),
      _module = _mapRegistrationInfo._module,
      _reducerModule = _mapRegistrationInfo._reducerModule,
      _watchedKeys = _mapRegistrationInfo._watchedKeys,
      _ccClassKey = _mapRegistrationInfo._ccClassKey,
      _connect = _mapRegistrationInfo._connect;

  function buildCcFragComp(Dumb) {
    //避免react dev tool显示的dom为Unknown
    var ConnectedFragment = function ConnectedFragment(props) {
      return _registerDumb(Dumb, isSingle, _module, _reducerModule, _watchedKeys, storedKeys, persistStoredKeys, _connect, state, setup, bindCtxToMethod, _ccClassKey, tag, mapProps, props, compareProps, lite);
    };

    return ConnectedFragment;
  }

  if (Dumb) {
    return buildCcFragComp(Dumb);
  } else {
    return function (Dumb) {
      return buildCcFragComp(Dumb);
    };
  }
}