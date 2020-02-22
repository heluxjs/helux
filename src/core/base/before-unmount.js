import * as util from '../../support/util';
import * as ev from '../event';
import unsetRef from '../ref/unset-ref';

export default function (ref) {
  //标记一下已卸载，防止组件卸载后，某个地方有异步的任务拿到了该组件的引用，然后执行setState，导致
  //Warning: Can't perform a React state update on an unmounted component. This is a no-op ......
  ref.__$$isUnmounted = true;

  const ctx = ref.ctx;
  const eid_effectReturnCb_ = ctx.effectMeta.eid_effectReturnCb_;
  Object.getOwnPropertySymbols(eid_effectReturnCb_).forEach(symbolKey => {
    const cb = eid_effectReturnCb_[symbolKey];
    if (typeof cb === 'function') cb(ctx);
  });
  util.okeys(eid_effectReturnCb_).forEach(eId => {
    const cb = eid_effectReturnCb_[eId];
    if (typeof cb === 'function') cb(ctx);
  });

  const { ccUniqueKey, ccClassKey, renderKey } = ctx;
  ev.offEventHandlersByCcUniqueKey(ccUniqueKey);
  unsetRef(ccClassKey, ccUniqueKey, renderKey);
}