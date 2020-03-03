
export const CLEAR = Symbol('clear');

export default function (fn, newState, oldState, fnCtx) {
  let _needCompute = true;
  let _cachedRet = null;
  let _fn = fn;
  let _newState = newState;
  let _oldState = oldState;
  let _fnCtx = fnCtx

  return (cmd, newState, oldState, fnCtx) => {

    if (cmd === CLEAR) {// can only been called by cc
      _newState = newState;
      _oldState = oldState;
      _fnCtx = fnCtx;
      _needCompute = true;
      return;
    }

    if (_needCompute) {
      const ret = _fn(_newState, _oldState, _fnCtx);
      _cachedRet = ret;
      _needCompute = false;
    }

    return _cachedRet;
  }
}