import type { Dict, NumStrSymbol } from 'helux-types';

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
export function safeObjGet<T = any>(obj: Record<NumStrSymbol, any>, key: NumStrSymbol, defaultValue: T): T {
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

export function matchDictKey(dict: Dict, fullStr: string) {
  let matchKey = '';
  for (const key in dict) {
    // test if calling matchListItem(fullStr, Object.keys(dict)) is faster
    if (fullStr.startsWith(key)) {
      matchKey = key;
      break;
    }
  }
  return matchKey;
}

export function getVal(obj: any, keyPath: string[]): any {
  let val;
  let parent = obj;
  keyPath.forEach((key) => {
    val = parent[key];
    parent = val;
  });
  return val;
}

export function setVal(obj: any, keyPath: string[], val: any) {
  let parent = obj;
  const lastIdx = keyPath.length - 1;
  keyPath.forEach((key, idx) => {
    if (idx === lastIdx) {
      parent[key] = val;
      return;
    }
    parent = parent[key]; // for next cb
  });
}
