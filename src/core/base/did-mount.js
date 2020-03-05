import * as ev from '../event';
import triggerSetupEffect from './trigger-setup-effect';
import setRef from '../ref/set-ref';

export default function (ref) {
  ref.__$$isBF = false;
  ref.__$$isMounted = true;
  const { module, isSingle, ccClassKey, ccKey, ccUniqueKey, onEvents } = ref.ctx;
  setRef(ref, isSingle, ccClassKey, ccKey, ccUniqueKey);

  onEvents.forEach(({ event, identity, handler }) => {
    ev.bindEventHandlerToCcContext(module, ccClassKey, ccUniqueKey, event, identity, handler);
  });

  triggerSetupEffect(ref, true);
}