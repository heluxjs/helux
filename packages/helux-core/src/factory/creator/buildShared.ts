import { warn } from '@helux/utils';
import type { IOperateParams } from 'limu';
import { immut } from 'limu';
import { HAS_PROXY, IS_ATOM, OP_KEYS, SHARED_KEY } from '../../consts';
import { recordBlockDepKey } from '../../helpers/blockDep';
import { recordFnDepKeys } from '../../helpers/fnDep';
import { createDpOb, createOb } from '../../helpers/obj';
import { mapSharedState } from '../../helpers/state';
import type { Dict } from '../../types/base';
import { recordLastest } from '../common/blockScope';
import { newOpParams } from '../common/ctor';
import { callOnRead, getDepKeyByPath, isDict } from '../common/util';
import type { ParsedOptions } from './parse';

function cannotSet() {
  warn('changing shared state is invalid');
  return true;
}

/** no options arg here */
export function handleHeluxKey(isRoot: boolean, forAtom: boolean, sharedKey: number, key: any, value: any) {
  if (key === IS_ATOM) {
    // 仅根节点才读取 isAtom 表示是否是 atom 对象，其他节点一律返回 false
    return isRoot ? forAtom : false;
  }
  if (key === SHARED_KEY) {
    return sharedKey;
  }
  return value;
}

export function handleCustomKey(opParams: IOperateParams, forAtom: boolean, sharedKey: number) {
  opParams.replaceValue(handleHeluxKey(opParams.keyPath.length === 0, forAtom, sharedKey, opParams.key, opParams.value));
}

/**
 * 创建全局使用的共享对象，可提供给 useAtom useDerived useWatch derived watch 函数使用
 */
export function buildSharedState(options: ParsedOptions) {
  let sharedRoot: any = {};
  const { rawState, sharedKey, forAtom, onRead, isPrimitive, stopDepth } = options;
  const collectDep = (keyPath: string[], val: any) => {
    const depKey = getDepKeyByPath(keyPath, sharedKey);
    // using shared state in derived/watch callback
    recordFnDepKeys([depKey], { sharedKey, kv: { [depKey]: val } });
    recordBlockDepKey([depKey]);
    recordLastest(sharedKey, val, sharedRoot, depKey, keyPath);
  };

  if (HAS_PROXY) {
    // Proxy 环境使用 limu.immut 接口创建具有能自动同步最新数据特性的只可读对象
    sharedRoot = immut(rawState, {
      customKeys: OP_KEYS,
      onOperate: (params: IOperateParams) => {
        const { isBuiltInFnKey, isCustom } = params;
        if (isCustom) {
          return handleCustomKey(params, forAtom, sharedKey);
        }
        if (!isBuiltInFnKey) {
          const { fullKeyPath } = params;
          const val = callOnRead(params, onRead);
          collectDep(fullKeyPath, val);
        }
      },
      compareVer: true,
    });
  } else {
    // TODO 这段逻辑迁移到 helux-mini
    // 非 Proxy 环境功能受限，可能这些代码可能会删除
    const toShallowProxy = (obj: any, keyLevel: number, parentKeyPath: string[]): any =>
      createDpOb(obj, {
        set: cannotSet,
        get: (target: Dict, key: any) => {
          const value = target[key];
          if (OP_KEYS.includes(key)) {
            return handleHeluxKey(keyLevel === 1, forAtom, sharedKey, key, value);
          }
          const opParams = newOpParams(key, value, { isChanged: false, parentKeyPath });
          // 为 {} 字典的 atom.val 再包一层监听
          if (keyLevel < stopDepth && isDict(value)) {
            return toShallowProxy(value, keyLevel + 1, opParams.fullKeyPath);
          }

          const rawVal = callOnRead(opParams, onRead);
          collectDep(opParams.fullKeyPath, rawVal);
          return rawVal;
        },
      });

    sharedRoot = toShallowProxy(rawState, 1, []);
  }

  let sharedState = sharedRoot;
  if (forAtom) {
    if (isPrimitive) {
      sharedState = rawState.val;
    } else {
      // TODO 非 Proxy 环境功能受限，如何对齐 Proxy 用法还有很多工作要做，可能这些代码可能会删除
      // 1 当前只支持 val 为字典，如果 Map List，写法要调整
      sharedState = createOb(rawState, {
        set: cannotSet,
        get: (t: any, k: any) => sharedRoot.val[k],
      });
    }
  }

  mapSharedState(sharedKey, sharedRoot);
  return { sharedRoot, sharedState };
}
