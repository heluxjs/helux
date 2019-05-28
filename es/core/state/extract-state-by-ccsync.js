import ccContext from '../../cc-context';

function setValue(obj, keys, lastKeyIndex, keyIndex, value){
  const key = keys[keyIndex];
  if(lastKeyIndex === keyIndex ){
    obj[key] = value;
  }else{
    setValue(obj[key], keys, lastKeyIndex, ++keyIndex, value)
  }
}

export default (ccsync, value, ccint, defaultState) => {
  let _value = value;
  if (ccint !== undefined) {
    try {
      _value = parseInt(value);
    } catch (err) { }
  }
  
  let module = null, keys = [];
  if(ccsync.includes('/')){
    const [_module, restStr] = ccsync.split('/');
    module = _module;
    if(restStr.includes('.')){
      keys = restStr.split('.');
    }else{
      keys = [restStr];
    }
  }else if(ccsync.includes('.')){
    keys = ccsync.split('.');
  }else{
    keys = [ccsync];
  }

  if (keys.length == 1) {
    return { module, state: { [keys[0]]: _value } };
  } else {
    const [key, ...restKeys] = keys;
    let targetState;

    if (module) targetState = ccContext.store.getState(module);
    else targetState = defaultState;
    const subState = targetState[key];

    setValue(subState, restKeys, restKeys.length - 1, 0, _value);
    return { module, state: { [key]: subState } }
  }
}
