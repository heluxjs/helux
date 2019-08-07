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

var _triggerSetupEffect = _interopRequireDefault(require("../core/base/trigger-setup-effect"));

var _beforeUnmount = _interopRequireDefault(require("../core/base/before-unmount"));

var _beforeMount = _interopRequireDefault(require("../core/base/before-mount"));

var _buildRefCtx = _interopRequireDefault(require("../core/base/build-ref-ctx"));

var _getOutProps = _interopRequireDefault(require("../core/base/get-out-props"));

var _getStoredKeys = _interopRequireDefault(require("../core/base/get-stored-keys"));

var _ccContext = _interopRequireDefault(require("../cc-context"));

var shallowDiffers = util.shallowDiffers;
var moduleName_stateKeys_ = _ccContext["default"].moduleName_stateKeys_;

var CcFragment =
/*#__PURE__*/
function (_React$Component) {
  (0, _inheritsLoose2["default"])(CcFragment, _React$Component);

  function CcFragment(props, context) {
    var _this;

    _this = _React$Component.call(this, props, context) || this; // 非registerDumb调用，即直接使用<CcFragment />做初始化， 把组件的注册信息映射到ccContext

    if (props.__$$regDumb !== true) {
      var _props$module = props.module,
          module = _props$module === void 0 ? _constant.MODULE_DEFAULT : _props$module,
          propsCcClassKey = props.ccClassKey,
          ccKey = props.ccKey,
          ccTag = props.ccTag,
          _props$watchedKeys = props.watchedKeys,
          watchedKeys = _props$watchedKeys === void 0 ? '*' : _props$watchedKeys,
          _props$ccOption = props.ccOption,
          ccOption = _props$ccOption === void 0 ? {} : _props$ccOption,
          _props$connect = props.connect,
          connect = _props$connect === void 0 ? {} : _props$connect,
          reducerModule = props.reducerModule,
          _props$state = props.state,
          state = _props$state === void 0 ? {} : _props$state,
          isSingle = props.isSingle;

      var _mapRegistrationInfo = (0, _mapRegistrationInfo2["default"])(module, propsCcClassKey, _constant.CC_FRAGMENT_PREFIX, watchedKeys, ccOption, connect, reducerModule, true),
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
        tag: ccTag,
        ccClassKey: _ccClassKey,
        ccOption: ccOption
      });
    } else {
      var outProps = (0, _getOutProps["default"])(props);

      var _ccOption = outProps.ccOption || props.ccOption;

      var _storedKeys = (0, _getStoredKeys["default"])(props.state, moduleName_stateKeys_[props.module], _ccOption.storedKeys, props.storedKeys);

      var params = Object.assign(props, {
        storedKeys: _storedKeys,
        ccOption: _ccOption
      });
      (0, _buildRefCtx["default"])((0, _assertThisInitialized2["default"])(_this), params);
    }

    _this.setState = _this.ctx.setState;
    _this.forceUpdate = _this.ctx.forceUpdate;
    (0, _beforeMount["default"])((0, _assertThisInitialized2["default"])(_this), props.setup, props.bindCtxToMethod);
    return _this;
  }

  var _proto = CcFragment.prototype;

  _proto.componentDidMount = function componentDidMount() {
    (0, _triggerSetupEffect["default"])(this, true);
  };

  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    return this.state !== nextState || shallowDiffers((0, _getOutProps["default"])(nextProps), (0, _getOutProps["default"])(this.props));
  };

  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState) {
    //注意这里，一定要每次都取最新的绑在ctx上，确保交给renderProps的ctx参数里的state和props是最新的
    this.ctx.props = (0, _getOutProps["default"])(nextProps);
    this.ctx.state = nextState;
  } // componentDidUpdate(prevProps, prevState) {
  ;

  _proto.componentDidUpdate = function componentDidUpdate() {
    (0, _triggerSetupEffect["default"])(this); //!!! 将最新的state记录为prevState，方便下一轮渲染完毕执行triggerSetupEffect时做比较用

    this.ctx.prevState = this.state; // this.ctx.prevProps = this.ctx.props;
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    (0, _beforeUnmount["default"])(this);
    if (_React$Component.prototype.componentWillUnmount) _React$Component.prototype.componentWillUnmount.call(this);
  };

  _proto.render = function render() {
    var _this$props = this.props,
        children = _this$props.children,
        render = _this$props.render;
    var view = render || children;

    if (typeof view === 'function') {
      // return view(this.ctx) || React.createElement(Fragment);
      return view(this.ctx) || _react["default"].createElement('span', {
        style: {
          display: 'none'
        }
      });
    } else {
      if (_react["default"].isValidElement(view)) {
        util.justWarning("you are trying to specify a react dom to be CcFragment's children, it will never been rendered again no matter how your state changed!!!");
      }

      return view;
    }
  };

  return CcFragment;
}(_react["default"].Component);

exports["default"] = CcFragment;