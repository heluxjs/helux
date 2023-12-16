import { getVal, isDebug, isFn, isMap, isObj, isProxyAvailable, noop, prefixValKey } from '@helux/utils';
import { immut, IOperateParams, limuUtils } from 'limu';
import { ARR, FROM, KEY_SPLITER, MAP, STATE_TYPE } from '../../consts';
import { createOb } from '../../helpers/obj';
import type { Dict, IInnerSetStateOptions, IMutateCtx } from '../../types/base';
import { DepKeyInfo } from '../../types/inner';
import type { TInternal } from '../creator/buildInternal';

const { USER_STATE } = STATE_TYPE;
const { SET_STATE } = FROM;
const fakeGetReplaced = () => ({ isReplaced: false, replacedValue: null as any });

// for hot reload of buildShared
/**
 * 考虑到有伴生状态的存在，这里取6
 */
export function tryGetLoc(moduleName: string, endCutIdx = 8) {
  let loc = '';
  if (isDebug() && moduleName) {
    try {
      throw new Error('loc');
    } catch (err: any) {
      const arr = err.stack.split('\n');
      const pureArr = arr.map((codeLoc: string) => {
        return codeLoc.substring(0, codeLoc.indexOf('(')).trim();
      });
      loc = pureArr.slice(4, endCutIdx).join(' -> ');
    }
  }
  return loc;
}

export function newMutateCtx(options: IInnerSetStateOptions): IMutateCtx {
  const { ids = [], globalIds = [], isReactive = false, from = SET_STATE, enableDep = false } = options; // 用户 setState 可能设定了 ids globalIds
  return {
    depKeys: [],
    forcedDepKeys: [],
    triggerReasons: [],
    ids,
    globalIds,
    readKeys: {},
    writeKeys: {},
    arrKeyDict: {}, // 记录读取过程中遇到的数组 key
    writeKeyPathInfo: {},
    handleAtomCbReturn: true,
    draftVal: null,
    from,
    isReactive,
    enableDep,
  };
}

export function newOpParams(
  key: string,
  value: any,
  options: { isChanged?: boolean; parentKeyPath: string[]; op?: any; parentType?: any },
): IOperateParams {
  const { isChanged = true, parentKeyPath = [], op = 'set', parentType = 'Object' } = options;
  const fullKeyPath = parentKeyPath.slice();
  fullKeyPath.push(key);
  return {
    isChanged,
    isCustom: false,
    op,
    immutBase: false,
    key,
    value,
    proxyValue: value,
    parentType,
    keyPath: parentKeyPath,
    fullKeyPath,
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
  try {
    return prefixValKey(fullKeyPath.join(KEY_SPLITER), sharedKey);
  } catch (err) {
    console.warn('found Symbol key in your path :', fullKeyPath);
    return `${sharedKey}`;
  }
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
    return immut(obj, { onOperate, compareVer: true });
  }

  // TODO  整合 toShallowProxy 为一个公共方法，并复用到此处
  return createOb(obj, {
    get(target, key) {
      const val = target[key];
      const op = newOpParams(key, val, { isChanged: false, parentKeyPath: [] });
      onOperate(op);
      return val;
    },
  });
}

/**
 * 区分是 atom 还是 shared 返回的部分状态，atom 返回要自动装箱为 { val: T }
 */
export function wrapPartial(forAtom: boolean, val: any) {
  if (val === undefined) return; // undefined 丢弃
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
  let { value } = opParams;
  // 触发用户定义的钩子函数
  if (onRead) {
    onRead(opParams);
    const { replacedValue, isReplaced } = opParams.getReplaced();
    if (isReplaced) {
      value = replacedValue;
    }
  }
  return value;
}

export function isArrLike(parentType?: string) {
  // @ts-ignore
  return [ARR, MAP].includes(parentType);
}

export function isArrLikeVal(val: any) {
  return Array.isArray(val) || isMap(val);
}

export const { isObject: isDict, getDataType } = limuUtils;
