"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _react = _interopRequireDefault(require("react"));

var _constant = require("../support/constant");

var util = _interopRequireWildcard(require("../support/util"));

var _mapRegistrationInfo2 = _interopRequireDefault(require("../core/base/map-registration-info"));

var _beforeUnmount = _interopRequireDefault(require("../core/base/before-unmount"));

var _beforeMount = _interopRequireDefault(require("../core/base/before-mount"));

var _didMount = _interopRequireDefault(require("../core/base/did-mount"));

var _didUpdate = _interopRequireDefault(require("../core/base/did-update"));

var _buildRefCtx = _interopRequireDefault(require("../core/ref/build-ref-ctx"));

var _getOutProps = _interopRequireDefault(require("../core/base/get-out-props"));

var _getStoredKeys = _interopRequireDefault(require("../core/base/get-stored-keys"));

var _ccContext = _interopRequireDefault(require("../cc-context"));

var shallowDiffers = util.shallowDiffers,
    getRegisterOptions = util.getRegisterOptions;
var moduleName_stateKeys_ = _ccContext["default"].moduleName_stateKeys_;

var nullSpan = _react["default"].createElement('span', {
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
    var registerOptions = getRegisterOptions(props.register); // 非registerDumb调用，即直接使用<CcFragment />做初始化， 把组件的注册信息映射到ccContext

    if (props.__$$regDumb !== true) {
      var module = registerOptions.module,
          renderKeyClasses = registerOptions.renderKeyClasses,
          tag = registerOptions.tag,
          lite = registerOptions.lite,
          _registerOptions$watc = registerOptions.watchedKeys,
          watchedKeys = _registerOptions$watc === void 0 ? '*' : _registerOptions$watc,
          _registerOptions$conn = registerOptions.connect,
          connect = _registerOptions$conn === void 0 ? {} : _registerOptions$conn,
          reducerModule = registerOptions.reducerModule,
          _registerOptions$stat = registerOptions.state,
          state = _registerOptions$stat === void 0 ? {} : _registerOptions$stat,
          isSingle = registerOptions.isSingle;
      var ccClassKey = props.ccClassKey,
          ccKey = props.ccKey,
          _props$ccOption = props.ccOption,
          ccOption = _props$ccOption === void 0 ? {} : _props$ccOption; //直接使用<CcFragment />构造的cc实例，把ccOption.storedKeys当作registerStoredKeys

      var _mapRegistrationInfo = (0, _mapRegistrationInfo2["default"])(module, ccClassKey, renderKeyClasses, _constant.CC_FRAGMENT_PREFIX, watchedKeys, ccOption.storedKeys, connect, reducerModule, true),
          _module = _mapRegistrationInfo._module,
          _reducerModule = _mapRegistrationInfo._reducerModule,
          _watchedKeys = _mapRegistrationInfo._watchedKeys,
          _ccClassKey = _mapRegistrationInfo._ccClassKey,
          _connect = _mapRegistrationInfo._connect;

      var storedKeys = (0, _getStoredKeys["default"])(state, moduleName_stateKeys_[_module], ccOption.storedKeys, []);
      (0, _buildRefCtx["default"])((0, _assertThisInitialized2["default"])(_this), {
        isSingle: isSingle,
        ccKey: ccKey,
        connect: _connect,
        state: state,
        module: _module,
        reducerModule: _reducerModule,
        storedKeys: storedKeys,
        watchedKeys: _watchedKeys,
        tag: tag,
        ccClassKey: _ccClassKey,
        ccOption: ccOption,
        type: _constant.CC_FRAGMENT_PREFIX
      }, lite);
    } else {
      var outProps = (0, _getOutProps["default"])(props);

      var _ccOption = outProps.ccOption || {};

      var _storedKeys = (0, _getStoredKeys["default"])(props.state, moduleName_stateKeys_[props.module], _ccOption.storedKeys, props.storedKeys);

      var params = Object.assign({}, props, {
        storedKeys: _storedKeys,
        ccOption: _ccOption,
        type: _constant.CC_FRAGMENT_PREFIX
      });
      (0, _buildRefCtx["default"])((0, _assertThisInitialized2["default"])(_this), params, props.lite);
    }

    _this.__$$compareProps = props.compareProps || true; //对于concent来说，ctx在constructor里构造完成，此时就可以直接把ctx传递给beforeMount了，
    //无需在将要给废弃的componentWillMount里调用beforeMount

    (0, _beforeMount["default"])((0, _assertThisInitialized2["default"])(_this), props.setup, props.bindCtxToMethod);
    return _this;
  }

  var _proto = CcFragment.prototype;

  _proto.componentDidMount = function componentDidMount() {
    (0, _didMount["default"])(this);
  };

  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    var isPropsChanged = this.__$$compareProps ? shallowDiffers((0, _getOutProps["default"])(nextProps), (0, _getOutProps["default"])(this.props)) : false;
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
    this.ctx.props = (0, _getOutProps["default"])(this.props);
    var _this$props = this.props,
        children = _this$props.children,
        render = _this$props.render;
    var view = render || children;

    if (typeof view === 'function') {
      var _this$props2 = this.props,
          __$$regDumb = _this$props2.__$$regDumb,
          mapProps = _this$props2.mapProps;
      var ctx = this.ctx;

      if (__$$regDumb !== true && mapProps) {
        //直接使用<CcFragment />实例化
        ctx.mapped = mapProps(ctx);
        return view(ctx.mapped) || nullSpan;
      } else {
        return view(ctx) || nullSpan;
      }
    } else {
      if (_react["default"].isValidElement(view)) {
        //直接传递dom，无论state怎么改变都不会再次触发渲染
        throw new Error("CcFragment's children can not b a react dom ");
      }

      return view;
    }
  };

  return CcFragment;
}(_react["default"].Component);

exports["default"] = CcFragment;