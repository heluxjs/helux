import * as ev from '../event';
import triggerSetupEffect from './trigger-setup-effect';
import setRef from '../ref/set-ref';
import resetWatchedKeys from '../ref/reset-watched-keys';

export default function (ref) {
  resetWatchedKeys(ref);

  ref.__$$isBF = false;
  ref.__$$isMounted = true;
  ref.__$$isUnmounted = false;
  const { module, isSingle, ccClassKey, ccKey, ccUniqueKey, onEvents } = ref.ctx;
  setRef(ref, isSingle, ccClassKey, ccKey, ccUniqueKey);

  onEvents.forEach(({ event, identity, handler }) => {
    ev.bindEventHandlerToCcContext(module, ccClassKey, ccUniqueKey, event, identity, handler);
  });

  triggerSetupEffect(ref, true);
}