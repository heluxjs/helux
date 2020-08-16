import triggerSetupEffect from './trigger-setup-effect';
import setRef from '../ref/set-ref';
import afterRender from '../ref/after-render';
import { okeys, safeAdd } from '../../support/util';
import { mapStaticInsM } from '../../cc-context/wakey-ukey-map';
import module_insCount_ from '../../cc-context/modue-ins-count-map';
import lifecycle from '../../cc-context/lifecycle';
import ccContext from '../../cc-context';
import * as ev from '../event';
import { makeModuleDispatcher } from '../state/handler-factory';
import { getVal } from '../../support/util';
import { MOUNTED } from '../../support/constant';

const { _lifecycle, _mountedOnce } = lifecycle;
const { store: { getModuleVer } } = ccContext;

export default function (ref) {
  afterRender(ref);

  ref.__$$ms = MOUNTED;
  const { ccUniqueKey, __$$onEvents, __$$staticWaKeys, module, __$$mstate, __$$prevModuleVer } = ref.ctx;
  setRef(ref);

  // 确保组件挂载时在绑定事件，以避免同一个组件(通常是function组件, 因为cursor问题)，
  // 走了 (1)mount ---> (2)mount ---> (1)unmount 时把2本来也要监听的事件清理掉
  // 同时本身来说，挂载好的组件监听事件才是安全的
  if (__$$onEvents.length > 0) {
    __$$onEvents.forEach(({ inputEvent, handler }) => {
      const { name: event, identity } = ev.getEventItem(inputEvent);
      ev.bindEventHandlerToCcContext(module, ref.ctx.ccClassKey, ccUniqueKey, event, identity, handler);
    });
    __$$onEvents.length = 0;
  }

  const __$$staticWaKeyList = okeys(__$$staticWaKeys);
  // 用于辅助记录依赖映射
  ref.ctx.__$$staticWaKeyList = __$$staticWaKeyList;
  // 记录静态依赖
  __$$staticWaKeyList.forEach(modStateKey => mapStaticInsM(modStateKey, ccUniqueKey));

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
