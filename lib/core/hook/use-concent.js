"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = useConcent;

var _react = _interopRequireDefault(require("react"));

var _constant = require("../../support/constant");

var _buildRefCtx = _interopRequireDefault(require("../ref/build-ref-ctx"));

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _mapRegistrationInfo2 = _interopRequireDefault(require("../base/map-registration-info"));

var _beforeMount = _interopRequireDefault(require("../base/before-mount"));

var _didMount = _interopRequireDefault(require("../base/did-mount"));

var _didUpdate = _interopRequireDefault(require("../base/did-update"));

var _beforeUnmount = _interopRequireDefault(require("../base/before-unmount"));

var _util = require("../../support/util");

var _setRef = _interopRequireDefault(require("../ref/set-ref"));

var ccUkey_ref_ = _ccContext["default"].ccUkey_ref_;
var refCursor = 1;
var cursor_refKey_ = {};

function getUsableCursor() {
  return refCursor;
}

function incCursor() {
  refCursor = refCursor + 1;
}

var makeSetState = function makeSetState(ccHookState, hookSetState) {
  return function (partialState, cb) {
    ccHookState.state = Object.assign({}, ccHookState.state, partialState);
    var newHookState = Object.assign({}, ccHookState);
    hookSetState(newHookState); // 和class setState(partialState, cb); 保持一致

    if (cb) cb(newHookState.state);
  };
};

var makeForceUpdate = function makeForceUpdate(ccHookState, hookSetState) {
  return function (cb) {
    var newHookState = Object.assign({}, ccHookState);
    hookSetState(newHookState);
    if (cb) cb(newHookState.state);
  };
};

function CcHook(ccHookState, hookSetState, props) {
  this.setState = makeSetState(ccHookState, hookSetState);
  this.forceUpdate = makeForceUpdate(ccHookState, hookSetState);
  this.state = ccHookState.state;
  this.isFirstRendered = true;
  this.props = props;
} //写为具名函数，防止react devtoo里显示.default


function useConcent(registerOption, ccClassKey) {
  var _registerOption = (0, _util.getRegisterOptions)(registerOption);

  var _registerOption$state = _registerOption.state,
      state = _registerOption$state === void 0 ? {} : _registerOption$state,
      _registerOption$props = _registerOption.props,
      props = _registerOption$props === void 0 ? {} : _registerOption$props,
      mapProps = _registerOption.mapProps,
      _registerOption$layou = _registerOption.layoutEffect,
      layoutEffect = _registerOption$layou === void 0 ? false : _registerOption$layou,
      _registerOption$extra = _registerOption.extra,
      extra = _registerOption$extra === void 0 ? {} : _registerOption$extra;
  var privState = state;

  if (typeof state === 'function') {
    privState = state();
    _registerOption.state = privState;
  }

  var reactUseState = _react["default"].useState;

  if (!reactUseState) {
    throw new Error('make sure your react version is LTE 16.8');
  }

  var cursor = getUsableCursor();

  var _reactUseState = reactUseState({
    cursor: cursor,
    state: state
  }),
      ccHookState = _reactUseState[0],
      hookSetState = _reactUseState[1];

  var nowCursor = ccHookState.cursor;
  var isFirstRendered = nowCursor === cursor;
  var bindCtxToMethod = _registerOption.bindCtxToMethod;
  var hookRef;

  if (isFirstRendered) {
    var renderKeyClasses = _registerOption.renderKeyClasses,
        module = _registerOption.module,
        reducerModule = _registerOption.reducerModule,
        _registerOption$watch = _registerOption.watchedKeys,
        watchedKeys = _registerOption$watch === void 0 ? '*' : _registerOption$watch,
        _registerOption$store = _registerOption.storedKeys,
        storedKeys = _registerOption$store === void 0 ? [] : _registerOption$store,
        _registerOption$conne = _registerOption.connect,
        connect = _registerOption$conne === void 0 ? {} : _registerOption$conne,
        setup = _registerOption.setup,
        lite = _registerOption.lite;
    incCursor();

    var _mapRegistrationInfo = (0, _mapRegistrationInfo2["default"])(module, ccClassKey, renderKeyClasses, _constant.CC_HOOK_PREFIX, watchedKeys, storedKeys, connect, reducerModule, true),
        _module = _mapRegistrationInfo._module,
        _reducerModule = _mapRegistrationInfo._reducerModule,
        _watchedKeys = _mapRegistrationInfo._watchedKeys,
        _ccClassKey = _mapRegistrationInfo._ccClassKey,
        _connect = _mapRegistrationInfo._connect;

    hookRef = new CcHook(ccHookState, hookSetState, props);
    var params = Object.assign({}, _registerOption, {
      module: _module,
      reducerModule: _reducerModule,
      watchedKeys: _watchedKeys,
      state: privState,
      type: _constant.CC_HOOK_PREFIX,
      ccClassKey: _ccClassKey,
      connect: _connect,
      ccOption: props.ccOption
    });
    (0, _buildRefCtx["default"])(hookRef, params, lite);
    (0, _beforeMount["default"])(hookRef, setup, bindCtxToMethod);
    cursor_refKey_[nowCursor] = hookRef.ctx.ccUniqueKey;
  } else {
    var refKey = cursor_refKey_[nowCursor];
    hookRef = ccUkey_ref_[refKey];
    var _refCtx = hookRef.ctx; // existing period, replace reactSetState and reactForceUpdate

    _refCtx.reactSetState = makeSetState(ccHookState, hookSetState);
    _refCtx.reactForceUpdate = makeForceUpdate(ccHookState, hookSetState);
  }

  var refCtx = hookRef.ctx;
  refCtx.prevProps = refCtx.props;
  refCtx.props = props;
  refCtx.extra = extra;
  hookRef.props = props; // ???does user really need beforeMount,mounted,beforeUpdate,updated,beforeUnmount in setup???

  var effectHandler = layoutEffect ? _react["default"].useLayoutEffect : _react["default"].useEffect; //after every render

  effectHandler(function () {
    if (!hookRef.isFirstRendered) {
      // mock componentDidUpdate
      (0, _didUpdate["default"])(hookRef);
    }
  }); //after first render

  effectHandler(function () {
    // mock componentDidMount
    // 正常情况走到这里应该是true，如果是false，则是热加载情况下的hook行为
    if (hookRef.isFirstRendered === false) {
      // 记录一下丢失的ref，因为上面不再会走buildRefCtx beforeMount流程
      var _hookRef$ctx = hookRef.ctx,
          isSingle = _hookRef$ctx.isSingle,
          _ccClassKey2 = _hookRef$ctx.ccClassKey,
          ccKey = _hookRef$ctx.ccKey,
          ccUniqueKey = _hookRef$ctx.ccUniqueKey;
      (0, _setRef["default"])(hookRef, isSingle, _ccClassKey2, ccKey, ccUniqueKey);
    } else {
      hookRef.isFirstRendered = false;
      (0, _didMount["default"])(hookRef);
    }

    return function () {
      // mock componentWillUnmount
      (0, _beforeUnmount["default"])(hookRef);
    };
  }, []); // before every render

  if (mapProps) {
    var mapped = mapProps(refCtx);

    if (!(0, _util.isPlainJsonObject)(mapped)) {
      throw new Error('mapProps must return an plain json object');
    }

    refCtx.mapped = mapped;
  }

  return refCtx;
}