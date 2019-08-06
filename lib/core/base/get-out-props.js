"use strict";

exports.__esModule = true;
exports["default"] = _default;

function _default(props) {
  if (props) {
    return props.props || props; //把最外层的props传递给用户
  } else {
    return {};
  }
}