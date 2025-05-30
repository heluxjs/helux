import { getParentKeyFromArr } from '../../common';
import { KEY_SPLITER } from '../../consts';
import { getDepKeyByPath } from '../common/util';
import { getBlockScope } from './speedup';

let reuseLatest = false;

/**
 * 记录共享状态或共享派生结果最近一次读取的数据，为 block 模块服务
 * for perf, no options param here
 */
export function recordLastest(
  sharedKey: number,
  val: any,
  sharedState: any,
  depKey: string,
  keyPath: string[],
  isDerivedResult = false,
  isDerivedAtom = false,
) {
  const scope = getBlockScope();
  const latest = scope.latest;
  if (reuseLatest) {
    latest.keyPaths.push(keyPath);
    return;
  }

  scope.latest = {
    sharedKey,
    val,
    stateOrResult: sharedState,
    depKey,
    keyPath,
    keyPaths: [keyPath],
    isDerivedResult,
    isDerivedAtom,
  };
}

export function enableReuseLatest() {
  reuseLatest = true;
}

export function disableReuseLatest() {
  const latest = getBlockScope().latest;
  const { sharedKey, keyPaths } = latest;
  const newKeyPaths: string[][] = [];
  const newKeyPath: string[] = [];
  const ignored: Record<string, boolean> = {};

  // 开始收窄依赖
  // input: [info,name,first] [info] [info,name] [info,name,first] [info] [info,name] [info,name,last]
  // out:   [info,name,first] [info,name,last]
  keyPaths.forEach((keyPath) => {
    const depKey = getDepKeyByPath(keyPath, sharedKey);
    const parentKey = getParentKeyFromArr(newKeyPath, depKey);
    if (ignored[depKey] || ignored[parentKey]) {
      return;
    }

    if (parentKey) {
      const idx = newKeyPath.indexOf(parentKey);
      if (idx >= 0) {
        newKeyPath.splice(idx, 1);
        newKeyPaths.splice(idx, 1);
        ignored[parentKey] = true;
      }
    }
    if (
      // 当前 depKey 已被添加
      newKeyPath.includes(depKey)
      // 当前 depKey 是数组里某个 key 的路径前缀，不需要添加到依赖路径里，表示依赖已被收窄
      || newKeyPath.some((v) => v.startsWith(`${depKey}${KEY_SPLITER}`))
    ) {
      ignored[depKey] = true;
      return;
    }

    newKeyPath.push(depKey);
    newKeyPaths.push(keyPath);
  });

  latest.keyPaths = newKeyPaths;
  reuseLatest = false;
}

/**
 * 获取最新的数据读取信息
 */
export function getLastest() {
  const scope = getBlockScope();
  return scope.latest;
}

export function getBlockCtxMap(isDynamic: boolean) {
  const { KEY_DYNAMIC_CTX_MAP, KEY_CTX_MAP } = getBlockScope();
  const map = isDynamic ? KEY_DYNAMIC_CTX_MAP : KEY_CTX_MAP;
  return map;
}
