"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _register = _interopRequireDefault(require("../core/helper/register"));

var _react = _interopRequireDefault(require("react"));

var _constant = require("../support/constant");

var _default = (0, _register.default)(_constant.CC_DISPATCHER, {
  isSingle: true,
  checkStartUp: false
})(
/*#__PURE__*/
function (_React$Component) {
  (0, _inheritsLoose2.default)(_class, _React$Component);

  function _class(props, context) {
    return _React$Component.call(this, props, context) || this;
  }

  var _proto = _class.prototype;

  _proto.render = function render() {
    return this.props.children || '';
  };

  return _class;
}(_react.default.Component));

exports.default = _default;