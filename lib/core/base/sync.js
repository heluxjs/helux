"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _constant = require("../../support/constant");

var _buildMockEvent = _interopRequireDefault(require("./build-mock-event"));

var _extractStateByCcsync3 = _interopRequireDefault(require("../state/extract-state-by-ccsync"));

var _changeRefState = _interopRequireDefault(require("../state/change-ref-state"));

var getState = _ccContext["default"].store.getState;

function _default(spec, ref, e) {
  var refCtx = ref.ctx;
  var refModule = refCtx.module;
  var mockE = null;

  if (spec[_constant.MOCKE_KEY]) {
    mockE = spec;
  } else {
    //可能是来自$$sync生成的setter调用
    mockE = (0, _buildMockEvent["default"])(spec, e, refModule);
  }

  if (!mockE) return; //参数无效

  var currentTarget = mockE.currentTarget;
  var dataset = currentTarget.dataset,
      value = currentTarget.value,
      extraState = currentTarget.extraState;
  if (e && e.stopPropagation) e.stopPropagation();
  var ccsync = dataset.ccsync,
      ccint = dataset.ccint,
      ccdelay = dataset.ccdelay,
      ccrkey = dataset.ccrkey;

  if (ccsync.startsWith('/')) {
    dataset.ccsync = "" + refModule + ccsync; //附加上默认模块值
  }

  if (ccsync.includes('/')) {
    // syncModuleState 同步模块的state状态
    var targetModule = ccsync.split('/')[0];
    var ccKey = refCtx.ccKey,
        ccUniqueKey = refCtx.ccUniqueKey;

    if (extraState) {
      return (0, _changeRefState["default"])(extraState, {
        calledBy: _constant.SYNC,
        ccKey: ccKey,
        ccUniqueKey: ccUniqueKey,
        module: targetModule,
        delay: ccdelay,
        renderKey: ccrkey
      }, ref);
    }

    var fullState = targetModule !== refModule ? getState(targetModule) : ref.state;

    var _extractStateByCcsync = (0, _extractStateByCcsync3["default"])(ccsync, value, ccint, fullState, mockE.isToggleBool),
        state = _extractStateByCcsync.state;

    return (0, _changeRefState["default"])(state, {
      calledBy: _constant.SYNC,
      ccKey: ccKey,
      ccUniqueKey: ccUniqueKey,
      module: targetModule,
      delay: ccdelay,
      renderKey: ccrkey
    }, ref);
  } else {
    //调用自己的setState句柄触发更新，key可能属于local的，也可能属于module的
    if (extraState) {
      return ref.setState(extraState, null, ccdelay, ccrkey);
    }

    var _extractStateByCcsync2 = (0, _extractStateByCcsync3["default"])(ccsync, value, ccint, ref.state, mockE.isToggleBool),
        _state = _extractStateByCcsync2.state;

    return ref.setState(_state, null, ccdelay, ccrkey);
  }
}

;