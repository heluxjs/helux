"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _constant = require("../../support/constant");

var _util = require("../../support/util");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var getState = _ccContext["default"].store.getState;

function getValFromEvent(e) {
  var se = (0, _util.convertToStandardEvent)(e);

  if (se) {
    return se.currentTarget.value;
  } else {
    return e;
  }
}

var _default = function _default(spec, e, refModule, refState) {
  var _ref;

  var ccint = false,
      ccsync = '',
      ccrkey = '',
      value = '',
      extraState = undefined,
      ccdelay = -1,
      isToggleBool = false;
  var syncKey = spec[_constant.CCSYNC_KEY];
  var type = spec.type;

  if (syncKey !== undefined) {
    //来自sync生成的setter函数调用
    ccsync = syncKey;
    ccdelay = spec.delay;
    ccrkey = spec.rkey;

    if (type === 'val' || type === 'int') {
      //set value
      ccint = type === 'int'; //convert to int
      //优先从spec里取，取不到的话，从e里面分析并提取

      var val = spec.val;

      if (val === undefined) {
        value = getValFromEvent(e);
      } else {
        if (typeof val === 'function') {
          var keyPath, fullKeyPath, module;

          if (ccsync.includes('/')) {
            var _ccsync$split = ccsync.split('/'),
                _module = _ccsync$split[0],
                _keyPath = _ccsync$split[1];

            keyPath = _keyPath;
            fullKeyPath = ccsync;
            module = _module;
          } else {
            keyPath = ccsync;
            fullKeyPath = refModule + "/" + keyPath;
            module = refModule;
          }

          extraState = val(getValFromEvent(e), keyPath, {
            moduleState: getState(module),
            fullKeyPath: fullKeyPath,
            state: refState
          });
        } else {
          value = val;
        }
      }
    } else if (type === 'bool') {
      //toggle bool
      isToggleBool = true;
    } else return null;
  } else {
    //来自于sync直接调用 <input data-ccsync="foo/f1" onChange={this.sync} /> 
    var se = (0, _util.convertToStandardEvent)(e);

    if (se) {
      // e is event
      var currentTarget = se.currentTarget;
      value = currentTarget.value;
      var dataset = currentTarget.dataset;
      if (type === 'int') ccint = true;else ccint = dataset.ccint !== undefined;
      ccsync = dataset.ccsync;
      if (!ccsync) return null;
      ccrkey = dataset.ccrkey;
      var dataSetDelay = dataset.ccdelay;

      if (dataSetDelay) {
        try {
          ccdelay = parseInt(dataSetDelay);
        } catch (err) {}
      }
    } else {
      //<Input onChange={this.sync}/> is invalid
      return null;
    }
  }

  return _ref = {}, _ref[_constant.MOCKE_KEY] = 1, _ref.currentTarget = {
    value: value,
    extraState: extraState,
    dataset: {
      ccsync: ccsync,
      ccint: ccint,
      ccdelay: ccdelay,
      ccrkey: ccrkey
    }
  }, _ref.isToggleBool = isToggleBool, _ref;
};

exports["default"] = _default;