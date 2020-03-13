import * as ev from '../event';
import triggerSetupEffect from './trigger-setup-effect';
import setRef from '../ref/set-ref';
import afterRender from '../ref/after-render';

export default function (ref) {
  afterRender(ref);

  ref.__$$isMounted = true;
  ref.__$$isUnmounted = false;
  const { isSingle, ccClassKey, ccKey, ccUniqueKey, __$$onEvents } = ref.ctx;
  setRef(ref, isSingle, ccClassKey, ccKey, ccUniqueKey);

  // 这些事件是组件还未挂载时，就派发过来的，延迟到此刻执行，同时清空
  if (__$$onEvents.length > 0) {
    __$$onEvents.forEach(({ fn, args }) => fn(...args));
    __$$onEvents.length = 0;
  }

  triggerSetupEffect(ref, true);
}