import * as util from '../../support/util';
import { delIns, delStaticInsM } from '../../cc-context/wakey-ukey-map';
import * as ev from '../event';
import unsetRef from '../ref/unset-ref';

const okeys = util.okeys;

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
  const { ccUniqueKey, module, __$$staticWaKeyList } = ctx;

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
  util.okeys(connWaKeys).map(m => {
    const waKeys = connWaKeys[m];
    waKeys.forEach(k => delIns(m, k, ccUniqueKey));
  })

  // 删除记录的静态依赖
  __$$staticWaKeyList.forEach(modStateKey => delStaticInsM(modStateKey, ccUniqueKey));

  unsetRef(ccUniqueKey);
}
