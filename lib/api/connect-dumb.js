"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _CcFragment = _interopRequireDefault(require("../component/CcFragment"));

var util = _interopRequireWildcard(require("../support/util"));

var _react = _interopRequireDefault(require("react"));

function _connectDumb(mapProps, module, connect, state, setup, bindCtxToMethod, mapState, alias, Dumb, props) {
  var render = function render(ctx) {
    var connectedState = ctx.connectedState;

    if (mapProps) {
      //和mapState保持参数一致
      var generatedProps = mapProps(ctx);
      if (mapState) throw new Error('mapState is not allowed when you specify mapProps in args');
      return _react["default"].createElement(Dumb, generatedProps);
    } else {
      var mappedState = {};

      if (mapState) {
        if (mapState === true) {
          mappedState = util.flatObject(connectedState, alias);
        } else {
          //mapState重点强调映射state，所以前三位参数都是给用户选择的，最后一个才是ctx
          mappedState = mapState(ctx) || {};
        }
      }

      ctx.mappedState = mappedState; //将mappedState绑在ctx上，方便其他地方使用

      return _react["default"].createElement(Dumb, {
        mappedState: mappedState,
        ctx: ctx,
        props: props
      });
    }
  }; //ccKey由实例化的Dumb组件props上透传下来


  return _react["default"].createElement(_CcFragment["default"], {
    key: props.key,
    ccKey: props.ccKey,
    props: props,
    module: module,
    connect: connect,
    state: state,
    setup: setup,
    bindCtxToMethod: bindCtxToMethod,
    render: render
  });
}

var _default = function _default(_ref) {
  var mapProps = _ref.mapProps,
      mapState = _ref.mapState,
      module = _ref.module,
      connect = _ref.connect,
      state = _ref.state,
      setup = _ref.setup,
      bindCtxToMethod = _ref.bindCtxToMethod,
      _ref$alias = _ref.alias,
      alias = _ref$alias === void 0 ? {} : _ref$alias;
  return function (Dumb) {
    //这样写可以避免react dev tool显示的dom为Unknown
    var ConnectedFragment = function ConnectedFragment(props) {
      return _connectDumb(mapProps, module, connect, state, setup, bindCtxToMethod, mapState, alias, Dumb, props);
    };

    return ConnectedFragment;
  };
};

exports["default"] = _default;