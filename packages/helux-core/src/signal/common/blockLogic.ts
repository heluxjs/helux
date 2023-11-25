import type { ForwardedRef } from '@helux/types';
import { noop } from '@helux/utils';
import { parseBlockOptions } from '../../factory/creator/parse';
import { initBlockCtx } from '../../helpers/blockCtx';
import type { CoreApiCtx } from '../../types/api-ctx';
import type { BlockCb, BlockOptionsType, IBlockCtx, IBlockOptions } from '../../types/base';
import { useDelBlockCtxEffect, useDep } from './hook';
import { makeBlockComp, markBlockAndRunCb, renderResult } from './util';

interface IInnerBlockOptions<P = object> {
  apiCtx: CoreApiCtx;
  cb: BlockCb<P>;
  /** 动态组件销毁后会有 block 上下文清理动作 */
  isDynamic: boolean;
}
interface IBlockLogicOptions<P = object> extends IInnerBlockOptions<P> {
  blockCtx: IBlockCtx;
}

/**
 * 不响应 status 的 block 逻辑
 */
export function blockNormalLogic<P = object>(innerOptions: IBlockLogicOptions<P>, options: IBlockOptions<P>) {
  const { cb, isDynamic, apiCtx, blockCtx } = innerOptions;
  const { useForceUpdate } = apiCtx.hookImpl;
  const useDelCtxEffect = isDynamic ? useDelBlockCtxEffect : noop;

  return makeBlockComp(
    apiCtx,
    blockCtx,
    () => {
      return (props: any, inputRef: ForwardedRef<any>) => {
        const ref = blockCtx.ref || inputRef;
        const result = markBlockAndRunCb(blockCtx, { isDynamic, cb, props, ref });
        const forceUpdate = useForceUpdate();
        useDep(apiCtx, blockCtx, forceUpdate);
        useDelCtxEffect(apiCtx, blockCtx, isDynamic);
        return renderResult(apiCtx, blockCtx, result);
      };
    },
    options,
  );
}

/**
 * 响应 status 的 block 逻辑
 */
export function blockStatusLogic<P = object>(innerOptions: IBlockLogicOptions<P>, options: IBlockOptions<P>) {
  const { cb, isDynamic, apiCtx, blockCtx } = innerOptions;
  const useDelCtxEffect = isDynamic ? useDelBlockCtxEffect : noop;
  const { useForceUpdate } = apiCtx.hookImpl;
  const { useEffect } = apiCtx.react;

  return makeBlockComp(
    apiCtx,
    blockCtx,
    () => {
      return (props: any, inputRef: ForwardedRef<any>) => {
        const ref = blockCtx.ref || inputRef;
        const result = markBlockAndRunCb(blockCtx, { isDynamic, cb, props, ref });
        const forceUpdate = useForceUpdate();
        const status = useDep(apiCtx, blockCtx, forceUpdate);
        useDelCtxEffect(apiCtx, blockCtx, isDynamic);

        const prevLoading = blockCtx.status.loading;
        const currLoading = status.loading;
        useEffect(() => {
          if (prevLoading !== currLoading) {
            forceUpdate();
          }
          // only loading dep is ok
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [prevLoading, currLoading]);
        blockCtx.status = status;
        return renderResult(apiCtx, blockCtx, result);
      };
    },
    options,
  );
}

/**
 * 用户在组件里调用，推荐使用 dynamicBlock 替代 block
 * 如果非要在组件里使用 block 生成组件，也能正常工作，但会额外占用一些不会释放的内存
 */
export function blockLogic<P = object>(innerOptions: IInnerBlockOptions<P>, blockOptions?: BlockOptionsType) {
  const stdOptions = parseBlockOptions(blockOptions);
  const { enableStatus } = stdOptions;
  const logicOpts = { ...innerOptions, blockCtx: initBlockCtx(innerOptions.isDynamic, enableStatus) };

  if (!enableStatus) {
    return blockNormalLogic(logicOpts, stdOptions);
  }

  return blockStatusLogic(logicOpts, stdOptions);
}
