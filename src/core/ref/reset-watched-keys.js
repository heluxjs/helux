import { END } from '../../support/priv-constant';
import { okeys } from '../../support/util';
import * as cache from './_cache';

export default function (ref) {
  const ctx = ref.ctx;
  const { module: refModule, connectedModules } = ctx;

  // 不存在自动收集行为
  if (ctx.__$$noAutoWatch) {
    return;
  }

  ctx.__$$renderStatus = END;

  const oldWaKeysStr = ctx.__$$preparedWatchedKeys.sort().join(',');
  ctx.__$$preparedWatchedKeys = okeys(ctx.__$$collectingWatchedKeys_);

  //比较变化，如果已经有变动则让find缓存结果失效
  const newWaKeysStr = ctx.__$$preparedWatchedKeys.sort().join(',');
  if (newWaKeysStr !== oldWaKeysStr) {
    cache.createModuleNode(refModule);
  }

  // cmwMap的值取出来逐个转为list
  const oldPrepared = ctx.__$$preparedConnectWatchedKeys_;
  const cmwMap = ctx.__$$collectingModuleWatchedKeys_;
  const newMap = {};
  connectedModules.forEach(m=>{
    const newWaKeys = okeys((cmwMap[m] || []));
    const oldWaKeys = oldPrepared[m] || [];

    if (oldWaKeys) {
      const oldWaKeysStr = oldWaKeys.sort().join(',');
      const newWaKeysStr = newWaKeys.sort().join(',');
      if (oldWaKeysStr !== newWaKeysStr) {
        cache.createModuleNode(m);
      }
    }

    newMap[m] = newWaKeys;
  });
  ctx.__$$preparedConnectWatchedKeys_ = newMap;
  
  //清空
  ctx.__$$collectingModuleWatchedKeys_ = ctx.__$$getEmptyCMWKeys();
  ctx.__$$collectingWatchedKeys_ = {}
}