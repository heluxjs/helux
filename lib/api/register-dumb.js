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

function _registerDumb(Dumb, regOpt) {
  var ccClassKey = regOpt.ccClassKey,
      mapProps = regOpt.mapProps,
      _regOpt$props = regOpt.props,
      props = _regOpt$props === void 0 ? {} : _regOpt$props;

  var render = function render(ctx) {
    if (mapProps) {
      ctx.mapped = mapProps(ctx);
      return _react["default"].createElement(Dumb, ctx.mapped);
    } else {
      return _react["default"].createElement(Dumb, ctx);
    }
  }; //ccKey由实例化的Dumb组件props上透传下来


  var passProps = {
    __$$regDumb: true,
    props: props,
    ccOption: props.ccOption,
    ccClassKey: ccClassKey,
    render: render,
    ccKey: props.ccKey,
    register: regOpt
  };
  return _react["default"].createElement(_CcFragment["default"], passProps);
} // renderKeyClasses, tag, mapProps, module = MODULE_DEFAULT,
// watchedKeys = '*', storedKeys, persistStoredKeys, render: Dumb,
// connect = {}, state = {}, setup, bindCtxToMethod, compareProps, lite,
// bindCtxToMethod


function _default(registerOption, ccClassKey) {
  var _registerOption = util.getRegisterOptions(registerOption);

  var renderKeyClasses = _registerOption.renderKeyClasses,
      module = _registerOption.module,
      _registerOption$watch = _registerOption.watchedKeys,
      watchedKeys = _registerOption$watch === void 0 ? '-' : _registerOption$watch,
      Dumb = _registerOption.render,
      _registerOption$conne = _registerOption.connect,
      connect = _registerOption$conne === void 0 ? {} : _registerOption$conne;

  var _mapRegistrationInfo = (0, _mapRegistrationInfo2["default"])(module, ccClassKey, renderKeyClasses, _constant.CC_FRAGMENT, watchedKeys, connect, true),
      _module = _mapRegistrationInfo._module,
      _ccClassKey = _mapRegistrationInfo._ccClassKey,
      _connect = _mapRegistrationInfo._connect,
      _watchedKeys = _mapRegistrationInfo._watchedKeys;

  _registerOption.module = _module;
  _registerOption.watchedKeys = _watchedKeys;
  _registerOption.ccClassKey = _ccClassKey;
  _registerOption.connect = _connect;

  function buildCcFragComp(Dumb) {
    //避免react dev tool显示的dom为Unknown
    var ConnectedFragment = function ConnectedFragment(props) {
      _registerOption.props = props;
      return _registerDumb(Dumb, _registerOption);
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