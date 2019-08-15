import dispatch from '../core/base/dispatch';

export default function (action, payLoadWhenActionIsString, renderKey, delay, option) {
  dispatch(true, action, payLoadWhenActionIsString, renderKey, delay, option);
}