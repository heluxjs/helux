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
    var registerOptions = getRegisterOptions(props.register);
    var module = registerOptions.module,
        renderKeyClasses = registerOptions.renderKeyClasses,
        tag = registerOptions.tag,
        lite = registerOptions.lite,
        _registerOptions$comp = registerOptions.compareProps,
        compareProps = _registerOptions$comp === void 0 ? true : _registerOptions$comp,
        setup = registerOptions.setup,
        bindCtxToMethod = registerOptions.bindCtxToMethod,
        _registerOptions$watc = registerOptions.watchedKeys,
        watchedKeys = _registerOptions$watc === void 0 ? '*' : _registerOptions$watc,
        _registerOptions$conn = registerOptions.connect,
        connect = _registerOptions$conn === void 0 ? {} : _registerOptions$conn,
        reducerModule = registerOptions.reducerModule,
        isSingle = registerOptions.isSingle,
        storedKeys = registerOptions.storedKeys;
    var state = registerOptions.state || {};

    if (typeof state === 'function') {
      state = state();
    }

    var ccClassKey = props.ccClassKey,
        ccKey = props.ccKey,
        _props$ccOption = props.ccOption,
        ccOption = _props$ccOption === void 0 ? {} : _props$ccOption;
    var target_storedKeys = storedKeys;
    var target_reducerModule = reducerModule;
    var target_watchedKeys = watchedKeys;
    var target_ccClassKey = ccClassKey;
    var target_connect = connect; //直接使用<CcFragment />构造的cc实例, 尝试提取storedKeys, 然后映射注册信息，（注：registerDumb已在外部注册过）

    if (props.__$$regDumb !== true) {
      var _storedKeys = (0, _getStoredKeys["default"])(state, moduleName_stateKeys_[module], ccOption.storedKeys, registerOptions.storedKeys);

      var _mapRegistrationInfo = (0, _mapRegistrationInfo2["default"])(module, ccClassKey, renderKeyClasses, _constant.CC_FRAGMENT_PREFIX, watchedKeys, _storedKeys, connect, reducerModule, true),
          _reducerModule = _mapRegistrationInfo._reducerModule,
          _watchedKeys = _mapRegistrationInfo._watchedKeys,
          _ccClassKey = _mapRegistrationInfo._ccClassKey,
          _connect = _mapRegistrationInfo._connect;

      target_storedKeys = _storedKeys;
      target_reducerModule = _reducerModule;
      target_watchedKeys = _watchedKeys;
      target_ccClassKey = _ccClassKey;
      target_connect = _connect;
    } //直接使用<CcFragment />构造的cc实例，把ccOption.storedKeys当作registerStoredKeys


    (0, _buildRefCtx["default"])((0, _assertThisInitialized2["default"])(_this), {
      isSingle: isSingle,
      ccKey: ccKey,
      connect: target_connect,
      state: state,
      module: module,
      reducerModule: target_reducerModule,
      storedKeys: target_storedKeys,
      watchedKeys: target_watchedKeys,
      tag: tag,
      ccClassKey: target_ccClassKey,
      ccOption: ccOption,
      type: _constant.CC_FRAGMENT_PREFIX
    }, lite);
    _this.__$$compareProps = compareProps; //对于concent来说，ctx在constructor里构造完成，此时就可以直接把ctx传递给beforeMount了，
    //无需在将要给废弃的componentWillMount里调用beforeMount

    (0, _beforeMount["default"])((0, _assertThisInitialized2["default"])(_this), setup, bindCtxToMethod);
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
    var thisProps = this.props;
    this.ctx.prevProps = this.ctx.props;
    this.ctx.props = (0, _getOutProps["default"])(thisProps);
    var children = thisProps.children,
        render = thisProps.render;
    var view = render || children;

    if (typeof view === 'function') {
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
      if (_react["default"].isValidElement(view)) {
        //直接传递dom，无论state怎么改变都不会再次触发渲染
        throw new Error("CcFragment's children can not b a react dom ");
      }

      return view;
    }
  };

  return CcFragment;
}(_react["default"].Component);

var _default = CcFragment;
exports["default"] = _default;