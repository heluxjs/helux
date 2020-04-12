"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.useConcentForOb = useConcentForOb;
exports["default"] = void 0;

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

var hf = _interopRequireWildcard(require("../state/handler-factory"));

var _util = require("../../support/util");

var _beforeRender = _interopRequireDefault(require("../ref/before-render"));

var ccUKey_ref_ = _ccContext["default"].ccUKey_ref_;
var refCursor = 1;

function getUsableCursor() {
  return refCursor;
}

function incCursor() {
  refCursor = refCursor + 1;
}

function CcHook(state, hookSetter, props) {
  //new CcHook时，这里锁定的hookSetter就是后面一直可以用的setter
  //如果存在期一直替换hookSetter，反倒会造成打开react-dev-tool，点击面板里的dom后，视图便不再更新的bug
  this.setState = hookSetter;
  this.forceUpdate = hookSetter;
  this.state = state;
  this.isFirstRendered = true;
  this.props = props;
} // rState: resolvedState, iState: initialState


function buildRef(ref, insType, hookCtx, rState, iState, regOpt, hookState, hookSetter, props, extra, ccClassKey) {
  // when single file demo in hmr mode trigger buildRef, rState is 0 
  // so here call evalState again
  var state = rState || (0, _util.evalState)(iState);
  var bindCtxToMethod = regOpt.bindCtxToMethod;
  var renderKeyClasses = regOpt.renderKeyClasses,
      module = regOpt.module,
      _regOpt$watchedKeys = regOpt.watchedKeys,
      watchedKeys = _regOpt$watchedKeys === void 0 ? '-' : _regOpt$watchedKeys,
      _regOpt$storedKeys = regOpt.storedKeys,
      storedKeys = _regOpt$storedKeys === void 0 ? [] : _regOpt$storedKeys,
      _regOpt$connect = regOpt.connect,
      connect = _regOpt$connect === void 0 ? {} : _regOpt$connect,
      setup = regOpt.setup,
      lite = regOpt.lite;
  incCursor();

  var _mapRegistrationInfo = (0, _mapRegistrationInfo2["default"])(module, ccClassKey, renderKeyClasses, _constant.CC_HOOK, (0, _util.getPassToMapWaKeys)(watchedKeys), storedKeys, connect, true),
      _module = _mapRegistrationInfo._module,
      _ccClassKey = _mapRegistrationInfo._ccClassKey,
      _connect = _mapRegistrationInfo._connect;

  var hookRef = ref || new CcHook(hookState, hookSetter, props);
  var params = Object.assign({}, regOpt, {
    module: _module,
    watchedKeys: watchedKeys,
    state: state,
    type: _constant.CC_HOOK,
    insType: insType,
    ccClassKey: _ccClassKey,
    connect: _connect,
    ccOption: props.ccOption
  });
  hookRef.props = props; // keep shape same as class

  (0, _buildRefCtx["default"])(hookRef, params, lite); // in buildRefCtx cc will assign hookRef.props to ctx.prevProps

  hookRef.ctx.reactSetState = hf.makeRefSetState(hookRef);
  hookRef.ctx.reactForceUpdate = hf.makeRefForceUpdate(hookRef);
  var refCtx = hookRef.ctx;
  refCtx.props = props; // attach props to ctx

  refCtx.extra = extra; // attach extra before setup process

  (0, _beforeMount["default"])(hookRef, setup, bindCtxToMethod); // cursor_refKey_[cursor] = hookRef.ctx.ccUniqueKey;

  hookCtx.prevCcUKey = hookCtx.ccUKey;
  hookCtx.ccUKey = hookRef.ctx.ccUniqueKey; // rewrite useRef for CcHook

  refCtx.useRef = function useR(refName) {
    //give named function to avoid eslint error
    var ref = _react["default"].useRef(null);

    refCtx.refs[refName] = ref;
    return ref;
  };

  return hookRef;
}

function replaceSetter(ctx, hookSetter) {
  ctx.__boundSetState = hookSetter;
  ctx.__boundForceUpdate = hookSetter;
}

var tip = 'react version is LTE 16.8';

var connectToStr = function connectToStr(connect) {
  if (!connect) return '';else if (Array.isArray(connect)) return connect.join(',');else if (typeof connect === 'object') return JSON.stringify(connect);else return connect;
};

var isRegChanged = function isRegChanged(firstRegOpt, curRegOpt) {
  if (firstRegOpt.module !== curRegOpt.module) {
    return true;
  }

  if (connectToStr(firstRegOpt.connect) !== connectToStr(curRegOpt.connect)) {
    return true;
  }

  return false;
};

function _useConcent(registerOption, ccClassKey, insType) {
  var hookCtxContainer = _react["default"].useRef({
    prevCcUKey: null,
    ccUKey: null,
    regOpt: registerOption
  });

  var hookCtx = hookCtxContainer.current;

  var _registerOption = (0, _util.getRegisterOptions)(registerOption); // here not allow user pass extra as undefined, it will been given value {} implicitly if pass undefined!!!


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
      lockedCursor = _reactUseState[0];

  var isFirstRendered = lockedCursor === cursor;
  var state = isFirstRendered ? (0, _util.evalState)(iState) : 0;

  var _reactUseState2 = reactUseState(state),
      hookState = _reactUseState2[0],
      hookSetter = _reactUseState2[1];

  var cref = function cref(ref) {
    return buildRef(ref, insType, hookCtx, state, iState, _registerOption, hookState, hookSetter, props, extra, ccClassKey);
  };

  var hookRef; // 组件刚挂载 or 渲染过程中变化module或者connect的值，触发创建新ref

  if (isFirstRendered || isRegChanged(hookCtx.regOpt, registerOption)) {
    hookCtx.regOpt = registerOption;
    hookRef = cref();
  } else {
    hookRef = ccUKey_ref_[hookCtx.ccUKey];

    if (!hookRef) {
      // single file demo in hot reload mode
      hookRef = cref();
    } else {
      var _refCtx = hookRef.ctx;
      _refCtx.prevProps = _refCtx.props;
      hookRef.props = _refCtx.props = props;
      _refCtx.extra = extra;
    }
  }

  var refCtx = hookRef.ctx;
  var effectHandler = layoutEffect ? _react["default"].useLayoutEffect : _react["default"].useEffect; //after first render of a timing hookRef just created 

  effectHandler(function () {
    // // 正常情况走到这里应该是true，如果是false，则是热加载情况下的hook行为，此前已走了一次beforeUnmount
    // // 需要走重新初始化当前组件的整个流程，否则热加载时的setup等参数将无效，只是不需要再次创建ref
    // if (!hookRef.isFirstRendered) {
    //   cref(hookRef);
    // }
    // mock componentWillUnmount
    return function () {
      var targetCcUKey = hookCtx.prevCcUKey || hookCtx.ccUKey;
      var toUnmountRef = ccUKey_ref_[targetCcUKey];

      if (toUnmountRef) {
        hookCtx.prevCcUKey = null;
        (0, _beforeUnmount["default"])(toUnmountRef);
      }
    };
  }, [hookRef]); // 渲染过程中变化module或者connect的值，触发卸载前一刻的ref
  //after every render

  effectHandler(function () {
    replaceSetter(refCtx, hookSetter);

    if (!hookRef.isFirstRendered) {
      // mock componentDidUpdate
      (0, _didUpdate["default"])(hookRef);
    } else {
      // mock componentDidMount
      hookRef.isFirstRendered = false;
      (0, _didMount["default"])(hookRef);
    }
  });
  (0, _beforeRender["default"])(hookRef); // before every render

  if (mapProps) {
    var mapped = mapProps(refCtx);

    if (!(0, _util.isPJO)(mapped)) {
      throw new Error("mapProps ret " + _privConstant.NOT_A_JSON);
    }

    refCtx.mapped = mapped;
  }

  return refCtx;
}
/**
 * 仅供内部 component/Ob 调用
 */


function useConcentForOb(registerOption, ccClassKey) {
  // 只针对Ob组件实例化检查时，reg参数是否已变化
  return _useConcent(registerOption, ccClassKey, _constant.CC_OB);
} //写为具名函数，防止react-dev-tool里显示.default


function useConcent(registerOption, ccClassKey) {
  return _useConcent(registerOption, ccClassKey, _constant.CC_CUSTOMIZE);
}

var _default = useConcent;
exports["default"] = _default;