import { matchDictKey, matchListItem } from '@helux/utils';
import { KEY_SPLITER } from '../consts';
import type { Dict } from '../types/base';

export function getParentKey(keyDict: Dict, depKey: string) {
  const parentKey = matchDictKey(keyDict, depKey, KEY_SPLITER);
  return parentKey;
}

export function getParentKeyFromArr(keyArr: string[], depKey: string) {
  /**
   * 加第三个参数 KEY_SPLITER 是为了避免如下情况的误判
   * matchListItem(['5/groups|2', '5/groups|3'], '5/groups|22'); // out: '5/groups|2'
   * 此处正确结果应该是 ''，故需要穿 itemSuffix 给 matchListItem，内部遍历时会统一个 item 加后缀
   * matchListItem(['5/groups|2', '5/groups|3'], '5/groups|22', '|'); // out: ''
   */
  const parentKey = matchListItem(keyArr, depKey, KEY_SPLITER);
  return parentKey;
}
