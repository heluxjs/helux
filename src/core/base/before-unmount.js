import { okeys, getVal } from '../../support/util';
import { MOUNTED, UNMOUNTED } from '../../support/constant';
import { delIns, delStaticInsM } from '../../cc-context/wakey-ukey-map';
import * as ev from '../event';
import unsetRef from '../ref/unset-ref';
import * as refCache from '../ref/_cache';
import module2insCount from '../../cc-context/modue-ins-count-map';
import lifecycle from '../../cc-context/lifecycle';
import { makeModuleDispatcher } from '../state/handler-factory';

const { _lifecycle, _willUnmountOnce } = lifecycle;

function executeClearCb(cbMap, ctx) {
  const execute = key => { // symbolKey or normalKey
    const cb = cbMap[key];
    if (typeof cb === 'function') cb(ctx);
  };

  Object.getOwnPropertySymbols(cbMap).forEach(execute);
  okeys(cbMap).forEach(execute);
}

function triggerLifecyleWillUnmount(allModules, mstate) {
  const handleOneModule = (m) => {
    module2insCount[m] -= 1;
    const moduleLifecycle = _lifecycle[m];
    if (!moduleLifecycle) return;
    const willUnmount = moduleLifecycle.willUnmount;
    if (!willUnmount) return;
    if (_willUnmountOnce[m] === true) return;

    if (module2insCount[m] === 0) {
      const once = willUnmount(makeModuleDispatcher(m), mstate);
      _willUnmountOnce[m] = getVal(once, true);
    }
  };

  allModules.forEach(handleOneModule);
}


export default function (ref) {
  // 标记一下已卸载，防止组件卸载后，某个地方有异步的任务拿到了该组件的引用，然后执行setState，导致
  // Warning: Can't perform a React state update on an unmounted component. This is a no-op ......
  const curMs = ref.__$$ms;
  ref.__$$ms = UNMOUNTED;
  const ctx = ref.ctx;
  const { ccUniqueKey, module, allModules, __$$staticWaKeyList, __$$mstate } = ctx;

  // 正常情况下只有挂载了组件才会有effect等相关定义
  if (curMs === MOUNTED) {
    const { eid2effectReturnCb, eid2effectPropsReturnCb } = ctx.effectMeta;
    executeClearCb(eid2effectReturnCb, ctx);
    executeClearCb(eid2effectPropsReturnCb, ctx);
    ev.offEventHandlersByCcUniqueKey(ccUniqueKey);
  }

  // 删除记录的动态依赖
  const waKeys = ctx.getWatchedKeys();// no module prefix
  waKeys.forEach(k => delIns(module, k, ccUniqueKey));
  const connWaKeys = ctx.getConnectWatchedKeys();
  okeys(connWaKeys).map(m => {
    const waKeys = connWaKeys[m];
    waKeys.forEach(k => delIns(m, k, ccUniqueKey));
  });

  // 删除记录的静态依赖
  __$$staticWaKeyList.forEach(modStateKey => delStaticInsM(modStateKey, ccUniqueKey));

  // let findUpdateRefs cache expire
  allModules.forEach(refCache.createModuleNode);

  unsetRef(ccUniqueKey);

  triggerLifecyleWillUnmount(allModules, __$$mstate);
}
