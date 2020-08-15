import triggerSetupEffect from './trigger-setup-effect';
import setRef from '../ref/set-ref';
import afterRender from '../ref/after-render';
import { okeys, safeAdd } from '../../support/util';
import { mapStaticInsM } from '../../cc-context/wakey-ukey-map';
import module_insCount_ from '../../cc-context/modue-ins-count-map';
import lifecycle from '../../cc-context/lifecycle';
import ccContext from '../../cc-context';
import { makeModuleDispatcher } from '../state/handler-factory';
import { getVal } from '../../support/util';

const { _lifecycle, _mountedOnce } = lifecycle;
const { store: { getModuleVer } } = ccContext;

export default function (ref) {
  afterRender(ref);

  ref.__$$isMounted = true;
  ref.__$$isUnmounted = false;
  const { ccUniqueKey, __$$onEvents, __$$staticWaKeys, module, __$$mstate, __$$prevModuleVer } = ref.ctx;
  setRef(ref);

  const __$$staticWaKeyList = okeys(__$$staticWaKeys);
  // 用于辅助记录依赖映射
  ref.ctx.__$$staticWaKeyList = __$$staticWaKeyList;
  // 记录静态依赖
  __$$staticWaKeyList.forEach(modStateKey => mapStaticInsM(modStateKey, ccUniqueKey));

  // 这些事件是组件还未挂载时，就派发过来的，延迟到此刻执行，同时清空
  if (__$$onEvents.length > 0) {
    __$$onEvents.forEach(({ fn, args }) => fn(...args));
    __$$onEvents.length = 0;
  }

  triggerSetupEffect(ref, true);

  safeAdd(module_insCount_, module, 1);
  if (_lifecycle[module].mounted) {
    // mounted可执行多次
    if (_mountedOnce[module] !== true && module_insCount_[module] == 1) {
      const once = _lifecycle[module].mounted(makeModuleDispatcher(module), __$$mstate);
      _mountedOnce[module] = getVal(once, true);
    }
  }

  // 组件的didMount触发会在lifecycle.initState调用之后，此处版本可能已落后，需要自我刷新一下
  if (__$$prevModuleVer !== getModuleVer(module)) {
    ref.ctx.reactForceUpdate();
  }
}
