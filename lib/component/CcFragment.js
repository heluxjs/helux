"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var React = _interopRequireWildcard(require("react"));

var util = _interopRequireWildcard(require("../support/util"));

var _beforeUnmount = _interopRequireDefault(require("../core/base/before-unmount"));

var _didMount = _interopRequireDefault(require("../core/base/did-mount"));

var _didUpdate = _interopRequireDefault(require("../core/base/did-update"));

var _getOutProps = _interopRequireDefault(require("../core/base/get-out-props"));

var _initCcFrag = _interopRequireDefault(require("../core/ref/init-cc-frag"));

var _beforeRender = _interopRequireDefault(require("../core/ref/before-render"));

var _isRegChanged = _interopRequireDefault(require("../core/param/is-reg-changed"));

var shallowDiffers = util.shallowDiffers;
var nullSpan = React.createElement('span', {
  style: {
    display: 'none'
  }
});

var CcFragment =
/*#__PURE__*/
function (_React$Component) {
  (0, _inheritsLoose2["default"])(CcFragment, _React$Component);

  function CcFragment(props, context) {
    var _this;

    _this = _React$Component.call(this, props, context) || this;
    (0, _initCcFrag["default"])((0, _assertThisInitialized2["default"])(_this), props);
    return _this;
  }

  var _proto = CcFragment.prototype;

  _proto.componentDidMount = function componentDidMount() {
    (0, _didMount["default"])(this);
  };

  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    var props = (0, _getOutProps["default"])(nextProps);
    var isPropsChanged = this.__$$compareProps ? shallowDiffers(props, (0, _getOutProps["default"])(this.props)) : false; // 检测到register已发送变化，需要重新走一把卸载和初始化流程

    if (isPropsChanged && (0, _isRegChanged["default"])(props.register, this.props.register)) {
      (0, _beforeUnmount["default"])(this);
      (0, _initCcFrag["default"])(this, props);
      (0, _didMount["default"])(this);
      this.ctx.reactForceUpdate();
      return false;
    }

    return this.state !== nextState || isPropsChanged;
  } // componentDidUpdate(prevProps, prevState) {
  ;

  _proto.componentDidUpdate = function componentDidUpdate() {
    (0, _didUpdate["default"])(this);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    if (_React$Component.prototype.componentWillUnmount) _React$Component.prototype.componentWillUnmount.call(this);
    (0, _beforeUnmount["default"])(this);
  };

  _proto.render = function render() {
    //注意这里，一定要每次都取最新的绑在ctx上，确保交给renderProps的ctx参数里的state和props是最新的
    var thisProps = this.props;
    this.ctx.prevProps = this.ctx.props;
    this.ctx.props = (0, _getOutProps["default"])(thisProps);
    var children = thisProps.children,
        render = thisProps.render;
    var view = render || children;

    if (typeof view === 'function') {
      (0, _beforeRender["default"])(this);
      var __$$regDumb = thisProps.__$$regDumb,
          _thisProps$register = thisProps.register,
          register = _thisProps$register === void 0 ? {} : _thisProps$register;
      var ctx = this.ctx;

      if (__$$regDumb !== true && register.mapProps) {
        //直接使用<CcFragment />实例化
        ctx.mapped = register.mapProps(ctx) || {};
        return view(ctx.mapped) || nullSpan;
      }

      return view(ctx) || nullSpan;
    } else {
      if (React.isValidElement(view)) {
        //直接传递dom，无论state怎么改变都不会再次触发渲染
        throw new Error("CcFragment's children can not b a react dom ");
      }

      return view;
    }
  };

  return CcFragment;
}(React.Component);

var _default = CcFragment;
exports["default"] = _default;