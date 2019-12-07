"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = register;

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _react = _interopRequireDefault(require("react"));

var _constant = require("../../support/constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var util = _interopRequireWildcard(require("../../support/util"));

var _catchCcError = _interopRequireDefault(require("./catch-cc-error"));

var hf = _interopRequireWildcard(require("../state/handler-factory"));

var _mapRegistrationInfo2 = _interopRequireDefault(require("./map-registration-info"));

var _buildRefCtx = _interopRequireDefault(require("../ref/build-ref-ctx"));

var _beforeMount = _interopRequireDefault(require("./before-mount"));

var _didMount = _interopRequireDefault(require("./did-mount"));

var _didUpdate = _interopRequireDefault(require("./did-update"));

var _beforeUnmount = _interopRequireDefault(require("./before-unmount"));

var _getStoredKeys = _interopRequireDefault(require("./get-stored-keys"));

// import hoistNonReactStatic from 'hoist-non-react-statics';
var moduleName_stateKeys_ = _ccContext["default"].moduleName_stateKeys_;
var ccClassDisplayName = util.ccClassDisplayName,
    styleStr = util.styleStr,
    color = util.color,
    verboseInfo = util.verboseInfo,
    makeError = util.makeError,
    okeys = util.okeys,
    shallowDiffers = util.shallowDiffers;
var cl = color;
var ss = styleStr;
var me = makeError;
var vbi = verboseInfo;

var setupErr = function setupErr(info) {
  return new Error('can not defined setup both in register options and class body ' + '--verbose:' + info);
};

function register(_temp, ccClassKey) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$module = _ref.module,
      module = _ref$module === void 0 ? _constant.MODULE_DEFAULT : _ref$module,
      _ref$watchedKeys = _ref.watchedKeys,
      inputWatchedKeys = _ref$watchedKeys === void 0 ? '*' : _ref$watchedKeys,
      _ref$storedKeys = _ref.storedKeys,
      inputStoredKeys = _ref$storedKeys === void 0 ? [] : _ref$storedKeys,
      _ref$setup = _ref.setup,
      setup = _ref$setup === void 0 ? null : _ref$setup,
      persistStoredKeys = _ref.persistStoredKeys,
      _ref$connect = _ref.connect,
      connect = _ref$connect === void 0 ? {} : _ref$connect,
      _ref$tag = _ref.tag,
      tag = _ref$tag === void 0 ? '' : _ref$tag,
      lite = _ref.lite,
      reducerModule = _ref.reducerModule,
      _ref$isPropsProxy = _ref.isPropsProxy,
      isPropsProxy = _ref$isPropsProxy === void 0 ? false : _ref$isPropsProxy,
      _ref$isSingle = _ref.isSingle,
      isSingle = _ref$isSingle === void 0 ? false : _ref$isSingle,
      renderKeyClasses = _ref.renderKeyClasses,
      _ref$__checkStartUp = _ref.__checkStartUp,
      __checkStartUp = _ref$__checkStartUp === void 0 ? true : _ref$__checkStartUp,
      _ref$compareProps = _ref.compareProps,
      compareProps = _ref$compareProps === void 0 ? true : _ref$compareProps,
      __calledBy = _ref.__calledBy;

  if (ccClassKey === void 0) {
    ccClassKey = '';
  }

  try {
    var _mapRegistrationInfo = (0, _mapRegistrationInfo2["default"])(module, ccClassKey, renderKeyClasses, _constant.CC_CLASS_PREFIX, inputWatchedKeys, inputStoredKeys, connect, reducerModule, __checkStartUp, __calledBy),
        _module = _mapRegistrationInfo._module,
        _reducerModule = _mapRegistrationInfo._reducerModule,
        _watchedKeys = _mapRegistrationInfo._watchedKeys,
        _ccClassKey = _mapRegistrationInfo._ccClassKey,
        _connect = _mapRegistrationInfo._connect;

    return function (ReactClass) {
      if (ReactClass.prototype && ReactClass.prototype.$$attach) {
        throw me(_constant.ERR.CC_REGISTER_A_CC_CLASS, vbi("CcClass can not been registered!"));
      } // const isClsPureComponent = ReactClass.prototype.isPureReactComponent;


      var ToBeExtendedClass = isPropsProxy === false ? ReactClass : _react["default"].Component;
      var staticSetup = ToBeExtendedClass.$$setup;

      var _CcClass =
      /*#__PURE__*/
      function (_ToBeExtendedClass) {
        (0, _inheritsLoose2["default"])(CcClass, _ToBeExtendedClass);

        function CcClass(props, context) {
          var _this;

          try {
            _this = _ToBeExtendedClass.call(this, props, context) || this;
            _this.state = _this.state || {};
            _this.$$attach = _this.$$attach.bind((0, _assertThisInitialized2["default"])(_this));
            var ccOption = props.ccOption || {
              persistStoredKeys: persistStoredKeys
            };
            var declaredState = _this.state;

            var _storedKeys = (0, _getStoredKeys["default"])(declaredState, moduleName_stateKeys_[_module], ccOption.storedKeys, inputStoredKeys);

            var params = Object.assign({}, props, {
              isSingle: isSingle,
              module: _module,
              reducerModule: _reducerModule,
              tag: tag,
              state: declaredState,
              type: _constant.CC_CLASS_PREFIX,
              watchedKeys: _watchedKeys,
              ccClassKey: _ccClassKey,
              connect: _connect,
              storedKeys: _storedKeys,
              ccOption: ccOption
            });
            (0, _buildRefCtx["default"])((0, _assertThisInitialized2["default"])(_this), params, lite);

            if (setup && (_this.$$setup || staticSetup)) {
              throw setupErr('ccUniqueKey ' + _this.ctx.ccUniqueKey);
            }

            if (_this.$$setup) _this.$$setup = _this.$$setup.bind((0, _assertThisInitialized2["default"])(_this));
            (0, _beforeMount["default"])((0, _assertThisInitialized2["default"])(_this), setup || _this.$$setup || staticSetup, false);
          } catch (err) {
            (0, _catchCcError["default"])(err);
          }

          return _this;
        } // 如果代理组件或者继承组件没有没有实现scu，则同时比较nextState nextProps
        // 因为nextProps不同也会导致重渲染，所以需要约束用户不要把可变数据从props传下来，以提高性能


        var _proto = CcClass.prototype;

        _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
          var childRef = this.ctx.childRef;

          if (childRef && childRef.shouldComponentUpdate) {
            return childRef.shouldComponentUpdate(nextProps, nextState);
          } else if (_ToBeExtendedClass.prototype.shouldComponentUpdate) {
            return _ToBeExtendedClass.prototype.shouldComponentUpdate.call(this, nextProps, nextState);
          }

          var isPropsChanged = compareProps ? shallowDiffers(this.props, nextProps) : false;
          return this.state !== nextState || isPropsChanged;
        } //!!! 存在多重装饰器时, 或者用户想使用this.props.***来用concent类时
        //!!! 必需在类的【constructor】 里调用 this.props.$$attach(this),紧接着state定义之后
        ;

        _proto.$$attach = function $$attach(childRef) {
          var ctx = this.ctx;
          ctx.childRef = childRef;
          childRef.ctx = ctx;
          ctx.reactSetState = childRef.setState.bind(childRef);
          ;
          ctx.reactForceUpdate = childRef.forceUpdate.bind(childRef); // 让孩子引用的setState forceUpdate 指向父容器事先构造好的setState forceUpdate

          childRef.setState = ctx.setState;
          childRef.forceUpdate = ctx.forceUpdate; //替换掉ctx.__$$ccSetState ctx.__$$ccForceUpdate, 让changeRefState正确的更新目标实例

          ctx.__$$ccSetState = hf.makeCcSetStateHandler(childRef, this);
          ctx.__$$ccForceUpdate = hf.makeCcForceUpdateHandler(childRef);
          var childRefState = childRef.state;
          var thisState = this.state;
          if (!childRefState) childRefState = childRef.state = {};
          var newState = Object.assign({}, childRefState, thisState);
          childRef.state = newState; //在childRef进入首次render流程前，提前赋值

          ctx.state = newState; //避免提示 Warning: Expected {Component} state to match memoized state before componentDidMount
          // this.state = newState; // bad writing

          okeys(newState).forEach(function (key) {
            return thisState[key] = newState[key];
          });
          if (childRef.$$setup) childRef.$$setup = childRef.$$setup.bind(childRef);
          if (setup && (childRef.$$setup || staticSetup)) throw setupErr('ccUniqueKey ' + ctx.ccUniqueKey);
          (0, _beforeMount["default"])(childRef, setup || childRef.$$setup || staticSetup, false);
        };

        _proto.componentDidMount = function componentDidMount() {
          if (_ToBeExtendedClass.prototype.componentDidMount) _ToBeExtendedClass.prototype.componentDidMount.call(this);
          (0, _didMount["default"])(this); // 代理模式不再强制检查$$attach是否给调用
          // if (isPropsProxy === true && !this.ctx.childRef) {
          //   throw new Error('you forgot to call this.props.$$attach(this) in constructor, you must call it after state assign expression next line!');
          // }
        };

        _proto.componentDidUpdate = function componentDidUpdate() {
          if (_ToBeExtendedClass.prototype.componentDidUpdate) _ToBeExtendedClass.prototype.componentDidUpdate.call(this);
          (0, _didUpdate["default"])(this);
        };

        _proto.componentWillUnmount = function componentWillUnmount() {
          if (_ToBeExtendedClass.prototype.componentWillUnmount) _ToBeExtendedClass.prototype.componentWillUnmount.call(this);
          (0, _beforeUnmount["default"])(this);
        };

        _proto.render = function render() {
          this.ctx.prevProps = this.ctx.props;
          this.ctx.props = this.props;

          if (_ccContext["default"].isDebug) {
            console.log(ss("@@@ render " + ccClassDisplayName(_ccClassKey)), cl());
          }

          if (isPropsProxy === false) {
            //now cc class extends ReactClass, call super.render()
            return _ToBeExtendedClass.prototype.render.call(this);
          } else {
            //将$$attach传递下去，让用户在构造器里紧接着super之后调this.props.$$attach()
            return _react["default"].createElement(ReactClass, {
              ctx: this.ctx,
              $$attach: this.$$attach
            });
          }
        };

        return CcClass;
      }(ToBeExtendedClass);

      if (_ccClassKey === _constant.CC_DISPATCHER) _CcClass.displayName = 'CcDispatcher';else _CcClass.displayName = ccClassDisplayName(_ccClassKey);
      return _CcClass;
    };
  } catch (err) {
    (0, _catchCcError["default"])(err);
  }
}