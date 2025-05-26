import type { Dict, NumStrSymbol } from '@helux/types';
import { isMap } from './is';

// @ts-ignore
const canUseReflect = !!Reflect;
const hasProp = Object.prototype.hasOwnProperty;

export function has(obj: any, key: any) {
  if (canUseReflect) {
    return Reflect.has(obj, key);
  }
  return hasProp.call(obj, key);
}

/** safe obj get */
export function safeObjGet<T = any>(obj: Dict, key: NumStrSymbol, defaultValue: T): T {
  let item = obj[key];
  if (!item) {
    item = obj[key] = defaultValue;
  }
  return item;
}

/** safe map get */
export function safeMapGet<T = any>(map: Map<any, any>, key: any, defaultValue: T): T {
  let item = map.get(key);
  if (!item) {
    map.set(key, defaultValue);
    item = defaultValue;
  }
  return item;
}

/**
 * 获得object所有key里第一个是 fullStr 子串的key
 * @example
 * matchListItem({'12':1, '33':1}, '333'); // out: '33'
 * // 可加 itemSuffix 来做特殊判定，内部遍历时会统一给 key 加后缀
 * matchListItem({'a|b|1':1,'a|b|2':1}, 'a|b|22'); // out: 'a|b|2'
 * matchListItem({'a|b|1':1,'a|b|2':1}, 'a|b|22', '|'); // out: ''
 */
export function matchDictKey(dict: Dict, fullStr: string, itemSuffix?: string) {
  let matchKey = '';
  const suffix = itemSuffix || '';
  for (const key in dict) {
    // test if calling matchListItem(fullStr, Object.keys(dict)) is faster
    const toMatch = `${key}${suffix}`;
    if (fullStr.startsWith(toMatch)) {
      matchKey = key;
      break;
    }
  }
  return matchKey;
}

/**
 * string 获取不到，尝试转为 number 获取
 */
export function getMapVal(map: Map<any, any>, key: string) {
  const strKeyVal = map.get(key);
  if (strKeyVal !== undefined) {
    return strKeyVal;
  }
  const numKeyVal = map.get(Number(key) || key);
  if (numKeyVal !== undefined) {
    return numKeyVal;
  }
  return undefined;
}

export function getVal(obj: any, keyPath: string[]): any {
  let val;
  let parent = obj;
  keyPath.forEach((key) => {
    val = isMap(parent) ? getMapVal(parent, key) : parent[key];
    parent = val;
  });
  return val;
}

export function setVal(obj: any, keyPath: string[], val: any) {
  let parent = obj;
  const lastIdx = keyPath.length - 1;
  keyPath.forEach((key, idx) => {
    const isMapObj = isMap(parent);
    if (idx === lastIdx) {
      isMapObj ? parent.set(key, val) : (parent[key] = val);
      return;
    }
    const subVal = isMapObj ? getMapVal(parent, key) : parent[key];
    parent = subVal; // for next forEach scb
  });
}
