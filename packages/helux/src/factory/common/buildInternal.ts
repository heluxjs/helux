import type { Fn, IHeluxParams, IInsCtx } from '../../types';
import { safeGet } from '../../utils';

export function buildInternal(
  heluxParams: IHeluxParams,
  options: { setState: Fn; insCtxMap: Map<number, IInsCtx>; key2InsKeys: Record<string, number[]> },
) {
  const { heluxObj, sharedKey, createOptions } = heluxParams;
  const { setState, insCtxMap, key2InsKeys } = options;

  return {
    rawState: heluxObj, // helux raw state
    rawStateSnap: heluxObj, // will be replaced while change state
    ver: 0,
    sharedKey,
    key2InsKeys,
    insCtxMap,
    isDeep: createOptions.isDeep,
    setState,
    recordDep(key: string, insKey: number) {
      const insKeys: any[] = safeGet(key2InsKeys, key, []);
      if (!insKeys.includes(insKey)) {
        insKeys.push(insKey);
      }
    },
    delDep(key: string, insKey: number) {
      const insKeys: any[] = key2InsKeys[key] || [];
      const idx = insKeys.indexOf(insKey);
      if (idx >= 0) {
        insKeys.splice(idx, 1);
      }
    },
    mapInsCtx(insKey: number, insCtx: IInsCtx) {
      insCtxMap.set(insKey, insCtx);
    },
    delInsCtx(insKey: number) {
      insCtxMap.delete(insKey);
    },
  };
}

export type TInternal = ReturnType<typeof buildInternal>;

export type InsCtxDef = IInsCtx<TInternal>;
