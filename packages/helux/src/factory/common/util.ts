import { KEY_SPLITER } from '../../consts';
import type { Dict, IRuleConf, TriggerReason } from '../../types';

export interface IMutateCtx {
  depKeys: string[];
  triggerReasons: TriggerReason[];
  ids: string[];
  globalIds: string[];
  writeKeys: Dict;
  arrKeyDict: Dict;
  writeKeyPathInfo: Dict<TriggerReason>;
}

export function getMutateCtx(): IMutateCtx {
  return {
    depKeys: [],
    triggerReasons: [],
    ids: [],
    globalIds: [],
    writeKeys: {},
    arrKeyDict: {}, // 记录读取过程中遇到的数组key
    writeKeyPathInfo: {},
  };
}

/**
 * fullKey: 0/a|b|list|2|key1|key2
 * confKey: 0/a|b|list
 * result:  0/a|b|list|2
 */
export function getArrIndexKey(confKey: string, fullKey: string) {
  if (confKey === fullKey) {
    return confKey;
  }
  const restStr = fullKey.substring(confKey.length + 1);
  const keys = restStr.split(KEY_SPLITER);
  return `${confKey}${KEY_SPLITER}${keys[0]}`;
}

/**
 * 尝试查询当前 readKey writeKey 是否需要缩短后再记录
 */
export function recordDataKeyForStop(readOrWriteKey: string, stopDepInfo: IRuleConf['stopDepInfo'], recordCb: (key: string) => void) {
  let isKeyRerord = false;
  const { keys: stopDepKeys, isArrDict } = stopDepInfo;
  for (const confKey of stopDepKeys) {
    if (!readOrWriteKey.startsWith(confKey)) {
      continue;
    }

    // 是数组结构，带数组下标后缀的 key 给recordCb记录，否则传当前配置 key
    const recordKey = isArrDict[confKey] ? getArrIndexKey(confKey, readOrWriteKey) : confKey;
    recordCb(recordKey);
    isKeyRerord = true;
    break;
  }
  return isKeyRerord;
}

/**
 * 筛出当前写入 key 对应的可能存在的数组 key
 */
export function getArrKey(writeKey: string, arrKeyDict: Dict) {
  let arrKey = '';
  for (const key in arrKeyDict) {
    if (writeKey.startsWith(key)) {
      arrKey = key;
      break;
    }
  }
  return arrKey;
}
