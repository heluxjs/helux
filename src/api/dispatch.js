import dispatch from '../core/base/dispatch';

export default function (action, maybePayload, rkOrOptions, delay, extra) {
  return dispatch(action, maybePayload, rkOrOptions, delay, extra);
}
