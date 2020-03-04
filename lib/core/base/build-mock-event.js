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

var _default = function _default(spec, e, refCtx) {
  var refModule = refCtx.module,
      refState = refCtx.state;
  var ccint = false,
      ccsync = '',
      ccrkey = '',
      value = '',
      extraState = null,
      ccdelay = -1,
      isToggleBool = false;
  var syncKey = spec[_constant.CCSYNC_KEY];
  var type = spec.type;
  var hasSyncCb = false;

  if (syncKey !== undefined) {
    //来自sync生成的setter函数调用 即 sync('xxxKey')
    ccsync = syncKey;
    ccdelay = spec.delay;
    ccrkey = spec.rkey; // type 'bool', 'val', 'int', 'as'

    ccint = type === 'int'; //convert to int

    isToggleBool = type === 'bool';
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
    } // 布尔值需要对原来的值取反


    var fullState = module !== refModule ? getState(module) : refState;
    value = type === 'bool' ? !(0, _util.getValueByKeyPath)(fullState, keyPath) : getValFromEvent(e); //优先从spec里取，取不到的话，从e里面分析并提取

    var val = spec.val;

    if (val === undefined) {// do nothing
    } else {
      if (typeof val === 'function') {
        var syncRet = val(value, keyPath, {
          moduleState: getState(module),
          fullKeyPath: fullKeyPath,
          state: refState,
          refCtx: refCtx
        });

        if (syncRet != undefined) {
          if (type === 'as') value = syncRet; // value is what cb returns;
          else {
              var retType = typeof syncRet;

              if (retType === 'boolean') {
                // if return true, let hasSyncCb = false, so this cb will not block state update, and cc will extract partial state automatically
                // if return false, let hasSyncCb = true, but now extraState is still null, so this cb will block state update
                hasSyncCb = !syncRet;
              } else if (retType === 'object') {
                hasSyncCb = true;
                extraState = syncRet;
              } else {
                (0, _util.justWarning)("syncKey[" + syncKey + "] cb result type error.");
              }
            }
        } else {
          if (type === 'as') hasSyncCb = true; // if syncAs return undefined, will block update
          // else continue update and value is just extracted above
        }
      } else {
        value = val;
      }
    }
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

  return {
    currentTarget: {
      value: value,
      extraState: extraState,
      hasSyncCb: hasSyncCb,
      dataset: {
        ccsync: ccsync,
        ccint: ccint,
        ccdelay: ccdelay,
        ccrkey: ccrkey
      }
    },
    isToggleBool: isToggleBool
  };
};

exports["default"] = _default;