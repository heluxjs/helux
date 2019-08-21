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

function _registerDumb(Dumb, isSingle, module, reducerModule, watchedKeys, storedKeys, persistStoredKeys, connect, state, setup, bindCtxToMethod, ccClassKey, tag, mapProps, props, compareProps) {
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
      ctx.mapped = mapProps(ctx); // if (generatedProps.ctx === undefined) generatedProps.ctx = ctx;

      return _react["default"].createElement(Dumb, ctx.mapped);
    } else {
      return _react["default"].createElement(Dumb, ctx);
    }
  }; //优先读取实例化的时候传入的，再读connectDumb配置的


  var ccTag = props.ccTag || tag;
  var ccOption = {
    persistStoredKeys: persistStoredKeys
  }; //ccKey由实例化的Dumb组件props上透传下来

  return _react["default"].createElement(_CcFragment["default"], {
    isSingle: isSingle,
    ccClassKey: ccClassKey,
    __$$regDumb: true,
    tag: ccTag,
    ccKey: props.ccKey,
    props: props,
    module: module,
    reducerModule: reducerModule,
    watchedKeys: watchedKeys,
    storedKeys: storedKeys,
    ccOption: ccOption,
    connect: connect,
    state: clonedState,
    setup: setup,
    bindCtxToMethod: bindCtxToMethod,
    render: render,
    compareProps: compareProps
  });
}

function _default(registerOption, ccClassKey) {
  var _registerOption = typeof registerOption === 'string' ? {
    module: registerOption
  } : registerOption;

  if (!_registerOption) _registerOption = {
    module: _constant.MODULE_DEFAULT
  };
  var _registerOption2 = _registerOption,
      renderKeyClasses = _registerOption2.renderKeyClasses,
      isSingle = _registerOption2.isSingle,
      tag = _registerOption2.tag,
      mapProps = _registerOption2.mapProps,
      _registerOption2$modu = _registerOption2.module,
      module = _registerOption2$modu === void 0 ? _constant.MODULE_DEFAULT : _registerOption2$modu,
      reducerModule = _registerOption2.reducerModule,
      _registerOption2$watc = _registerOption2.watchedKeys,
      watchedKeys = _registerOption2$watc === void 0 ? '*' : _registerOption2$watc,
      storedKeys = _registerOption2.storedKeys,
      persistStoredKeys = _registerOption2.persistStoredKeys,
      Dumb = _registerOption2.render,
      _registerOption2$conn = _registerOption2.connect,
      connect = _registerOption2$conn === void 0 ? {} : _registerOption2$conn,
      _registerOption2$stat = _registerOption2.state,
      state = _registerOption2$stat === void 0 ? {} : _registerOption2$stat,
      setup = _registerOption2.setup,
      bindCtxToMethod = _registerOption2.bindCtxToMethod,
      compareProps = _registerOption2.compareProps;

  var _mapRegistrationInfo = (0, _mapRegistrationInfo2["default"])(module, ccClassKey, renderKeyClasses, _constant.CC_FRAGMENT_PREFIX, watchedKeys, storedKeys, connect, reducerModule, true),
      _module = _mapRegistrationInfo._module,
      _reducerModule = _mapRegistrationInfo._reducerModule,
      _watchedKeys = _mapRegistrationInfo._watchedKeys,
      _ccClassKey = _mapRegistrationInfo._ccClassKey,
      _connect = _mapRegistrationInfo._connect;

  function buildCcFragComp(Dumb) {
    //避免react dev tool显示的dom为Unknown
    var ConnectedFragment = function ConnectedFragment(props) {
      return _registerDumb(Dumb, isSingle, _module, _reducerModule, _watchedKeys, storedKeys, persistStoredKeys, _connect, state, setup, bindCtxToMethod, _ccClassKey, tag, mapProps, props, compareProps);
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