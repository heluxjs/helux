import { Off, ReadOnlyArr } from '../../types';
import { getRootCtx } from '../root';

export function getUserBus() {
  const { userBus } = getRootCtx();
  return userBus;
}

export function emit<A extends any[] = any[]>(name: string, ...args: A) {
  const { userBus } = getRootCtx();
  userBus.emit(name, ...args);
}

export function on<A extends ReadOnlyArr = ReadOnlyArr>(name: string, cb: (...args: A) => void): Off {
  const { userBus } = getRootCtx();
  userBus.on(name, cb);
  return () => userBus.off(name, cb);
}
