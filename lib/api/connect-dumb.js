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
function _connectDumb(connect, mapState, alias, Dumb, props) {
  var render = function render(cc) {
    var connectedState = cc.connectedState;
    var flatedObj;

    if (mapState) {
      flatedObj = mapState(connectedState, props) || {};
    } else {
      flatedObj = util.flatObject(connectedState, alias);
    }

    return _react["default"].createElement(Dumb, {
      state: flatedObj,
      connectedState: connectedState,
      cc: cc,
      props: props
    });
  };

  return _react["default"].createElement(_CcFragment["default"], {
    connect: connect,
    render: render
  });
}

var _default = function _default(_ref) {
  var connect = _ref.connect,
      _ref$alias = _ref.alias,
      alias = _ref$alias === void 0 ? {} : _ref$alias,
      _ref$mapState = _ref.mapState,
      mapState = _ref$mapState === void 0 ? {} : _ref$mapState;
  return function (Dumb) {
    return function (props) {
      return _connectDumb(connect, mapState, alias, Dumb, props);
    };
  };
};

exports["default"] = _default;