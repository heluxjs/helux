"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = useConcent;

var _react = _interopRequireDefault(require("react"));

var _constant = require("../../support/constant");

var _privConstant = require("../../support/priv-constant");

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
    var newHookState = Object.assign({}, ccHookState, partialState);
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
  this.state = ccHookState;
  this.isFirstRendered = true;
  this.props = props;
} // rState: resolvedState, iState: initialState


function buildRef(curCursor, rState, iState, regOpt, ccHookState, hookSetState, props, ccClassKey) {
  // when single file demo in hmr mode trigger buildRef, rState is null
  var state = rState || (0, _util.evalState)(iState);
  var bindCtxToMethod = regOpt.bindCtxToMethod;
  var renderKeyClasses = regOpt.renderKeyClasses,
      module = regOpt.module,
      _regOpt$watchedKeys = regOpt.watchedKeys,
      watchedKeys = _regOpt$watchedKeys === void 0 ? '*' : _regOpt$watchedKeys,
      _regOpt$storedKeys = regOpt.storedKeys,
      storedKeys = _regOpt$storedKeys === void 0 ? [] : _regOpt$storedKeys,
      _regOpt$connect = regOpt.connect,
      connect = _regOpt$connect === void 0 ? {} : _regOpt$connect,
      setup = regOpt.setup,
      lite = regOpt.lite;
  incCursor();

  var _mapRegistrationInfo = (0, _mapRegistrationInfo2["default"])(module, ccClassKey, renderKeyClasses, _constant.CC_HOOK, watchedKeys, storedKeys, connect, true),
      _module = _mapRegistrationInfo._module,
      _watchedKeys = _mapRegistrationInfo._watchedKeys,
      _ccClassKey = _mapRegistrationInfo._ccClassKey,
      _connect = _mapRegistrationInfo._connect;

  var hookRef = new CcHook(ccHookState, hookSetState, props);
  var params = Object.assign({}, regOpt, {
    module: _module,
    watchedKeys: _watchedKeys,
    state: state,
    type: _constant.CC_HOOK,
    ccClassKey: _ccClassKey,
    connect: _connect,
    ccOption: props.ccOption
  });
  (0, _buildRefCtx["default"])(hookRef, params, lite);
  (0, _beforeMount["default"])(hookRef, setup, bindCtxToMethod);
  cursor_refKey_[curCursor] = hookRef.ctx.ccUniqueKey;
  var refCtx = hookRef.ctx; // rewrite useRef for CcHook

  refCtx.useRef = function useR(refName) {
    //give named function to avoid eslint error
    var ref = _react["default"].useRef(null);

    refCtx.refs[refName] = ref;
    return ref;
  };

  return hookRef;
}

var tip = 'react version is LTE 16.8'; //写为具名函数，防止react devtoo里显示.default

function useConcent(registerOption, ccClassKey) {
  var _registerOption = (0, _util.getRegisterOptions)(registerOption);

  var _registerOption$state = _registerOption.state,
      iState = _registerOption$state === void 0 ? {} : _registerOption$state,
      _registerOption$props = _registerOption.props,
      props = _registerOption$props === void 0 ? {} : _registerOption$props,
      mapProps = _registerOption.mapProps,
      _registerOption$layou = _registerOption.layoutEffect,
      layoutEffect = _registerOption$layou === void 0 ? false : _registerOption$layou,
      _registerOption$extra = _registerOption.extra,
      extra = _registerOption$extra === void 0 ? {} : _registerOption$extra;
  var reactUseState = _react["default"].useState;

  if (!reactUseState) {
    throw new Error(tip);
  }

  var cursor = getUsableCursor();

  var _reactUseState = reactUseState(cursor),
      curCursor = _reactUseState[0];

  var isFirstRendered = curCursor === cursor;
  var state = isFirstRendered ? (0, _util.evalState)(iState) : 0;

  var _reactUseState2 = reactUseState(state),
      ccHookState = _reactUseState2[0],
      hookSetState = _reactUseState2[1];

  var cref = function cref() {
    return buildRef(curCursor, state, iState, _registerOption, ccHookState, hookSetState, props, ccClassKey);
  };

  var hookRef;

  if (isFirstRendered) {
    hookRef = cref();
  } else {
    var refKey = cursor_refKey_[curCursor];
    hookRef = ccUkey_ref_[refKey];

    if (!hookRef && Date.now() - _ccContext["default"].info.latestStartupTime < 1000) {
      // single file demo in hot reload mode
      hookRef = cref();
    } else {
      var _refCtx = hookRef.ctx; // existing period, replace reactSetState and reactForceUpdate

      _refCtx.reactSetState = makeSetState(ccHookState, hookSetState);
      _refCtx.reactForceUpdate = makeForceUpdate(ccHookState, hookSetState);
    }
  }

  var refCtx = hookRef.ctx;
  refCtx.prevProps = refCtx.props;
  hookRef.props = refCtx.props = props; // keep shape same as class

  refCtx.extra = extra; // ???does user really need beforeMount,mounted,beforeUpdate,updated,beforeUnmount in setup???

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

    if (!(0, _util.isPJO)(mapped)) {
      throw new Error("mapProps ret " + _privConstant.NOT_A_JSON);
    }

    refCtx.mapped = mapped;
  }

  return refCtx;
}