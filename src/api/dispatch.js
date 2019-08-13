import dispatch from '../core/base/dispatch';

export default function (action, payLoadWhenActionIsString, delay, renderKey, option) {
  return dispatch(false, action, payLoadWhenActionIsString, delay, renderKey, option);
}