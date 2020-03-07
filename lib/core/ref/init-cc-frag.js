"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _constant = require("../../support/constant");

var _mapRegistrationInfo2 = _interopRequireDefault(require("../base/map-registration-info"));

var _beforeMount = _interopRequireDefault(require("../base/before-mount"));

var _buildRefCtx = _interopRequireDefault(require("../ref/build-ref-ctx"));

var hf = _interopRequireWildcard(require("../state/handler-factory"));

var util = _interopRequireWildcard(require("../../support/util"));

var getRegisterOptions = util.getRegisterOptions,
    evalState = util.evalState;

function _default(ref) {
  var props = ref.props;
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
      watchedKeys = _registerOptions$watc === void 0 ? '-' : _registerOptions$watc,
      _registerOptions$conn = registerOptions.connect,
      connect = _registerOptions$conn === void 0 ? {} : _registerOptions$conn,
      isSingle = registerOptions.isSingle,
      _registerOptions$stor = registerOptions.storedKeys,
      storedKeys = _registerOptions$stor === void 0 ? [] : _registerOptions$stor;
  var state = evalState(registerOptions.state);
  var ccClassKey = props.ccClassKey,
      ccKey = props.ccKey,
      _props$ccOption = props.ccOption,
      ccOption = _props$ccOption === void 0 ? {} : _props$ccOption;
  var target_watchedKeys = watchedKeys;
  var target_ccClassKey = ccClassKey;
  var target_connect = connect; //直接使用<CcFragment />构造的cc实例, 尝试提取storedKeys, 然后映射注册信息，（注：registerDumb创建的组件已在外部调用过mapRegistrationInfo）

  if (props.__$$regDumb !== true) {
    var _mapRegistrationInfo = (0, _mapRegistrationInfo2["default"])(module, ccClassKey, renderKeyClasses, _constant.CC_FRAGMENT, util.getPassToMapWaKeys(watchedKeys), storedKeys, connect, true),
        _ccClassKey = _mapRegistrationInfo._ccClassKey,
        _connect = _mapRegistrationInfo._connect;

    target_watchedKeys = watchedKeys;
    target_ccClassKey = _ccClassKey;
    target_connect = _connect;
  } //直接使用<CcFragment />构造的cc实例，把ccOption.storedKeys当作registerStoredKeys


  (0, _buildRefCtx["default"])(ref, {
    isSingle: isSingle,
    ccKey: ccKey,
    connect: target_connect,
    state: state,
    module: module,
    storedKeys: storedKeys,
    watchedKeys: target_watchedKeys,
    tag: tag,
    ccClassKey: target_ccClassKey,
    ccOption: ccOption,
    type: _constant.CC_FRAGMENT
  }, lite);
  ref.ctx.reactSetState = hf.makeRefSetState(ref);
  ref.ctx.reactForceUpdate = hf.makeRefForceUpdate(ref);
  ref.__$$compareProps = compareProps; //对于concent来说，ctx在constructor里构造完成，此时就可以直接把ctx传递给beforeMount了，
  //无需在将要给废弃的componentWillMount里调用beforeMount

  (0, _beforeMount["default"])(ref, setup, bindCtxToMethod);
}