import { okeys, getVal } from '../../support/util';
import { delIns, delStaticInsM } from '../../cc-context/wakey-ukey-map';
import * as ev from '../event';
import unsetRef from '../ref/unset-ref';
import module_insCount_ from '../../cc-context/modue-ins-count-map';
import lifecycle from '../../cc-context/lifecycle';
import { makeModuleDispatcher } from '../state/handler-factory';

const { _lifecycle, _willUnmountOnce } = lifecycle;

function executeClearCb(cbMap, ctx) {
  const execute = key => {// symbolKey or normalKey
    const cb = cbMap[key];
    if (typeof cb === 'function') cb(ctx);
  }

  Object.getOwnPropertySymbols(cbMap).forEach(execute);
  okeys(cbMap).forEach(execute);
}

export default function (ref) {
  //标记一下已卸载，防止组件卸载后，某个地方有异步的任务拿到了该组件的引用，然后执行setState，导致
  //Warning: Can't perform a React state update on an unmounted component. This is a no-op ......
  ref.__$$isUnmounted = true;
  const ctx = ref.ctx;
  const { ccUniqueKey, module, __$$staticWaKeyList, __$$mstate } = ctx;

  // 正常情况下只有挂载了组件才会有effect等相关定义
  if (ref.__$$isMounted) {
    const { eid_effectReturnCb_, eid_effectPropsReturnCb_ } = ctx.effectMeta;

    executeClearCb(eid_effectReturnCb_, ctx);
    executeClearCb(eid_effectPropsReturnCb_, ctx);

    ev.offEventHandlersByCcUniqueKey(ccUniqueKey);
  }


  // 删除记录的动态依赖
  const waKeys = ctx.getWatchedKeys();// no module prefix
  waKeys.forEach(k => delIns(module, k, ccUniqueKey));
  const connWaKeys = ctx.getConnectWatchedKeys();
  okeys(connWaKeys).map(m => {
    const waKeys = connWaKeys[m];
    waKeys.forEach(k => delIns(m, k, ccUniqueKey));
  })

  // 删除记录的静态依赖
  __$$staticWaKeyList.forEach(modStateKey => delStaticInsM(modStateKey, ccUniqueKey));

  unsetRef(ccUniqueKey);

  module_insCount_[module] -= 1;
  if (_willUnmountOnce[module] === true) {
    return;
  }

  if (module_insCount_[module] === 0 && _lifecycle[module].willUnmount) {
    const once = _lifecycle[module].willUnmount(makeModuleDispatcher(module), __$$mstate);
    _willUnmountOnce[module] = getVal(once, true);
  }
}
