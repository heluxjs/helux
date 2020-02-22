import * as util from '../../support/util';
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
  const { eid_effectReturnCb_, eid_effectPropsReturnCb_ } = ctx.effectMeta;

  executeClearCb(eid_effectReturnCb_, ctx);
  executeClearCb(eid_effectPropsReturnCb_, ctx);

  const { ccUniqueKey, ccClassKey, renderKey } = ctx;
  ev.offEventHandlersByCcUniqueKey(ccUniqueKey);
  unsetRef(ccClassKey, ccUniqueKey, renderKey);
}