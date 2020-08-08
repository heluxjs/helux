import triggerSetupEffect from './trigger-setup-effect';
import setRef from '../ref/set-ref';
import afterRender from '../ref/after-render';
import { okeys } from '../../support/util';
import { mapStaticInsM } from '../../cc-context/wakey-ukey-map';

export default function (ref) {
  afterRender(ref);
  
  ref.__$$isMounted = true;
  ref.__$$isUnmounted = false;
  const { ccUniqueKey, __$$onEvents, __$$staticWaKeys } = ref.ctx;
  setRef(ref);

  const __$$staticWaKeyList = okeys(__$$staticWaKeys);
  // 用于辅助清理依赖映射
  ref.ctx.__$$staticWaKeyList = __$$staticWaKeyList;
  // 记录静态依赖
  __$$staticWaKeyList.forEach(modStateKey => mapStaticInsM(modStateKey, ccUniqueKey));
  
  // 这些事件是组件还未挂载时，就派发过来的，延迟到此刻执行，同时清空
  if (__$$onEvents.length > 0) {
    __$$onEvents.forEach(({ fn, args }) => fn(...args));
    __$$onEvents.length = 0;
  }

  triggerSetupEffect(ref, true);
}
