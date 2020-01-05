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

var _getStoredKeys = _interopRequireDefault(require("../base/get-stored-keys"));

var _util = require("../../support/util");

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
  return function (partialState, cb) {
    ccHookState.state = Object.assign({}, ccHookState.state, partialState);
    var newHookState = Object.assign({}, ccHookState);
    hookSetState(newHookState); // 和class setState(partialState, cb); 保持一致

    if (cb) cb(newHookState);
  };
};

var makeForceUpdate = function makeForceUpdate(ccHookState, hookSetState) {
  return function (cb) {
    var newHookState = Object.assign({}, ccHookState);
    hookSetState(newHookState);
    if (cb) cb(newHookState);
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
      mapProps = _registerOption.mapProps;

  if (typeof state === 'function') {
    state = state();
    _registerOption.state = state;
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
  var hookRef;

  if (isFirstRendered) {
    var renderKeyClasses = _registerOption.renderKeyClasses,
        module = _registerOption.module,
        reducerModule = _registerOption.reducerModule,
        _registerOption$watch = _registerOption.watchedKeys,
        watchedKeys = _registerOption$watch === void 0 ? '*' : _registerOption$watch,
        _registerOption$store = _registerOption.storedKeys,
        storedKeys = _registerOption$store === void 0 ? [] : _registerOption$store,
        persistStoredKeys = _registerOption.persistStoredKeys,
        _registerOption$conne = _registerOption.connect,
        connect = _registerOption$conne === void 0 ? {} : _registerOption$conne,
        setup = _registerOption.setup,
        bindCtxToMethod = _registerOption.bindCtxToMethod,
        lite = _registerOption.lite;
    incCursor();

    var _mapRegistrationInfo = (0, _mapRegistrationInfo2["default"])(module, ccClassKey, renderKeyClasses, _constant.CC_HOOK_PREFIX, watchedKeys, storedKeys, connect, reducerModule, true),
        _module = _mapRegistrationInfo._module,
        _reducerModule = _mapRegistrationInfo._reducerModule,
        _watchedKeys = _mapRegistrationInfo._watchedKeys,
        _ccClassKey = _mapRegistrationInfo._ccClassKey,
        _connect = _mapRegistrationInfo._connect;

    hookRef = new CcHook(ccHookState, hookSetState, props);
    var ccOption = props.ccOption || {
      persistStoredKeys: persistStoredKeys
    };

    var _storedKeys = (0, _getStoredKeys["default"])(state, moduleName_stateKeys_[_module], ccOption.storedKeys, storedKeys);

    var params = Object.assign({}, _registerOption, {
      module: _module,
      reducerModule: _reducerModule,
      watchedKeys: _watchedKeys,
      type: _constant.CC_HOOK_PREFIX,
      ccClassKey: _ccClassKey,
      connect: _connect,
      ccOption: ccOption,
      storedKeys: _storedKeys
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
  hookRef.props = props; // ???does user really need beforeMount,mounted,beforeUpdate,updated,beforeUnmount in setup???
  //after every render

  _react["default"].useEffect(function () {
    if (!hookRef.isFirstRendered) {
      // mock componentDidUpdate
      (0, _didUpdate["default"])(hookRef);
    }
  }); //after first render


  _react["default"].useEffect(function () {
    // mock componentDidMount
    hookRef.isFirstRendered = false;
    (0, _didMount["default"])(hookRef);
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