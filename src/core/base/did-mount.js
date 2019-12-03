import * as ev from '../event';
import triggerSetupEffect from './trigger-setup-effect';

export default function (ref) {
  ref.__$$isBeforeFirstRender = false;

  const { module, ccClassKey, ccUniqueKey, onEvents } = ref.ctx;

  onEvents.forEach(({ event, identity, handler }) => {
    ev.bindEventHandlerToCcContext(module, ccClassKey, ccUniqueKey, event, identity, handler);
  });

  triggerSetupEffect(ref, true);
}