"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

function setValue(obj, keys, lastKeyIndex, keyIndex, value) {
  var key = keys[keyIndex];

  if (lastKeyIndex === keyIndex) {
    obj[key] = value;
  } else {
    setValue(obj[key], keys, lastKeyIndex, ++keyIndex, value);
  }
}

var _default = function _default(ccsync, value, ccint, defaultState) {
  var _value = value;

  if (ccint === true) {
    try {
      _value = parseInt(value);
    } catch (err) {}
  }

  var module = null,
      keys = [];

  if (ccsync.includes('/')) {
    var _ccsync$split = ccsync.split('/'),
        _module = _ccsync$split[0],
        restStr = _ccsync$split[1];

    module = _module;

    if (restStr.includes('.')) {
      keys = restStr.split('.');
    } else {
      keys = [restStr];
    }
  } else if (ccsync.includes('.')) {
    keys = ccsync.split('.');
  } else {
    keys = [ccsync];
  }

  if (keys.length == 1) {
    var _state;

    return {
      module: module,
      state: (_state = {}, _state[keys[0]] = _value, _state)
    };
  } else {
    var _state2;

    var _keys = keys,
        key = _keys[0],
        restKeys = _keys.slice(1);

    var targetState;
    if (module) targetState = _ccContext["default"].store.getState(module);else targetState = defaultState;
    var subState = targetState[key];
    setValue(subState, restKeys, restKeys.length - 1, 0, _value);
    return {
      module: module,
      state: (_state2 = {}, _state2[key] = subState, _state2)
    };
  }
};

exports["default"] = _default;