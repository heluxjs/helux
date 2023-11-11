import { immut } from 'limu';
import { FROM, LOADING_MODE, SINGLE_MUTATE, STATE_TYPE, STOP_ARR_DEP, STOP_DEPTH } from '../../consts';
import { createOb, injectHeluxProto } from '../../helpers/obj';
import { getSharedKey, markSharedKey } from '../../helpers/state';
import type {
  AtomMutateFnItem,
  Dict,
  ICreateOptions,
  IInnerCreateOptions,
  IRuleConf,
  IRunMutateOptions,
  ISetStateOptions,
  KeyBoolDict,
  KeyIdsDict,
  MutateFn,
  MutateFnItem,
  NumStrSymbol,
  WatchDepFn,
  WatchOptionsType,
} from '../../types';
import { canUseDeep, isFn, isObj, nodupPush, noop, safeGet, setNoop } from '../../utils';
import { genFnKey } from '../common/key';
import { getDepKeyByPath, tryGetLoc } from '../common/util';

export interface IInnerOptions<T = any> {
  rawState: T | (() => T);
  forAtom?: boolean;
  forGlobal?: boolean;
  isLoading?: boolean;
  stateType?: string;
}

function markSharedKeyOnState(rawState: Dict) {
  injectHeluxProto(rawState);
  const sharedKey = markSharedKey(rawState); // now rawState marked shared key
  return sharedKey;
}

export function parseSetOptions<T = any>(options?: ISetStateOptions<T>) {
  if (!options) return;
  // filter valid props
  const { extraDeps, excludeDeps, desc, ids, globalIds } = options;
  return { extraDeps, excludeDeps, desc, ids, globalIds };
}

export function parseRawState(innerOptions: IInnerOptions) {
  const { forAtom = false } = innerOptions;
  let rawState: any = innerOptions.rawState;
  const isStateFn = isFn(rawState);
  if (forAtom) {
    rawState = isStateFn ? { val: rawState() } : { val: rawState };
  } else {
    rawState = isStateFn ? rawState() : rawState;
    if (!isObj(rawState)) {
      throw new Error('ERR_NON_OBJ: pass an non-object to createShared!');
    }
    if (getSharedKey(rawState)) {
      throw new Error('ERR_ALREADY_SHARED: pass a shared object to createShared!');
    }
  }
  return rawState;
}

export function parseDesc(fnKey: any, itemDesc?: any) {
  const desc = fnKey || itemDesc || genFnKey(FROM.MUTATE);
  return desc;
}

/**
 * 解析伴随创建share对象时配置的 mutate 对象
 */
function parseMutate(mutate?: IInnerCreateOptions['mutate'] | null) {
  const mutateFns: Array<MutateFnItem | AtomMutateFnItem> = []; // 额外存一份数组结构，方便后续遍历
  const mutateFnDict: Dict<MutateFnItem | AtomMutateFnItem> = {};
  const handleItem = (item: MutateFnItem | MutateFn, inputDesc?: string) => {
    let fnItem: MutateFnItem | AtomMutateFnItem | null = null;
    let desc = inputDesc || '';
    // 暂不考虑用户人为设置重复 desc 的问题
    if (isFn(item)) {
      if (item === noop) return;
      fnItem = { fn: item, deps: noop, desc };
    } else if (isObj(item)) {
      if (item.fn === noop) return;
      desc = inputDesc || item.desc || '';
      const { fn = noop, deps = noop, task } = item;
      fnItem = { fn, desc, deps, task };
    }

    if (fnItem) {
      if (mutateFnDict[desc]) {
        // TODO 开发环境提示用户 desc 重复
        desc = genFnKey(FROM.MUTATE);
      }
      mutateFnDict[desc] = fnItem; // 原始 desc 暂存到 fnItem 上保持不变
      mutateFns.push(fnItem);
    }
  };

  if (Array.isArray(mutate)) {
    if (mutate.length === 1) {
      handleItem(mutate[0], SINGLE_MUTATE); // 标记为单函数
    } else {
      mutate.forEach((item) => handleItem(item));
    }
  } else if (isFn(mutate)) {
    handleItem(mutate, SINGLE_MUTATE); // 标记为单函数
  } else if (isObj(mutate)) {
    Object.keys(mutate).forEach((key) => {
      handleItem(mutate[key], key);
    });
  }

  return { mutateFns, mutateFnDict };
}

export function parseOptions(innerOptions: IInnerOptions, options: ICreateOptions = {}) {
  const { forAtom = false, forGlobal = false, stateType = STATE_TYPE.USER_STATE } = innerOptions;
  const rawState = parseRawState(innerOptions);
  const sharedKey = markSharedKeyOnState(rawState);
  const moduleName = options.moduleName || '';
  const deep = options.deep ?? true;
  const exact = options.exact ?? true;
  const enableLoading = options.enableLoading ?? true;
  const loadingMode = options.loadingMode || LOADING_MODE.PRIVATE;
  const rules = options.rules || [];
  const before = options.before || noop;
  const mutate = options.mutate || noop;
  // 后续 parseRules 步骤会转 stopArrDep stopDepth 到 stopDepInfo 上
  const stopArrDep = options.stopArrDep ?? true;
  const stopDepth = options.stopDepth || STOP_DEPTH;
  const usefulName = moduleName || `${sharedKey}`;
  const loc = tryGetLoc(moduleName);
  const { mutateFnDict, mutateFns } = parseMutate(mutate);

  return {
    enableLoading,
    rawState,
    sharedKey,
    moduleName,
    usefulName,
    forAtom,
    forGlobal,
    loc,
    deep,
    exact,
    rules,
    before,
    mutate,
    mutateFnDict,
    mutateFns,
    stateType,
    loadingMode,
    stopArrDep,
    stopDepth,
  };
}

export type ParsedOptions = ReturnType<typeof parseOptions>;

/**
 * 解析出 createShared 里配置的 rules
 */
export function parseRules(options: ParsedOptions): IRuleConf {
  const { rawState, sharedKey, deep, rules, stopDepth, stopArrDep } = options;
  const idsDict: KeyIdsDict = {};
  const globalIdsDict: KeyIdsDict = {};
  const stopDepInfo: IRuleConf['stopDepInfo'] = { keys: [], isArrDict: {}, arrKeyStopDcit: {}, depth: stopDepth, stopArrDep };
  // 临时记录数组相关，后面步骤会转移到 stopDepInfo.isArrDict
  const isArrDict: KeyBoolDict = {};
  const isDeep = canUseDeep(deep);

  rules.forEach((rule) => {
    // when 函数执行完，会写入读取到的 key 列表
    const confKeys: string[] = [];
    const { when, ids = [], globalIds = [], stopDep } = rule;

    let state: any;
    let keyReaded = false;
    if (isDeep) {
      let pervKey = '';
      state = immut(rawState, {
        onOperate: ({ fullKeyPath, value, isBuiltInFnKey }) => {
          if (isBuiltInFnKey) return;
          // 只记录单一路径下读取的最长的那个key，
          // 即 a.b.c 行为会触发 ['a'] ['a','b'] ['a','b','c'] 3次 onOperate 操作
          // 但 confKeys 只记录['a','b','c'] 这一次生成的 key
          const confKey = getDepKeyByPath(fullKeyPath, sharedKey);
          if (pervKey && confKey.includes(pervKey)) {
            // 是一条路径中正在下钻的key，将之前的弹出
            confKeys.pop();
          }
          confKeys.push(confKey);
          isArrDict[confKey] = Array.isArray(value);
          pervKey = confKey;
          keyReaded = true;
        },
      });
    } else {
      state = createOb(rawState, {
        set: setNoop,
        get: (target: Dict, key: any) => {
          const confKey = getDepKeyByPath([key], sharedKey);
          confKeys.push(confKey);
          const value = target[key];
          isArrDict[confKey] = Array.isArray(value);
          keyReaded = true;
          return value;
        },
      });
    }

    const result = when(state);
    // record id, globalId, stopDep
    const setRuleConf = (confKey: string) => {
      const idList = safeGet(idsDict, confKey, [] as NumStrSymbol[]);
      ids.forEach((id) => nodupPush(idList, id));
      const globalIdList = safeGet(globalIdsDict, confKey, [] as NumStrSymbol[]);
      globalIds.forEach((id) => nodupPush(globalIdList, id));

      let stopKeyDep;
      if (isArrDict[confKey]) {
        stopKeyDep = stopDep ?? STOP_ARR_DEP; // 不配置的话，数组默认停止
        stopDepInfo.arrKeyStopDcit[confKey] = stopKeyDep; // 明确记录数组 key 的 stopDep 值
        stopDepInfo.isArrDict[confKey] = isArrDict[confKey];
      } else {
        stopKeyDep = stopDep ?? false;
      }

      if (stopKeyDep) {
        nodupPush(stopDepInfo.keys, confKey);
      }
    };
    confKeys.forEach(setRuleConf);

    // 为让 globalId 机制能够正常工作，需要补上 sharedKey
    if (
      keyReaded
      || result === state // 返回了state自身
      || (Array.isArray(result) && result.includes(state)) // 返回了数组，包含有state自身
    ) {
      setRuleConf(`${sharedKey}`);
    }
  });

  return { idsDict, globalIdsDict, stopDepInfo };
}

export function parseCreateMutateOpt(descOrOptions?: string | IRunMutateOptions) {
  const { out = true, desc = '', strict = false } = {};
  if (typeof descOrOptions === 'string') {
    return { out, desc: descOrOptions, strict };
  }
  return { out, desc, strict, ...descOrOptions };
}

export function parseWatchOptions(options?: WatchOptionsType) {
  let deps: WatchDepFn = noop;
  let immediate: boolean = false;

  if (isFn(options)) {
    deps = options;
  } else if (isObj(options)) {
    deps = options.deps || noop;
    immediate = options.immediate ?? false;
  }
  return { immediate, deps };
}
