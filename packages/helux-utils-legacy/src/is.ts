import type { Dict, Fn } from 'helux-types';
import { DEV_FLAG, GLOBAL_REF } from './cst';
import { noop } from './fn';

export function isMax(input: number) {
  return input === Number.MAX_SAFE_INTEGER;
}

export function isDebug() {
  if (
    DEV_FLAG
    || GLOBAL_REF.name === 'previewFrame' // for stackblitz
    || GLOBAL_REF.BrowserFS // for codesandbox
  ) {
    return true;
  }
  return false;
}

export function isObj(mayObj: any): mayObj is Dict {
  return mayObj && typeof mayObj === 'object' && !Array.isArray(mayObj);
}

export function isFn(mayFn: any): mayFn is Fn {
  return typeof mayFn === 'function';
}

export function isAsyncFn(mayFn: any): mayFn is Fn {
  // 仅开发模式的包做检查
  if (!DEV_FLAG) return true;
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

export function isProxyAvailable() {
  return typeof Proxy === 'function';
}
