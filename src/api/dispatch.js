import dispatch from '../core/base/dispatch';

export default function (action, payLoadWhenActionIsString, renderKey, delay, option) {
  return dispatch(false, action, payLoadWhenActionIsString, renderKey, delay, option);
}