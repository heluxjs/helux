import { PROD_FLAG } from '../consts';
import type { Dict, Fn, NumStrSymbol } from '../types';

// @ts-ignore
const canUseReflect = !!Reflect;
const hasProp = Object.prototype.hasOwnProperty;

// @ts-ignore
export const GLOBAL_REF: Dict & Window & typeof globalThis = window || global;

export function has(obj: any, key: any) {
  if (canUseReflect) {
    return Reflect.has(obj, key);
  }
  return hasProp.call(obj, key);
}

export function setNoop() {
  warn('changing shared state is invalid');
  return true;
}

export function isDebug() {
  if (
    !!GLOBAL_REF.location?.port
    || GLOBAL_REF.name === 'previewFrame' // for stackblitz
    || GLOBAL_REF.BrowserFS // for codesandbox
  ) {
    return true;
  }
  return false;
}

export function asType<T extends any = any>(val: any) {
  // return val as unknown as T;
  const typedVal: any = val;
  return typedVal as unknown as T;
}

/** safe obj get */
export function safeGet<T = any>(obj: Record<NumStrSymbol, any>, key: NumStrSymbol, defaultValue: T): T {
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

export function nodupPush(list: NumStrSymbol[], toPush: NumStrSymbol) {
  if (!list.includes(toPush)) list.push(toPush);
}

export function delListItem(list: NumStrSymbol[], toDel: NumStrSymbol) {
  const idx = list.indexOf(toDel);
  if (idx >= 0) {
    list.splice(idx, 1);
  }
}

export function isObj(mayObj: any): mayObj is Dict {
  return mayObj && typeof mayObj === 'object' && !Array.isArray(mayObj);
}

export function isFn(mayFn: any): mayFn is Fn {
  return typeof mayFn === 'function';
}

export function isAsyncFn(mayFn: any): mayFn is Fn {
  // 仅开发模式的包做检查
  if (PROD_FLAG) return true;
  const str = Object.prototype.toString.call(mayFn);
  return str === '[object AsyncFunction]';
}

export function isSymbol(maySymbol: any): maySymbol is symbol {
  return typeof maySymbol === 'symbol';
}

export function isPromise(mayObj: any) {
  if (!mayObj) {
    return false;
  }
  const objType = typeof mayObj;
  return (objType === 'object' || objType === 'function') && isFn(mayObj.then);
}

export function isProxyRevoked(proxy: Dict) {
  try {
    noop(proxy['test']);
    return false;
  } catch (err: any) {
    return true;
  }
}

export function enureReturnArr(fn?: Fn, arg?: any) {
  if (!fn) return [];
  const result = fn(arg);
  return Array.isArray(result) ? result : [result];
}

export function warn(msg: string) {
  console.warn?.(msg);
}

export function dedupList(list: Array<any>) {
  return Array.from(new Set(list));
}

export function includeOne(loopList: any[], judgeList: any[]) {
  let ret = false;
  for (const item of loopList) {
    if (judgeList.includes(item)) {
      // 包含有外层list的一项，就结束循环
      ret = true;
      break;
    }
  }
  return ret;
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

export function matchListItem(list: string[], fullStr: string) {
  let matchKey = '';
  const len = list.length;
  for (let i = 0; i < len; i++) {
    const item = list[i];
    if (fullStr.startsWith(item)) {
      matchKey = item;
      break;
    }
  }
  return matchKey;
}

export function noop(...args: any[]): any {}

export function noopArgs(...args: any[]): any {
  return args;
}

export function noopArr(...args: any[]): any[] {
  return [];
}

export function prefixValKey(valKey: string, sharedKey: number) {
  return `${sharedKey}/${valKey}`;
}

export function canUseProxy() {
  return typeof Proxy === 'function';
}

export function canUseDeep(isDeep: boolean) {
  return isDeep && canUseProxy();
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

export function isMax(input: number) {
  return input === Number.MAX_SAFE_INTEGER;
}

export function getSafeNext(input: number) {
  const num = isMax(input) ? 1 : input + 1;
  return num;
}

export function tryAlert(err: any, throwErr = false, customLabel = '') {
  let label = err;
  let isErr = false;
  if (isDebug()) {
    if (err instanceof Error) {
      isErr = true;
      label = err.message;
    }
    // TODO see if has errHandler
    err && GLOBAL_REF.alert?.(`${customLabel || label}, see details in console.`);
  }
  if (isErr && customLabel) {
    err.message = `${customLabel}`;
  }
  console.error(err);
  if (throwErr) {
    throw isErr ? err : new Error(label);
  }
}

export function tryWarn(err: any) {
  console.error(err);
}
