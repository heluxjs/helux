import { canUseDeep, enureReturnArr, isDebug, isFn, isJsObj, isObj, nodupPush, noop, noopArr, safeObjGet, setNoop } from '@helux/utils';
import { immut } from 'limu';
import { FROM, MUTATE_FN_ITEM, RECORD_LOADING, SINGLE_MUTATE, STATE_TYPE, STOP_ARR_DEP, STOP_DEPTH } from '../../consts';
import { createOb, injectHeluxProto } from '../../helpers/obj';
import { getSharedKey, markSharedKey } from '../../helpers/state';
import type { CoreApiCtx } from '../../types/api-ctx';
import type {
  BlockOptionsType,
  Dict,
  IBlockOptions,
  ICreateOptions,
  IInnerCreateOptions,
  IRuleConf,
  IRunMutateOptions,
  ISetStateOptions,
  KeyBoolDict,
  KeyIdsDict,
  MutateFn,
  MutateFnLooseItem,
  MutateFnStdDict,
  MutateFnStdItem,
  NumStrSymbol,
  WatchDepFn,
  WatchOptionsType,
} from '../../types/base';
import { genFnKey } from '../common/key';
import { getDepKeyByPath, tryGetLoc } from '../common/util';

export interface IInnerOptions<T = any> {
  apiCtx: CoreApiCtx;
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

export function pureSetOptions(options?: ISetStateOptions) {
  if (!options) return {};
  // filter valid props
  const { desc, ids, globalIds } = options;
  return { desc, ids, globalIds };
}

export function parseRawState(innerOptions: IInnerOptions) {
  const { forAtom = false } = innerOptions;
  let rawState: any = innerOptions.rawState;
  const isStateFn = isFn(rawState);
  let isPrimitive = false;
  if (forAtom) {
    rawState = isStateFn ? { val: rawState() } : { val: rawState };
    // 记录 atom 值的最初类型，如果是 undefined null 也当做原始类型记录
    // TODO disscussion 这里后续是否需要进一步细分待用户讨论
    isPrimitive = !rawState.val || !isJsObj(rawState.val);
  } else {
    rawState = isStateFn ? rawState() : rawState;
    if (!isObj(rawState)) {
      throw new Error('ERR_NON_OBJ: pass an non-object to createShared!');
    }
    if (getSharedKey(rawState)) {
      throw new Error('ERR_ALREADY_SHARED: pass a shared object to createShared!');
    }
  }
  return { isPrimitive, rawState };
}

export function parseDesc(fnKey: any, itemDesc?: any) {
  const desc = fnKey || itemDesc || genFnKey(FROM.MUTATE);
  return desc;
}

export function parseMutateFn(fnItem: Dict, inputDesc?: string, checkDupDict?: Dict) {
  let validItem: MutateFnStdItem | null = null;
  let desc = inputDesc || '';
  if (isFn(fnItem) && fnItem !== noop) {
    validItem = { [MUTATE_FN_ITEM]: 1, fn: fnItem, deps: noopArr, oriDesc: desc, desc, depKeys: [], checkDeadCycle: undefined };
  } else if (isObj(fnItem)) {
    const { fn, desc, deps, task, immediate, checkDeadCycle } = fnItem;
    const descVar = inputDesc || desc || '';
    const fnVar = isFn(fn) ? fn : undefined;
    const taskVar = isFn(task) ? task : undefined;
    const depsVar = isFn(deps) ? deps : noopArr;
    if (fn || task) {
      validItem = {
        [MUTATE_FN_ITEM]: 1,
        checkDeadCycle,
        fn: fnVar,
        desc: descVar,
        oriDesc: descVar,
        deps: depsVar,
        task: taskVar,
        immediate,
        depKeys: [],
      };
    }
  }

  if (validItem && checkDupDict) {
    const { oriDesc } = validItem;
    if (!oriDesc || checkDupDict[oriDesc]) {
      // TODO tip desc duplicated
      validItem.desc = genFnKey(FROM.MUTATE);
    }
  }

  return validItem;
}

/**
 * 解析伴随创建share对象时配置的 mutate 对象，如果传入已存在字典则写入
 */
export function parseMutate(mutate?: IInnerCreateOptions['mutate'] | null, cachedDict?: MutateFnStdDict) {
  const mutateFnDict: MutateFnStdDict = {};
  const checkDupDict: MutateFnStdDict = cachedDict || {};
  if (!mutate) return mutateFnDict;

  const handleItem = (item: MutateFnLooseItem | MutateFn, inputDesc?: string) => {
    const stdFn = parseMutateFn(item, inputDesc, checkDupDict);
    if (stdFn) {
      mutateFnDict[stdFn.desc] = stdFn;
      checkDupDict[stdFn.desc] = stdFn; // 如传递了 cachedDict，则存到透传的 cachedDict 里
    }
  };

  if (Array.isArray(mutate)) {
    if (mutate.length === 1) {
      const singleFn: any = mutate[0];
      const desc = (isObj(singleFn) ? singleFn.desc : '') || SINGLE_MUTATE;
      handleItem(mutate[0], desc); // 标记为单函数
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

  return mutateFnDict;
}

export function parseOptions(innerOptions: IInnerOptions, options: ICreateOptions = {}) {
  const { forAtom = false, forGlobal = false, stateType = STATE_TYPE.USER_STATE } = innerOptions;
  const { rawState, isPrimitive } = parseRawState(innerOptions);
  const sharedKey = markSharedKeyOnState(rawState);
  const moduleName = options.moduleName || '';
  const alertDeadCycleErr = options.alertDeadCycleErr ?? isDebug();
  const deep = options.deep ?? true;
  const checkDeadCycle = options.checkDeadCycle ?? true;
  const recordLoading = options.recordLoading || RECORD_LOADING.PRIVATE;
  const rules = options.rules || [];
  const before = options.before || noop;
  const mutate = options.mutate || noop;
  // 后续 parseRules 步骤会转 stopArrDep stopDepth 到 stopDepInfo 上
  const stopArrDep = options.stopArrDep ?? true;
  const stopDepth = options.stopDepth || STOP_DEPTH;
  const sharedKeyStr = `${sharedKey}`;
  const rootValKey = forAtom ? `${sharedKey}/val` : sharedKeyStr;
  const usefulName = moduleName || sharedKeyStr;
  const loc = tryGetLoc(moduleName);
  const mutateFnDict = parseMutate(mutate);

  return {
    /** TODO 未来支持 atom 对象销毁 */
    isDestroyed: false,
    alertDeadCycleErr,
    checkDeadCycle,
    rawState,
    sharedKey,
    sharedKeyStr,
    rootValKey,
    moduleName,
    usefulName,
    forAtom,
    forGlobal,
    loc,
    deep,
    rules,
    before,
    mutate,
    mutateFnDict,
    onRead: null as any, // 等待 setOnReadHook 写入
    stateType,
    recordLoading,
    stopArrDep,
    stopDepth,
    isPrimitive,
  };
}

export type ParsedOptions = ReturnType<typeof parseOptions>;

/**
 * 解析出 createShared 里配置的 rules
 */
export function parseRules(options: ParsedOptions): IRuleConf {
  const { rawState, sharedKey, rootValKey, deep, rules, stopDepth, stopArrDep, forAtom } = options;
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
          return value;
        },
      });
    }

    // atom 自动拆箱
    const stateNode = forAtom ? state.val : state;
    const result = enureReturnArr(when, stateNode);
    const pushId = (idsDict: KeyIdsDict, ids: NumStrSymbol[], confKey: string) => {
      const idList = safeObjGet(idsDict, confKey, [] as NumStrSymbol[]);
      ids.forEach((id) => nodupPush(idList, id));
    };

    // record id, globalId, stopDep
    const setRuleConf = (confKey: string) => {
      pushId(idsDict, ids, confKey);
      pushId(globalIdsDict, globalIds, confKey);

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

    // 返回的数组包含有根状态自身时，需补上 rootValKey
    if (result.includes(stateNode)) {
      setRuleConf(rootValKey);
    }
  });

  const hasIds = Object.keys(idsDict).length > 0;
  const hasGlobalIds = Object.keys(globalIdsDict).length > 0;
  return { hasIds, idsDict, hasGlobalIds, globalIdsDict, stopDepInfo };
}

export function parseCreateMutateOpt(descOrOptions?: string | IRunMutateOptions) {
  // 不设定 desc 的话，默认指向可能存在的单函数
  const { out = true, desc = SINGLE_MUTATE, strict = false } = {};
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

export function parseBlockOptions(options?: BlockOptionsType): IBlockOptions {
  if (!options) return {};
  if (typeof options === 'boolean') {
    return { enableStatus: options };
  }
  if (isObj(options)) {
    return options;
  }
  return {};
}
