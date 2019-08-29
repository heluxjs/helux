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


function useConcent(registerOption) {
  var _registerOption = registerOption;

  if (typeof registerOption === 'string') {
    _registerOption = {
      module: registerOption
    };
  }

  var _registerOption2 = _registerOption,
      _registerOption2$stat = _registerOption2.state,
      state = _registerOption2$stat === void 0 ? {} : _registerOption2$stat,
      _registerOption2$prop = _registerOption2.props,
      props = _registerOption2$prop === void 0 ? {} : _registerOption2$prop,
      mapProps = _registerOption2.mapProps;
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
    var _registerOption3 = _registerOption,
        ccClassKey = _registerOption3.ccClassKey,
        renderKeyClasses = _registerOption3.renderKeyClasses,
        module = _registerOption3.module,
        reducerModule = _registerOption3.reducerModule,
        _registerOption3$watc = _registerOption3.watchedKeys,
        watchedKeys = _registerOption3$watc === void 0 ? '*' : _registerOption3$watc,
        _registerOption3$stor = _registerOption3.storedKeys,
        storedKeys = _registerOption3$stor === void 0 ? [] : _registerOption3$stor,
        persistStoredKeys = _registerOption3.persistStoredKeys,
        _registerOption3$conn = _registerOption3.connect,
        connect = _registerOption3$conn === void 0 ? {} : _registerOption3$conn,
        setup = _registerOption3.setup,
        bindCtxToMethod = _registerOption3.bindCtxToMethod,
        lite = _registerOption3.lite;
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
      storedKeys: _storedKeys,
      lite: lite
    });
    (0, _buildRefCtx["default"])(hookRef, params, lite);
    (0, _beforeMount["default"])(hookRef, setup, bindCtxToMethod);
    cursor_refKey_[nowCursor] = hookRef.ctx.ccUniqueKey;
  } else {
    var refKey = cursor_refKey_[nowCursor];
    hookRef = ccUkey_ref_[refKey];
    var _refCtx = hookRef.ctx; //existing period, replace reactSetState and reactForceUpdate

    _refCtx.reactSetState = makeSetState(ccHookState, hookSetState);
    _refCtx.reactForceUpdate = makeForceUpdate(ccHookState, hookSetState);
  }

  var refCtx = hookRef.ctx;
  refCtx.props = props; // ???does user really need beforeMount,mounted,beforeUpdate,updated,beforeUnmount in setup???
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
    refCtx.mapped = mapProps(refCtx);
  }

  return refCtx;
}