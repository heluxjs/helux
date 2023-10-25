import type {
  AsyncSetState,
  Fn,
  IHeluxParams,
  IInsCtx,
  InsCtxMap,
  IRuleConf,
  KeyInsKeysDict,
  NumStrSymbol,
  SetAtom,
  SetState,
  SharedState,
} from '../../types';
import { delListItem, nodupPush, safeGet } from '../../utils';

export function buildInternal(
  heluxParams: IHeluxParams,
  options: {
    setAtom: SetAtom;
    setState: SetState;
    asyncSetState: AsyncSetState;
    setStateImpl: (...any: any[]) => { draft: any; finishMutate: Fn; getPartial: Fn };
    insCtxMap: InsCtxMap;
    key2InsKeys: KeyInsKeysDict;
    id2InsKeys: KeyInsKeysDict;
    ruleConf: IRuleConf;
    isDeep: boolean;
    mutate: Fn;
    watch: SharedState[];
  },
) {
  const { markedState, sharedKey, moduleName, createOptions, shouldSync } = heluxParams;
  const { asyncSetState, setAtom, setState, setStateImpl, insCtxMap, key2InsKeys, id2InsKeys, ruleConf, isDeep, mutate, watch } = options;

  return {
    rawState: markedState, // helux raw state
    rawStateSnap: markedState, // will be replaced after changing state
    ver: 0,
    sharedKey,
    moduleName,
    key2InsKeys,
    insCtxMap,
    id2InsKeys,
    ruleConf,
    isDeep,
    createOptions,
    shouldSync,
    setAtom,
    setState,
    asyncSetState,
    setStateImpl,
    mutate,
    watch,
    recordId(id: NumStrSymbol, insKey: number) {
      if (!id) return;
      const insKeys: any[] = safeGet(id2InsKeys, id, []);
      nodupPush(insKeys, insKey);
    },
    delId(id: NumStrSymbol, insKey: number) {
      if (!id) return;
      delListItem(id2InsKeys[id] || [], insKey);
    },
    recordDep(depKey: string, insKey: number) {
      const insKeys: any[] = safeGet(key2InsKeys, depKey, []);
      nodupPush(insKeys, insKey);
    },
    delDep(depKey: string, insKey: number) {
      delListItem(key2InsKeys[depKey] || [], insKey);
    },
    mapInsCtx(insCtx: IInsCtx, insKey: number) {
      insCtxMap.set(insKey, insCtx);
    },
    delInsCtx(insKey: number) {
      insCtxMap.delete(insKey);
    },
  };
}

export type TInternal = ReturnType<typeof buildInternal>;

export type InsCtxDef = IInsCtx<TInternal>;
