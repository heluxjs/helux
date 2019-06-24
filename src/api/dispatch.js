import dispatch from '../core/base/dispatch';

export default function (action, payLoadWhenActionIsString, delay, identity, option) {
  dispatch(false, action, payLoadWhenActionIsString, delay, identity, option);
}