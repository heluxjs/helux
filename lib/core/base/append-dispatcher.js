"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _reactDom = _interopRequireDefault(require("react-dom"));

var _react = _interopRequireDefault(require("react"));

var _constant = require("../../support/constant");

var _default = function _default(Dispatcher) {
  var box = document.querySelector("#" + _constant.CC_DISPATCHER_BOX);

  if (!box) {
    box = document.createElement('div');
    box.id = _constant.CC_DISPATCHER_BOX;
    var boxSt = box.style;
    boxSt.position = 'fixed';
    boxSt.left = 0;
    boxSt.top = 0;
    boxSt.display = 'none';
    boxSt.zIndex = -888666;
    document.body.append(box);
  }

  _reactDom["default"].render(_react["default"].createElement(Dispatcher), box);
};

exports["default"] = _default;