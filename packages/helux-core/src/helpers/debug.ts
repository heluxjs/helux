import { KEY_SPLITER } from '../consts';
import { getInternalByKey } from './state';

export function fmtDepKeys(depKeys: string[], prefixModuleName = true, spliter = KEY_SPLITER) {
  return depKeys.map((key) => {
    const [skey, restStr] = key.split('/');
    const keys = restStr.split(KEY_SPLITER);
    const prefix = prefixModuleName ? `${getInternalByKey(Number(skey)).usefulName}/` : '';
    return `${prefix}${keys.join(spliter)}`;
  });
}
