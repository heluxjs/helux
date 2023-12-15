import { delListItem, nodupPush, noop, safeObjGet } from '@helux/utils';
import type {
  Dict,
  Ext,
  IInsCtx,
  InnerSetState,
  IRuleConf,
  KeyInsKeysDict,
  NumStrSymbol,
  SetState,
  SetStateFactory,
  SharedState,
} from '../../types/base';
import type { Level1ArrKeys } from '../../types/inner';
import { ParsedOptions } from './parse';

/** 在 initLoadingCtx 阶段会生成，这里先预备一个假的 */
const fakeInternal: any = { innerSetState: noop };

export function buildInternal(
  parsedOptions: ParsedOptions,
  innerOptions: {
    setState: SetState;
    setStateFactory: SetStateFactory;
    innerSetState: InnerSetState;
    sharedState: Ext<SharedState>;
    ruleConf: IRuleConf;
    isDeep: boolean;
  },
) {
  const { rawState, forAtom } = parsedOptions;
  const insCtxMap = new Map<number, InsCtxDef>();
  const key2InsKeys: KeyInsKeysDict = {};
  // id --> insKeys
  const id2InsKeys: KeyInsKeysDict = {};
  const level1ArrKeys: Level1ArrKeys = [];
  const copy = { ...rawState };
  let rawStateVal = copy;
  if (forAtom) {
    rawStateVal = rawState.val;
  }

  return {
    ver: 0,
    sn: 0,
    // reactive and reactiveRoot will be replaced in buildReactive process later
    reactive: rawState,
    reactiveRoot: rawState,
    // sync and syncer will be replaced after buildInternal
    sync: noop as any,
    syncer: noop as any,
    // snap and prevSnap will be replaced after changing state
    // 这里 copy 两份不同的，避免 commitState 阶段这段逻辑（需要判断 ver 是不是 0，是 0 时 做一次 prevSnap 的替换）
    // 否则 snap 和 prevSnap 是一样的，导致首次运行时的值比较是失败的
    snap: copy,
    prevSnap: copy,
    // TODO 接入 limu copy 函数，这个值目前内部用不到
    // 本意是给 reactive 模块生成 draft 时，代理 rawStateVal 之用，这样控制台展开代理后可看到最新的状态，
    // 且 chrome 浏览器没无 .val 封装的对象，避免作者误会拆封后的 reactive 对象为何还有一层 .val
    // 这个优化做和不做都对逻辑正确性无影响
    rawStateVal,
    ...parsedOptions,
    ...innerOptions,
    insCtxMap,
    key2InsKeys,
    id2InsKeys,
    recordId(id: NumStrSymbol, insKey: number) {
      if (!id) return;
      const insKeys: any[] = safeObjGet(id2InsKeys, id, []);
      nodupPush(insKeys, insKey);
    },
    delId(id: NumStrSymbol, insKey: number) {
      if (!id) return;
      delListItem(id2InsKeys[id] || [], insKey);
    },
    recordDep(depKey: string, insKey: number) {
      const insKeys: any[] = safeObjGet(key2InsKeys, depKey, []);
      nodupPush(insKeys, insKey);
    },
    delDep(depKey: string, insKey: number) {
      delListItem(key2InsKeys[depKey] || [], insKey);
    },
    mapInsCtx(insCtx: InsCtxDef, insKey: number) {
      insCtxMap.set(insKey, insCtx);
    },
    delInsCtx(insKey: number) {
      insCtxMap.delete(insKey);
    },
    extra: {} as Dict, // 记录一些需复用的中间生成的数据
    loadingInternal: fakeInternal,
    level1ArrKeys,
  };
}

export type TInternal = ReturnType<typeof buildInternal>;

export type InsCtxDef = IInsCtx<TInternal>;
