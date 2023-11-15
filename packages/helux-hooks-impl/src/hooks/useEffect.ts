import type { ApiCtx, EffectCb } from 'helux-types';

let insKey = 0;
const MOUNT_MAP = new Map<number, { count: number }>();
let firstMountKey = 0;

function setFirstMountKey(insKey: number) {
  if (!firstMountKey) {
    // 未设置过才能设置
    firstMountKey = insKey;
  }
}

function isStrict() {
  return firstMountKey % 2 === 0;
}

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
  const effectLogic = () => {
    const cleanUp = cb();
    return () => {
      MOUNT_MAP.delete(insKey);
      cleanUp && cleanUp();
    };
  };

  setFirstMountKey(insKey);
  markKeyMount(insKey);
  if (isStrict()) {
    const curKeyMount = getKeyMount(insKey);
    // strict mode
    if (curKeyMount && curKeyMount.count > 1) {
      // trigger effect cb at second mount timing
      return effectLogic();
    }
  } else {
    return effectLogic();
  }
}

export function useEffectLogic(apiCtx: ApiCtx, cb: EffectCb, options: { isLayout?: boolean; deps?: any[] }) {
  const { useState, useLayoutEffect, useEffect } = apiCtx.react;
  const { isLayout, deps } = options;
  const [insKey] = useState(() => getInsKey());
  const useFn = isLayout ? useLayoutEffect : useEffect;
  useFn(() => {
    return mayExecuteCb(insKey, cb);
  }, deps);
}

export function useLayoutEffect(apiCtx: ApiCtx, cb: EffectCb, deps?: any[]) {
  useEffectLogic(apiCtx, cb, { isLayout: true, deps });
}

/**
 * only works for root StrictMode currently
 * 此 useEffect 在严格模式下也只会触发一次挂载和卸载行为
 */
export function useEffect(apiCtx: ApiCtx, cb: EffectCb, deps?: any[]) {
  useEffectLogic(apiCtx, cb, { deps });
}
