"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = void 0;

var util = _interopRequireWildcard(require("../../support/util"));

function setValue(obj, keys, lastKeyIndex, keyIndex, value, isToggleBool) {
  if (isToggleBool === void 0) {
    isToggleBool = false;
  }

  var key = keys[keyIndex];

  if (lastKeyIndex === keyIndex) {
    if (isToggleBool === true) {
      var oriVal = obj[key];

      if (typeof oriVal !== 'boolean') {
        util.justWarning("key[" + key + "]'s value type is not boolean");
      } else {
        obj[key] = !oriVal;
      }
    } else {
      obj[key] = value;
    }
  } else {
    setValue(obj[key], keys, lastKeyIndex, ++keyIndex, value, isToggleBool);
  }
}

var _default = function _default(ccsync, value, ccint, oriState, isToggleBool) {
  var _value = value;

  if (ccint === true) {
    _value = parseInt(value); //strict?

    if (Number.isNaN(_value)) {
      util.justWarning(value + " can not convert to int but you set ccint as true!\uFF01");
      _value = value;
    }
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
    var targetStateKey = keys[0];

    if (isToggleBool === true) {
      var _state;

      return {
        module: module,
        state: (_state = {}, _state[targetStateKey] = !oriState[targetStateKey], _state)
      };
    } else {
      var _state2;

      return {
        module: module,
        state: (_state2 = {}, _state2[targetStateKey] = _value, _state2)
      };
    }
  } else {
    var _state3;

    var _keys = keys,
        key = _keys[0],
        restKeys = _keys.slice(1);

    var subState = oriState[key];
    setValue(subState, restKeys, restKeys.length - 1, 0, _value, isToggleBool);
    return {
      module: module,
      state: (_state3 = {}, _state3[key] = subState, _state3)
    };
  }
};

exports["default"] = _default;