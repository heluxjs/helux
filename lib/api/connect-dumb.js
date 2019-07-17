"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _CcFragment = _interopRequireDefault(require("../component/CcFragment"));

var util = _interopRequireWildcard(require("../support/util"));

var _react = _interopRequireDefault(require("react"));

function _connectDumb(tag, mapProps, module, watchedKeys, connect, state, setup, bindCtxToMethod, mapState, alias, Dumb, props) {
  var render = function render(ctx) {
    var connectedState = ctx.connectedState;

    if (mapProps) {
      var generatedProps = mapProps(ctx);
      if (mapState) throw new Error('mapState is not allowed when you specify mapProps in args');
      return _react["default"].createElement(Dumb, generatedProps);
    } else {
      var mappedState = {};

      if (mapState) {
        if (mapState === true) {
          mappedState = util.flatObject(connectedState, alias);
        } else {
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
  };

  var fTag = props.tag || tag; //优先读取实例化传的，再读connectDumb配置的
  //ccKey由实例化的Dumb组件props上透传下来

  return _react["default"].createElement(_CcFragment["default"], {
    tag: fTag,
    key: props.key,
    ccKey: props.ccKey,
    props: props,
    module: module,
    watchedKeys: watchedKeys,
    connect: connect,
    state: state,
    setup: setup,
    bindCtxToMethod: bindCtxToMethod,
    render: render
  });
}

var _default = function _default(_ref) {
  var tag = _ref.tag,
      mapProps = _ref.mapProps,
      mapState = _ref.mapState,
      module = _ref.module,
      watchedKeys = _ref.watchedKeys,
      connect = _ref.connect,
      _ref$state = _ref.state,
      state = _ref$state === void 0 ? {} : _ref$state,
      setup = _ref.setup,
      bindCtxToMethod = _ref.bindCtxToMethod,
      _ref$alias = _ref.alias,
      alias = _ref$alias === void 0 ? {} : _ref$alias;
  return function (Dumb) {
    //对state做克隆,防止用同一个connectDumb结果包不同的fn组件,共享了同一份state
    //const c = connectDumb({state:{info:{a:1}}});
    // const UI1_ = c(UI1); const UI2_ = c(UI2);
    // 让UI1_和UI2_各自拥有自己的localState
    var stateType = typeof state;
    var clonedState = null;
    if (stateType === 'function') clonedState = state();else if (stateType !== 'object') {
      throw new Error('state must be a plain json object');
    } else {
      clonedState = util.clone(state);
    } //这样写可以避免react dev tool显示的dom为Unknown

    var ConnectedFragment = function ConnectedFragment(props) {
      return _connectDumb(tag, mapProps, module, watchedKeys, connect, clonedState, setup, bindCtxToMethod, mapState, alias, Dumb, props);
    };

    return ConnectedFragment;
  };
};

exports["default"] = _default;