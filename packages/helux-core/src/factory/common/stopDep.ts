import { matchListItem, nodupPush } from 'helux-utils';
import { KEY_SPLITER } from '../../consts';
import type { IRuleConf } from '../../types/base';
import type { DepKeyInfo, Level1ArrKeys } from '../../types/inner';
import { getDepKeyByPath } from './util';

/**
 * fullKey: 0/a|b|list|2|key1|key2
 * confKey: 0/a|b|list
 * result:  0/a|b|list|2
 */
function getArrIndexKey(confKey: string, fullKey: string) {
  if (confKey === fullKey) {
    return confKey;
  }
  const restStr = fullKey.substring(confKey.length + 1);
  const keys = restStr.split(KEY_SPLITER);
  return `${confKey}${KEY_SPLITER}${keys[0]}`;
}

/**
 * 辅助 stopDep 主逻辑之用
 */
export function recordArrKey(arrKeys: string[], depKey: string) {
  const faterDepKey = matchListItem(arrKeys, depKey);
  if (faterDepKey) return;
  nodupPush(arrKeys, depKey);
}

/** speedup cutDepKeyByStop logic */
const cutCache = new Map<string, string>();

/**
 * 尝试对当前 depKey 做缩短操作
 */
export function cutDepKeyByStop(
  depKeyInfo: DepKeyInfo,
  options: { stopDepInfo: IRuleConf['stopDepInfo']; level1ArrKeys: Level1ArrKeys; recordCb: (key: string) => void },
) {
  let isKeyRerord = false;
  const { depKey, keyPath, sharedKey } = depKeyInfo;
  const { stopDepInfo, level1ArrKeys, recordCb } = options;

  const cutKey = cutCache.get(depKey);
  if (cutKey) {
    recordCb(cutKey);
    return true;
  }

  const { keys: stopDepKeys, isArrDict, depth, arrKeyStopDcit, stopArrDep } = stopDepInfo;
  const mayArrKeyPrefix = matchListItem(level1ArrKeys, depKey);
  const isGtDepth = keyPath.length > depth;
  // 大于了规定的依赖收集深度或命中了 list 前缀
  if (isGtDepth || mayArrKeyPrefix) {
    let newDepKey = '';
    let cutDepth = depth;
    // 是数组 key 前缀
    if (mayArrKeyPrefix) {
      cutDepth = depth + 1; // 数组默认加载，后续多处会用到
      const notStopByRule = arrKeyStopDcit[mayArrKeyPrefix] === false;

      // 规则显式地针对此数组 key 做设置了需要做更深的依赖收集 ( rules.stopDep = false )，优先级高于 options.stopArrDep
      if (notStopByRule) {
        // do nothing
      } else if (stopArrDep) {
        if (isGtDepth) {
          newDepKey = getDepKeyByPath(keyPath.slice(0, cutDepth), sharedKey);
        } else {
          newDepKey = getArrIndexKey(mayArrKeyPrefix, depKey);
        }
      }
    }

    // 按 depth 裁剪出新的 depKey;
    if (!newDepKey) {
      newDepKey = getDepKeyByPath(keyPath.slice(0, cutDepth), sharedKey);
    }

    if (!mayArrKeyPrefix) {
      cutCache.set(depKey, newDepKey);
    }

    recordCb(newDepKey);
    return true;
  }

  const sharedKeyStr = String(sharedKey);
  for (const confKey of stopDepKeys) {
    // 注意此处需排除掉 sharedKey
    if (!depKey.startsWith(confKey) || confKey === sharedKeyStr) {
      continue;
    }
    const isArr = isArrDict[confKey];
    // 是数组结构，带数组下标后缀的 key 给 recordCb 记录，否则传当前配置 key
    const recordKey = isArr ? getArrIndexKey(confKey, depKey) : confKey;
    if (!isArr) {
      cutCache.set(depKey, recordKey);
    }
    recordCb(recordKey);
    isKeyRerord = true;
    break;
  }
  return isKeyRerord;
}
