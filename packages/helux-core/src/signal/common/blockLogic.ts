import type { ForwardedRef } from 'helux-types';
import { noop } from 'helux-utils';
import { initBlockCtx } from '../../helpers/blockCtx';
import type { CoreApiCtx } from '../../types/api-ctx';
import type { BlockCb, IBlockOptions } from '../../types/base';
import { useDelBlockCtxEffect, useDep, useIsFirstRender } from './hook';
import { callBlockCb, makeBlockComp, markBlockAndRunCb, renderResult } from './util';

interface IInnerBlockOptions<P = object> {
  apiCtx: CoreApiCtx;
  cb: BlockCb<P>;
  isDynamic: boolean;
}

const fakeStatus = { loading: false, err: null, ok: true };

/**
 * block with compute status，功能同block，但会透传计算状态给回调函数的接口
 */
export function blockStatusLogic<P = object>(innerOptions: IInnerBlockOptions<P>, options?: IBlockOptions<P>) {
  const { cb, isDynamic, apiCtx } = innerOptions;
  const blockCtx = initBlockCtx(isDynamic);
  const useDelCtxEffect = isDynamic ? useDelBlockCtxEffect : noop;
  const Block = makeBlockComp(
    apiCtx,
    blockCtx,
    () => {
      // user may wrap Block with React.forwardRef
      return (props: any, ref: ForwardedRef<any>) => {
        const isfRef = useIsFirstRender(apiCtx, blockCtx, isDynamic);
        const isFirstRender = isfRef.current.isFirst;

        // call callBlockCb 2 times, but the cb will been only executed one time
        let result = callBlockCb(apiCtx, blockCtx, { isDynamic, cb, props, ref, isFirstRender, isHeadCall: true, status: fakeStatus });
        const status = useDep(apiCtx, blockCtx, true);
        useDelCtxEffect(apiCtx, blockCtx, isDynamic);
        result = callBlockCb(apiCtx, blockCtx, { isDynamic, cb, props, ref, isFirstRender, isHeadCall: false, status, result });
        isfRef.current.isFirst = false;

        return result;
      };
    },
    options,
  );

  return Block;
}

/**
 * 用户在组件里调用，推荐使用 dynamicBlock 替代 block
 * 如果非要在组件里使用 block 生成组件，也能正常工作，但会额外占用一些不会释放的内存
 */
export function blockLogic<P = object>(innerOptions: IInnerBlockOptions<P>, options?: IBlockOptions<P>) {
  const { isDynamic, cb, apiCtx } = innerOptions;
  const useDelCtxEffect = isDynamic ? useDelBlockCtxEffect : noop;
  const blockCtx = initBlockCtx(isDynamic);
  const Block = makeBlockComp(
    apiCtx,
    blockCtx,
    () => {
      // user may wrap Block with React.forwardRef
      return (props: any, ref: ForwardedRef<any>) => {
        const result = markBlockAndRunCb(blockCtx, { isDynamic, cb, props, ref, status: fakeStatus });
        useDep(apiCtx, blockCtx);
        useDelCtxEffect(apiCtx, blockCtx, isDynamic);
        return renderResult(apiCtx, blockCtx, result);
      };
    },
    options,
  );

  return Block;
}
