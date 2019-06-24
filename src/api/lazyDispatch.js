import dispatch from '../core/base/dispatch';

export default function (action, payLoadWhenActionIsString, delay, identity, option) {
  dispatch(true, action, payLoadWhenActionIsString, delay, identity, option);
}