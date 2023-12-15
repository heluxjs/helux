import { setVal, getVal } from '@helux/utils';
import { createOneLevelOb } from '../../helpers/obj';
import type { Dict, IInnerSetStateOptions } from '../../types/base';
import { OP_KEYS } from '../../consts';
import { newMutateCtx, newOpParams, isDict, getDataType } from '../common/util';
import type { TInternal } from './buildInternal';
import { handleHeluxKey } from './buildShared';
import { DRAFT_ROOT, MUTATE_CTX } from './current';
import { execFinish } from './mutateDeep';
import { handleOperate } from './operateState';

interface IPrepareDowngradeMutateOpts extends IInnerSetStateOptions {
  internal: TInternal;
  forAtom: boolean;
}

/**
 * 非deep模式下，只是用Proxy或defineProperty生成一个仅代理一层的超过对象
 * 此时如果修改2层路径以上的值会修改原对象
 */
export function prepareDowngradeMutate(opts: IPrepareDowngradeMutateOpts) {
  const { internal } = opts;
  const { rawState, sharedKey, forAtom, stopDepth } = internal;
  // shallow copy rawState
  const copied: Dict = { ...rawState };
  const mutateCtx = newMutateCtx(opts);
  const commitOpts = { state: {}, mutateCtx, ...opts };
  const handleValueChange = (target: Dict, key: any, value: any, parentKeyPath: string[]) => {
    const opParams = newOpParams(key, value, { parentType: getDataType(target), parentKeyPath });
    handleOperate(opParams, { internal, mutateCtx });
    setVal(copied, opParams.fullKeyPath, value);
  };

  // ATTENTION LABEL ( non-deep )
  // 非 deep 存在的意义主要是为了支持无 Proxy 的运行环境 
  // 很多行为都会有缺失，考虑如何和 deep 完全对齐还是一个正在进行中的工作，欢迎测试，现阶段暂不推荐使用
  const toShallowProxy = (obj: any, keyLevel: number, parentKeyPath: string[]): any => createOneLevelOb(obj, {
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
  DRAFT_ROOT.set(downgradeDraft);
  MUTATE_CTX.set(mutateCtx);
  const draftNode = forAtom ? downgradeDraft.val : downgradeDraft;

  return {
    draftRoot: downgradeDraft,
    draftNode,
    finishMutate(partial?: Dict, innerSetOptions: IInnerSetStateOptions = {}) {
      execFinish(commitOpts, downgradeDraft, draftNode, partial, innerSetOptions);
    },
  };
}
