import dispatch from '../core/base/dispatch';

export default function (action, payLoadWhenActionIsString, rkOrOptions, delay, extra) {
  return dispatch(action, payLoadWhenActionIsString, rkOrOptions, delay, extra);
}