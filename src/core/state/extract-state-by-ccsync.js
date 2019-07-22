import * as util from '../../support/util';

function setValue(obj, keys, lastKeyIndex, keyIndex, value, isToggleBool = false) {
  const key = keys[keyIndex];
  if (lastKeyIndex === keyIndex) {
    if (isToggleBool === true) {
      const oriVal = obj[key];
      if (typeof oriVal !== 'boolean') {
        util.justWarning(`key[${key}]'s value type is not boolean`);
      } else {
        obj[key] = !oriVal;
      }
    } else {
      obj[key] = value;
    }
  } else {
    setValue(obj[key], keys, lastKeyIndex, ++keyIndex, value, isToggleBool)
  }
}

export default (ccsync, value, ccint, oriState, isToggleBool) => {
  let _value = value;
  if (ccint === true) {
    _value = parseInt(value);
    //strict?
    if (Number.isNaN(_value)) {
      util.justWarning(`${value} can not convert to int but you set ccint as true!！`);
      _value = value;
    }
  }

  let module = null, keys = [];
  if (ccsync.includes('/')) {
    const [_module, restStr] = ccsync.split('/');
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

  if (keys.length === 1) {
    const targetStateKey = keys[0];
    if (isToggleBool === true) {
      return { module, state: { [targetStateKey]: !oriState[targetStateKey] } };
    } else {
      return { module, state: { [targetStateKey]: _value } };
    }
  } else {
    const [key, ...restKeys] = keys;
    const subState = oriState[key];

    setValue(subState, restKeys, restKeys.length - 1, 0, _value, isToggleBool);
    return { module, state: { [key]: subState } }
  }
}
