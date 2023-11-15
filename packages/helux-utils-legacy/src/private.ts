import { isProxyAvailable } from './is';
import { warn } from './log';

export function setNoop() {
  warn('changing shared state is invalid');
  return true;
}

export function asType<T extends any = any>(val: any) {
  // return val as unknown as T;
  const typedVal: any = val;
  return typedVal as unknown as T;
}

export function prefixValKey(valKey: string, sharedKey: number) {
  return `${sharedKey}/${valKey}`;
}

export function canUseDeep(isDeep: boolean) {
  return isDeep && isProxyAvailable();
}
