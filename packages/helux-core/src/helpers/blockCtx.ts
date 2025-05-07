import { RUN_AT_SERVER } from '../consts';
import { getBlockCtxMap } from '../factory/common/blockScope';
import { genBlockKey } from '../factory/common/key';
import { getBlockScope } from '../factory/common/speedup';
import { IBlockCtx } from '../types/base';

const SIZE_LIMIT = 100;
const EXPIRE_LIMIT = 5000; // ms

function newBlockCtx(key: string, enableStatus: boolean): IBlockCtx {
  return {
    key,
    results: [],
    depKeys: [],
    enableStatus,
    collected: false,
    mounted: false,
    renderAtomOnce: false,
    time: 0,
    status: { loading: false, err: null, ok: true },
  };
}

let fakeBlockCtx: any = null;

function getFakeBlockCtx() {
  if (!fakeBlockCtx) {
    fakeBlockCtx = newBlockCtx(genBlockKey(), false);
  }
  return fakeBlockCtx;
}

/**
 * 为 block 函数初始一个执行上下文
 */
export function initBlockCtx(isDynamic: boolean, enableStatus = false) {
  // 服务器端不记录 blockCtx ，返回一个假的即可，避免内存泄露
  if (RUN_AT_SERVER) {
    return getFakeBlockCtx();
  }
  const blockScope = getBlockScope();
  if (isDynamic) {
    blockScope.initCount += 1;
  }
  const blockKey = genBlockKey();
  const blockCtx = newBlockCtx(blockKey, enableStatus);
  getBlockCtxMap(isDynamic).set(blockKey, blockCtx);

  return blockCtx;
}

export function markBlockMounted(blockCtx: IBlockCtx) {
  const blockScope = getBlockScope();
  blockCtx.mounted = true;
  blockCtx.time = Date.now();
  blockScope.mountedCount += 1;
}

/**
 * 删除 block 函数对应上下文
 */
export function delBlockCtx(blockBey: string, isDynamic: boolean) {
  const blockScope = getBlockScope();
  const map = getBlockCtxMap(isDynamic);
  map.delete(blockBey);

  // work for strict mode
  if (isDynamic && map.size === SIZE_LIMIT && blockScope.initCount - blockScope.mountedCount > 2) {
    blockScope.initCount = 0;
    blockScope.mountedCount = 0;
    const now = Date.now();
    map.forEach((item, key) => {
      if (!item.mounted && now - item.time > EXPIRE_LIMIT) {
        // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach
        // deleting item in map.forEach is doable
        map.delete(key);
      }
    });
  }
}

/**
 * 标记某个 block 函数开始执行
 */
export function markBlockFnStart(blockCtx: IBlockCtx, isDynamic: boolean) {
  const blockScope = getBlockScope();
  blockScope.runningKey = blockCtx.key;
  blockScope.isDynamic = isDynamic;
}

/**
 * 标记某个 block 函数执行结束
 */
export function markBlockFnEnd(blockCtx: IBlockCtx) {
  const blockScope = getBlockScope();
  blockScope.runningKey = ''; // let all execution context konw block fn is end status
  blockScope.isDynamic = false;
  blockCtx.collected = true;
}
