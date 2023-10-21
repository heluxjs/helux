import type { Dict, Fn, NumStrSymbol } from '../types';
import type { IOperateParams } from 'limu';

// @ts-ignore
const canUseReflect = !!Reflect;
const hasProp = Object.prototype.hasOwnProperty;

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
  const ret = !!window.location.port;
  return ret;
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
export function safeMapGet<T = any>(map: Map<NumStrSymbol, any>, key: NumStrSymbol, defaultValue: T): T {
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

export function warn(msg: string) {
  console.warn?.(msg);
}

export function dedupList(list: Array<any>) {
  return Array.from(new Set(list));
}

export function noop() { }

export function prefixValKey(valKey: string, sharedKey: number) {
  return `${sharedKey}/${valKey}`;
}

export function canUseProxy() {
  return typeof Proxy === 'function';
}

export function canUseDeep(isDeep: boolean) {
  return isDeep && canUseProxy();
}

export function genOpParams(key: string, value: any): IOperateParams {
  return { isChange: true, op: 'set', key, value, parentType: 'Object', keyPath: [], fullKeyPath: [key], isBuiltInFnKey: false };
}
