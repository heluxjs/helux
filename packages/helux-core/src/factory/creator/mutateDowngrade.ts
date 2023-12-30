import { getVal, setVal } from '@helux/utils';
import { OP_KEYS } from '../../consts';
import { createDpOb } from '../../helpers/obj';
import type { Dict, IInnerSetStateOptions } from '../../types/base';
import { newMutateCtx, newOpParams } from '../common/ctor';
import { getDataType, isDict } from '../common/util';
import { handleHeluxKey } from './buildShared';
import { DRAFT_ROOT, MUTATE_CTX } from './current';
import type { IPrepareMutateOpts } from './mutateDeep';
import { execFinish, fillMutateCtx } from './mutateDeep';
import { handleOperate } from './operateState';

/**
 * 还处于测试阶段，此降级方案可能后续移除
 * 非deep模式下，只是用Proxy或defineProperty生成一个仅代理一层的超过对象
 * 此时如果修改2层路径以上的值会修改原对象
 */
export function prepareDowngradeMutate(opts: IPrepareMutateOpts) {
  const { internal, setFactoryOpts } = opts;
  const { rawState, forAtom, stopDepth, sharedKey } = internal;
  const mutateCtx = newMutateCtx(setFactoryOpts);
  // shallow copy rawState
  const copied: Dict = { ...rawState };
  const handleValueChange = (target: Dict, key: any, value: any, parentKeyPath: string[]) => {
    const opParams = newOpParams(key, value, { parentType: getDataType(target), parentKeyPath });
    handleOperate(opParams, { internal, mutateCtx });
    setVal(copied, opParams.fullKeyPath, value);
  };

  // ATTENTION LABEL ( non-deep )
  // 非 deep 存在的意义主要是为了支持无 Proxy 的运行环境
  // 很多行为都会有缺失，例如监听数组 push，pop 等，
  // 考虑如何和 proxy 环境完全对齐是一个正在进行中且比较艰难的工作，3.0 版本阶段不推荐在非 proxy 环境使用 helux
  const toShallowProxy = (obj: any, keyLevel: number, parentKeyPath: string[]): any =>
    createDpOb(obj, {
      set: (target: Dict, key: any, value: any) => {
        handleValueChange(target, key, value, parentKeyPath);
        return true;
      },
      get: (target: Dict, key: any) => {
        const value = target[key];
        if (OP_KEYS.includes(key)) {
          return handleHeluxKey(keyLevel === 1, forAtom, sharedKey, key, value);
        }
        const opParams = newOpParams(key, value, { isChanged: false, parentKeyPath, op: 'get', parentType: getDataType(target) });
        // 为 {} 字典的 atom.val 再包一层监听
        if (keyLevel < stopDepth && isDict(value)) {
          return toShallowProxy(value, keyLevel + 1, opParams.fullKeyPath);
        }
        return getVal(copied, opParams.fullKeyPath);
      },
    });
  const downgradeDraft = toShallowProxy(copied, 1, []);
  // 记录正在执行中的 draftRoot mutateCtx
  DRAFT_ROOT.set(downgradeDraft, forAtom);
  MUTATE_CTX.set(mutateCtx);
  const draftNode = forAtom ? downgradeDraft.val : downgradeDraft;

  return {
    draftRoot: downgradeDraft,
    draftNode,
    finishMutate(partial?: Dict, innerSetOptions: IInnerSetStateOptions = {}) {
      fillMutateCtx(mutateCtx, innerSetOptions);
      const commitOpts = { state: {}, mutateCtx, ...opts };
      execFinish(commitOpts, downgradeDraft, draftNode, partial);
    },
  };
}
