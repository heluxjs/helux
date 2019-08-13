import dispatch from '../core/base/dispatch';

export default function (action, payLoadWhenActionIsString, delay, renderKey, option) {
  dispatch(true, action, payLoadWhenActionIsString, delay, renderKey, option);
}