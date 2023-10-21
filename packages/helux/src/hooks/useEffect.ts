import { useEffect as useReactEffect, useLayoutEffect as useReactLayoutEffect, useState } from 'react';
import type { EffectCb } from '../types';

let insKey = 0;
const MOUNT_MAP = new Map<number, { count: number }>();

function getInsKey() {
  insKey++;
  return insKey;
}

function markKeyMount(insKey: number) {
  const data = MOUNT_MAP.get(insKey);
  if (!data) {
    MOUNT_MAP.set(insKey, { count: 1 });
  } else {
    data.count += 1;
  }
}

function getKeyMount(insKey: number) {
  return MOUNT_MAP.get(insKey);
}

function mayExecuteCb(insKey: number, cb: EffectCb) {
  markKeyMount(insKey);
  const curKeyMount = getKeyMount(insKey);
  const pervKeyMount = getKeyMount(insKey - 1);
  if (!pervKeyMount) {
    // strict mode
    if (curKeyMount && curKeyMount.count > 1) {
      // trigger effect cb at second mount timing
      const cleanUp = cb();
      return () => {
        MOUNT_MAP.delete(insKey);
        cleanUp && cleanUp();
      };
    }
  }
}

function useEffectLogic(cb: EffectCb, isLayout: boolean, deps?: any[]) {
  const [insKey] = useState(() => getInsKey());
  const useFn = isLayout ? useReactLayoutEffect : useReactEffect;
  useFn(() => {
    return mayExecuteCb(insKey, cb);
  }, deps);
}

export function useLayoutEffect(cb: EffectCb, deps?: any[]) {
  useEffectLogic(cb, true, deps);
}

export function useEffect(cb: EffectCb, deps?: any[]) {
  useEffectLogic(cb, false, deps);
}
