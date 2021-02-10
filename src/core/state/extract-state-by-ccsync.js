import * as util from '../../support/util';

function setValue(obj, keys, lastKeyIndex, keyIndex, value, isToggleBool = false) {
  const key = keys[keyIndex];
  let oriVal = obj[key];

  if (lastKeyIndex === keyIndex) {
    if (isToggleBool === true) {
      if (typeof oriVal !== 'boolean') {
        util.justWarning(`key[${key}]'s value type is not boolean`);
      } else {
        obj[key] = !oriVal;
      }
    } else {
      obj[key] = value;
    }
  } else {
    let newVal = util.shallowCopy(oriVal);
    obj[key] = newVal;
    setValue(newVal, keys, lastKeyIndex, ++keyIndex, value, isToggleBool)
  }
}

export default (ccsync, value, ccint, oriState, isToggleBool, refModule) => {
  let _value = value;
  if (ccint === true) {
    _value = parseInt(value);
    // strict?
    if (Number.isNaN(_value)) {
      util.justWarning(`${value} can not convert to int but you set ccint as true!！`);
      _value = value;
    }
  }

  let module = refModule, keys = [];
  if (ccsync.includes('/')) {
    const [_module, keyOrKeyPath] = ccsync.split('/');
    module = _module;
    if (keyOrKeyPath.includes('.')) {
      keys = keyOrKeyPath.split('.');
    } else {
      keys = [keyOrKeyPath];
    }
  } else if (ccsync.includes('.')) {
    keys = ccsync.split('.');
  } else {
    keys = [ccsync];
  }
  const keyPath = keys.join('.');

  if (keys.length === 1) {
    const targetStateKey = keys[0];
    if (isToggleBool === true) {
      return { module, keys, keyPath, state: { [targetStateKey]: !oriState[targetStateKey] } };
    } else {
      return { module, keys, keyPath, state: { [targetStateKey]: _value } };
    }
  } else {
    const [key, ...restKeys] = keys;
    const subState = util.shallowCopy(oriState[key]);

    setValue(subState, restKeys, restKeys.length - 1, 0, _value, isToggleBool);
    return { module, keys, keyPath, state: { [key]: subState } }
  }
}
