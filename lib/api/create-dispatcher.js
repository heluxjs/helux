"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _register = _interopRequireDefault(require("../core/base/register"));

var _react = _interopRequireDefault(require("react"));

var _constant = require("../support/constant");

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _util = _interopRequireDefault(require("../support/util"));

function _default(CustomizedComponent) {
  var DefaultComponent =
  /*#__PURE__*/
  function (_React$Component) {
    (0, _inheritsLoose2["default"])(DefaultComponent, _React$Component);

    function DefaultComponent(props, context) {
      return _React$Component.call(this, props, context) || this;
    }

    var _proto = DefaultComponent.prototype;

    _proto.render = function render() {
      return this.props.children || _react["default"].createElement('span', {
        style: {
          display: 'none'
        }
      });
    };

    return DefaultComponent;
  }(_react["default"].Component);

  if (_ccContext["default"].refs[_constant.CC_DISPATCHER]) {
    if (_ccContext["default"].isHotReloadMode()) {
      _util["default"].justTip("hot reload mode, CC_DISPATCHER existed");
    } else {
      throw new Error("CcDispatcher can only be initialize one time");
    }
  }

  var TargetComponent = CustomizedComponent || DefaultComponent;
  return (0, _register["default"])(_constant.CC_DISPATCHER, {
    isSingle: true,
    __checkStartUp: false,
    __calledBy: 'cc'
  })(TargetComponent);
}