import { getVal, isDebug, isFn, isMap, isObj, isProxyAvailable, noop, prefixValKey } from '@helux/utils';
import { immut, IOperateParams } from 'limu';
import { ARR, KEY_SPLITER, MAP, STATE_TYPE } from '../../consts';
import { createOb } from '../../helpers/obj';
import type { Dict, IInnerSetStateOptions, NumStrSymbol, TriggerReason } from '../../types/base';
import { DepKeyInfo } from '../../types/inner';
import type { TInternal } from '../creator/buildInternal';

const { USER_STATE } = STATE_TYPE;
const fakeGetReplaced = () => ({ isReplaced: false, replacedValue: null as any });
export interface IMutateCtx {
  /**
   * 为 shared 记录一个第一层的 key 值，用于刷新 immut 生成的 代理对象，
   * 刷新时机和具体解释见 factory/creator/commitState 逻辑
   */
  level1Key: string;
  depKeys: string[];
  triggerReasons: TriggerReason[];
  ids: NumStrSymbol[];
  globalIds: NumStrSymbol[];
  writeKeys: Dict;
  arrKeyDict: Dict;
  writeKeyPathInfo: Dict<TriggerReason>;
  /**
   * default: true
   * 是否处理 atom setState((draft)=>xxx) 返回结果xxx，
   * 目前规则是修改了 draft 则 handleAtomCbReturn 被会置为 false，
   * 避免无括号写法 draft=>draft.xx = 1 隐式返回的结果 1 被写入到草稿，
   * 备注：安全写法应该是draft=>{draft.xx = 1}
   */
  handleAtomCbReturn: boolean;
  /**
   * TODO ：记录变化值的路径，用于异步执行环境合并到 rawState 时，仅合并变化的那一部分节点，避免数据脏写
   * 但异步执行环境直接修改 draft 本身就是很危险的行为，该特性需要慎重考虑是否要实现
   */
  keyPathValue: Map<string[], any>;
  /** 为 atom 记录的 draft.val 引用 */
  draftVal: any;
  enableDraftDep: boolean;
  isReactive: boolean;
}

// for hot reload of buildShared
export function tryGetLoc(moduleName: string, startCutIdx = 4) {
  let loc = '';
  if (isDebug() && moduleName) {
    try {
      throw new Error('loc');
    } catch (err: any) {
      const arr = err.stack.split('\n');
      const pureArr = arr.map((codeLoc: string) => {
        return codeLoc.substring(0, codeLoc.indexOf('(')).trim();
      });
      loc = pureArr.slice(startCutIdx, 8).join(' -> ');
    }
  }
  return loc;
}

export function newMutateCtx(options: IInnerSetStateOptions): IMutateCtx {
  const { ids = [], globalIds = [], enableDraftDep = false, isReactive = false } = options; // 用户 setState 可能设定了 ids globalIds
  return {
    level1Key: '',
    depKeys: [],
    triggerReasons: [],
    ids,
    globalIds,
    writeKeys: {},
    arrKeyDict: {}, // 记录读取过程中遇到的数组 key
    writeKeyPathInfo: {},
    keyPathValue: new Map(),
    handleAtomCbReturn: true,
    draftVal: null,
    enableDraftDep,
    isReactive,
  };
}

export function newOpParams(key: string, value: any, isChanged = true): IOperateParams {
  return {
    isChanged,
    op: 'set',
    key,
    value,
    proxyValue: value,
    parentType: 'Object',
    keyPath: [],
    fullKeyPath: [key],
    isBuiltInFnKey: false,
    replaceValue: noop,
    getReplaced: fakeGetReplaced,
  };
}

export function getDepKeyInfo(depKey: string): DepKeyInfo {
  const [sharedKey, rest] = depKey.split('/');
  const keyPath = rest.split(KEY_SPLITER);
  return { sharedKey: Number(sharedKey), keyPath, depKey };
}

/** 获取根值依赖 key 信息 */
export function getRootValDepKeyInfo(internal: TInternal) {
  const { sharedKey, forAtom } = internal;
  // deps 列表里的 atom 结果自动拆箱
  const suffix = forAtom ? '/val' : '';
  const keyPath = forAtom ? ['val'] : [];
  return { depKey: `${sharedKey}${suffix}`, keyPath, sharedKey };
}

export function getDepKeyByPath(fullKeyPath: string[], sharedKey: number) {
  return prefixValKey(fullKeyPath.join(KEY_SPLITER), sharedKey);
}

export function isValChanged(internal: TInternal, depKey: string) {
  const { snap, prevSnap, stateType } = internal;
  // 非用户状态，都返回 true（伴生状态有自己的key规则）
  if (USER_STATE !== stateType) {
    return true;
  }

  const { keyPath } = getDepKeyInfo(depKey);
  try {
    const currVal = getVal(snap, keyPath);
    const prevVal = getVal(prevSnap, keyPath);
    return currVal !== prevVal;
  } catch (err: any) {
    // 结构变异，出现了 read property of undefined 错误，返回值已变更，
    // 让函数执行报错且此错误由用户自己承担
    return true;
  }
}

export function createImmut(obj: Dict, onOperate: (op: IOperateParams) => void) {
  if (isProxyAvailable()) {
    return immut(obj, { onOperate });
  }

  return createOb(obj, {
    get(target, key) {
      const val = target[key];
      const op = newOpParams(key, val, false);
      onOperate(op);
      return val;
    },
  });
}

/**
 * 区分是 atom 还是 shared 返回的部分状态，atom 返回要自动装箱为 { val: T }
 */
export function wrapPartial(forAtom: boolean, val: any) {
  if (val === undefined) return; // undefined 丢弃，如真需要赋值 undefined，调用 setAtomVal
  if (forAtom) return { val };
  if (isObj(val)) return val;
}

/**
 * 处理 setState(()=>({...})) 和 setState({...}) 两种情况返回的部分状态
 */
export function runPartialCb(forAtom: boolean, mayCb: any, draft: any) {
  const val = !isFn(mayCb) ? mayCb : mayCb(draft);
  return wrapPartial(forAtom, val);
}

export function callOnRead(opParams: IOperateParams, onRead: any) {
  let { value, proxyValue } = opParams;
  // 触发用户定义的钩子函数
  if (onRead) {
    onRead(opParams);
    const { replacedValue, isReplaced } = opParams.getReplaced();
    if (isReplaced) {
      proxyValue = replacedValue;
      value = replacedValue;
    }
  }
  return { rawVal: value, proxyValue };
}

export function isArrLike(parentType?: string) {
  // @ts-ignore
  return [ARR, MAP].includes(parentType);
}

export function isArrLikeVal(val: any) {
  return Array.isArray(val) || isMap(val);
}
