"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _CcFragment = _interopRequireDefault(require("../component/CcFragment"));

var util = _interopRequireWildcard(require("../support/util"));

var _react = _interopRequireDefault(require("react"));

/**
mapComputed = {
  fullName(state){
    return state.firstName + state.lastName;
  }
};
*/
function _connectDumb(connect, state, setup, mapState, alias, Dumb, props) {
  var render = function render(ctx) {
    var mappedState = {};

    if (mapState) {
      var _state = ctx.state,
          connectedState = ctx.connectedState;

      if (mapState === true) {
        mappedState = util.flatObject(connectedState, alias);
      } else {
        mappedState = mapState(_state, connectedState, props) || {};
      }
    }

    return _react["default"].createElement(Dumb, {
      mappedState: mappedState,
      ctx: ctx,
      props: props
    });
  };

  return _react["default"].createElement(_CcFragment["default"], {
    props: props,
    connect: connect,
    state: state,
    setup: setup,
    render: render
  });
}

var _default = function _default(_ref) {
  var connect = _ref.connect,
      state = _ref.state,
      setup = _ref.setup,
      _ref$alias = _ref.alias,
      alias = _ref$alias === void 0 ? {} : _ref$alias,
      mapState = _ref.mapState;
  return function (Dumb) {
    //这样写可以避免react dev tool显示的dom为Unknown
    var ConnectedFragment = function ConnectedFragment(props) {
      return _connectDumb(connect, state, setup, mapState, alias, Dumb, props);
    };

    return ConnectedFragment;
  };
};

exports["default"] = _default;