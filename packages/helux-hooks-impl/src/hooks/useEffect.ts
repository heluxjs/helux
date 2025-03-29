import type { ApiCtx, EffectCb, EffectStrictCb, Fn } from '@helux/types';
import { getHookKey, isHookUnderStrictMode } from '../utils/hookKey';

const fakeMount = { count: 0 };
const MOUNT_MAP = new Map<string, { count: number }>();

function markKeyMount(hookKey: string) {
  const data = MOUNT_MAP.get(hookKey);
  if (!data) {
    MOUNT_MAP.set(hookKey, { count: 1 });
  } else {
    data.count += 1;
  }
}

function getKeyMount(hookKey: string) {
  return MOUNT_MAP.get(hookKey) || fakeMount;
}

function mayExecuteCb(hookKey: string, isDoubleCheck: boolean, cb: Fn, passIsStrict?: boolean) {
  const effectLogic = () => {
    if (passIsStrict) {
      cb(isDoubleCheck);
      return () => {
        MOUNT_MAP.delete(hookKey);
      };
    }

    const cleanUp = cb();
    return () => {
      MOUNT_MAP.delete(hookKey);
      cleanUp && cleanUp();
    };
  };

  if (!isDoubleCheck) {
    return effectLogic();
  }

  markKeyMount(hookKey);
  const mountInfo = getKeyMount(hookKey);
  // strict mode
  if (mountInfo.count > 1) {
    // trigger effect cb at second mount timing
    return effectLogic();
  }
}

export function useEffectLogic(apiCtx: ApiCtx, cb: EffectStrictCb, options: { isLayout?: boolean; deps?: any[]; passIsStrict?: boolean }) {
  const { useLayoutEffect, useEffect } = apiCtx.react;
  const { isLayout, deps, passIsStrict } = options;
  const key = getHookKey();
  const useFn = isLayout ? useLayoutEffect : useEffect;
  useFn(() => {
    const isDoubleCheck = isHookUnderStrictMode(key);
    return mayExecuteCb(key, isDoubleCheck, cb, passIsStrict);
  }, deps);
}

export function useLayoutEffect(apiCtx: ApiCtx, cb: EffectCb, deps?: any[]) {
  useEffectLogic(apiCtx, cb, { isLayout: true, deps });
}

export function useEffect(apiCtx: ApiCtx, cb: EffectCb, deps?: any[]) {
  useEffectLogic(apiCtx, cb, { deps });
}
