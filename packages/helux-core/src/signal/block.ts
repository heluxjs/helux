import { noopAny } from '@helux/utils';
import { HELUX_BLOCK_PARAMS } from '../consts';
import type { CoreApiCtx } from '../types/api-ctx';
import type { BlockCb, BlockOptionsType, IBlockOptionsWithRead, IBlockParams } from '../types/base';
import { blockLogic, blockLogicWithRead } from './common/blockLogic';

/**
 * 生成 Block 组件，会自动绑定视图中的状态依赖
 */
export function block<P = object>(apiCtx: CoreApiCtx, cb: BlockCb<P>, options?: BlockOptionsType) {
  const Block = blockLogic({ apiCtx, isDynamic: false, cb }, options);
  return Block;
}

/**
 * 功能同 block，适用于在组件里调用动态生成组件的场景，会在组件销毁后自动释放掉占用的内存
 * 如果在组件里使用 block 生成组件，也能正常工作，但会额外占用一些不会释放的内存
 */
export function dynamicBlock<P = object>(apiCtx: CoreApiCtx, cb: BlockCb<P>, options?: BlockOptionsType) {
  const Block = blockLogic({ apiCtx, isDynamic: true, cb }, options);
  return Block;
}

/**
 * 功能同 dynamicBlock，内部专用函数
 */
export function dynamicBlockWithRead<P = object>(apiCtx: CoreApiCtx, cb: BlockCb<P>, options?: IBlockOptionsWithRead) {
  const Block = blockLogicWithRead({ apiCtx, isDynamic: true, cb }, options);
  return Block;
}

/**
 * 获取 props 上的 blockParams 参数，如果获取不到则返回一个假的参数，表标识 isFake=true
 * @param props
 * @returns
 */
export function getBlockParams(props: any) {
  const noop: any = noopAny;
  const fake: IBlockParams = { props, status: { loading: false, err: null, ok: true }, read: noop, isFake: true };
  if (!props) {
    return fake;
  }

  return props[HELUX_BLOCK_PARAMS] || fake;
}
