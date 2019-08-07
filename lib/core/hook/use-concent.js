"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _constant = require("../../support/constant");

var _buildRefCtx = _interopRequireDefault(require("../base/build-ref-ctx"));

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _mapRegistrationInfo2 = _interopRequireDefault(require("../base/map-registration-info"));

var _beforeMount = _interopRequireDefault(require("../base/before-mount"));

var _beforeUnmount = _interopRequireDefault(require("../base/before-unmount"));

var _triggerSetupEffect = _interopRequireDefault(require("../base/trigger-setup-effect"));

var _getStoredKeys = _interopRequireDefault(require("../base/get-stored-keys"));

var ccUkey_ref_ = _ccContext["default"].ccUkey_ref_,
    moduleName_stateKeys_ = _ccContext["default"].moduleName_stateKeys_;
var refCursor = 1;
var cursor_refKey_ = {};

function getUsableCursor() {
  return refCursor;
}

function incCursor() {
  refCursor = refCursor + 1;
}

var makeSetState = function makeSetState(ccHookState, hookSetState) {
  return function (partialState) {
    ccHookState.state = Object.assign({}, ccHookState.state, partialState);
    var newHookState = Object.assign({}, ccHookState);
    hookSetState(newHookState);
  };
};

var makeForceUpdate = function makeForceUpdate(ccHookState, hookSetState) {
  return function () {
    var newHookState = Object.assign({}, ccHookState);
    hookSetState(newHookState);
  };
};

function HookRef(ccHookState, hookSetState, props) {
  this.setState = makeSetState(ccHookState, hookSetState);
  this.forceUpdate = makeForceUpdate(ccHookState, hookSetState);
  this.__$$isUnmounted = false;
  this.state = ccHookState.state;
  this.isFirstRendered = true;
  this.props = props;
}

var _default = function _default(registerOption) {
  var _registerOption = registerOption;

  if (typeof registerOption === 'string') {
    _registerOption = {
      module: registerOption
    };
  }

  var _registerOption2 = _registerOption,
      module = _registerOption2.module,
      reducerModule = _registerOption2.reducerModule,
      _registerOption2$watc = _registerOption2.watchedKeys,
      watchedKeys = _registerOption2$watc === void 0 ? '*' : _registerOption2$watc,
      _registerOption2$stor = _registerOption2.storedKeys,
      storedKeys = _registerOption2$stor === void 0 ? [] : _registerOption2$stor,
      persistStoredKeys = _registerOption2.persistStoredKeys,
      ccClassKey = _registerOption2.ccClassKey,
      _registerOption2$conn = _registerOption2.connect,
      connect = _registerOption2$conn === void 0 ? {} : _registerOption2$conn,
      _registerOption2$stat = _registerOption2.state,
      state = _registerOption2$stat === void 0 ? {} : _registerOption2$stat,
      setup = _registerOption2.setup,
      bindCtxToMethod = _registerOption2.bindCtxToMethod,
      _registerOption2$prop = _registerOption2.props,
      props = _registerOption2$prop === void 0 ? {} : _registerOption2$prop,
      mapProps = _registerOption2.mapProps;
  var reactUseState = _react["default"].useState;

  if (!reactUseState) {
    throw new Error('make sure your react version is larger than or equal 16.8');
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
  var hookRef;

  if (isFirstRendered) {
    incCursor();

    var _mapRegistrationInfo = (0, _mapRegistrationInfo2["default"])(module, ccClassKey, _constant.CC_HOOK_PREFIX, watchedKeys, storedKeys, connect, reducerModule, true),
        _module = _mapRegistrationInfo._module,
        _reducerModule = _mapRegistrationInfo._reducerModule,
        _watchedKeys = _mapRegistrationInfo._watchedKeys,
        _ccClassKey = _mapRegistrationInfo._ccClassKey,
        _connect = _mapRegistrationInfo._connect;

    hookRef = new HookRef(ccHookState, hookSetState, props);
    var ccOption = props.ccOption || {
      persistStoredKeys: persistStoredKeys
    };

    var _storedKeys = (0, _getStoredKeys["default"])(state, moduleName_stateKeys_[_module], ccOption.storedKeys, storedKeys);

    var params = Object.assign({}, _registerOption, {
      module: _module,
      reducerModule: _reducerModule,
      watchedKeys: _watchedKeys,
      ccClassKey: _ccClassKey,
      connect: _connect,
      ccOption: ccOption,
      storedKeys: _storedKeys
    });
    (0, _buildRefCtx["default"])(hookRef, params);
    (0, _beforeMount["default"])(hookRef, setup, bindCtxToMethod);
    cursor_refKey_[nowCursor] = hookRef.ctx.ccUniqueKey;
  } else {
    var refKey = cursor_refKey_[nowCursor];
    hookRef = ccUkey_ref_[refKey];
    var _refCtx = hookRef.ctx; //existing period, replace reactSetState and reactForceUpdate

    _refCtx.reactSetState = makeSetState(ccHookState, hookSetState);
    _refCtx.reactForceUpdate = makeForceUpdate(ccHookState, hookSetState);
    _refCtx.props = props;
  } //for every render


  _react["default"].useEffect(function () {
    if (!hookRef.isFirstRendered) {
      // mock componentDidUpdate
      (0, _triggerSetupEffect["default"])(hookRef, false);
    }
  }); //for first render


  _react["default"].useEffect(function () {
    // mock componentDidMount
    hookRef.isFirstRendered = false;
    (0, _triggerSetupEffect["default"])(hookRef, true);
    return function () {
      (0, _beforeUnmount["default"])(hookRef);
    };
  }, []);

  var refCtx = hookRef.ctx;
  if (mapProps) refCtx.mappedProps = mapProps(refCtx);
  return refCtx;
};

exports["default"] = _default;