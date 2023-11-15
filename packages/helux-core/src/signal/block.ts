import type { CoreApiCtx } from '../types/api-ctx';
import type { BlockCb, BlockStatusCb, IBlockOptions } from '../types/base';
import { blockLogic, blockStatusLogic } from './common/blockLogic';

/**
 * 生成 Block 组件，会自动绑定视图中的状态依赖
 */
export function block<P = object>(apiCtx: CoreApiCtx, cb: BlockCb<P>, options?: IBlockOptions<P>) {
  const Block = blockLogic({ apiCtx, isDynamic: false, cb }, options);
  return Block;
}

/**
 * 功能同 block，适用于在组件里调用动态生成组件的场景，会在组件销毁后自动释放掉占用的内存
 * 如果在组件里使用 block 生成组件，也能正常工作，但会额外占用一些不会释放的内存
 */
export function dynamicBlock<P = object>(apiCtx: CoreApiCtx, cb: BlockCb<P>, options?: IBlockOptions<P>) {
  const Block = blockLogic({ apiCtx, isDynamic: true, cb }, options);
  return Block;
}

/**
 * 生成会透传 isCommputing 表示计算状态的 Block 组件，会自动绑定视图中的状态依赖
 */
export function blockStatus<P = object>(apiCtx: CoreApiCtx, cb: BlockStatusCb<P>, options?: IBlockOptions<P>) {
  const Block = blockStatusLogic({ apiCtx, isDynamic: false, cb }, options);
  return Block;
}

/**
 * 功能同 blockStatus，适用于在组件里调用动态生成组件的场景，会在组件销毁后自动释放掉占用的内存
 * 如果在组件里使用 blockStatus 生成组件，也能正常工作，但会额外占用一些不会释放的内存
 */
export function dynamicBlockStatus<P = object>(apiCtx: CoreApiCtx, cb: BlockStatusCb<P>, options?: IBlockOptions<P>) {
  const Block = blockStatusLogic({ apiCtx, isDynamic: true, cb }, options);
  return Block;
}
