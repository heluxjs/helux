import type { ForwardedRef } from '@helux/types';
import { has, isDebug, noop, noopArgs } from '@helux/utils';
import { IS_BLOCK } from '../../consts';
import { getAtom, isDerivedAtom } from '../../factory/common/atom';
import { markBlockFnEnd, markBlockFnStart } from '../../helpers/blockCtx';
import type { CoreApiCtx } from '../../types/api-ctx';
import type { Dict, Fn, IBlockCtx, IBlockOptions } from '../../types/base';
import { wrapDerivedAtomSignalComp } from './wrap';

interface IMarkBlockAndRunCbOptions {
  isDynamic: boolean;
  cb: Fn;
  props: Dict;
  ref: ForwardedRef<any>;
}

export function markBlockAndRunCb(blockCtx: IBlockCtx, options: IMarkBlockAndRunCbOptions) {
  const { isDynamic, cb, props, ref } = options;
  const { collected, status } = blockCtx;
  // start to collect dep
  if (!collected) {
    markBlockFnStart(blockCtx, isDynamic);
  }
  // 渲染函数内部存在判断逻辑时，可使用 read 提前锁定住相关依赖
  const blockParams = { props, status, read: noopArgs, ref };
  const result = cb(props, blockParams) || '';
  if (!collected) {
    markBlockFnEnd(blockCtx);
  }
  return result;
}

export function renderResult(apiCtx: CoreApiCtx, blockCtx: IBlockCtx, result: any) {
  const isDerivedAtomResult = isDerivedAtom(result);

  if (blockCtx.renderAtomOnce && !isDerivedAtomResult) {
    // 防止结果变异，导致 hook 顺序被混乱
    throw new Error('block cb once returned derived atom but not keep to return it in new render period!');
  }

  if (isDerivedAtomResult) {
    blockCtx.renderAtomOnce = true;
    const Comp = wrapDerivedAtomSignalComp(apiCtx, result);
    return apiCtx.react.createElement(Comp, { status: { loading: false, err: null, ok: true } });
  }
  // 内部自动尝试拆箱 atom
  return getAtom(result as any);
}

export function makeBlockComp<P = object>(apiCtx: CoreApiCtx, blockCtx: IBlockCtx, factory: Fn, options?: IBlockOptions<P>) {
  const { memo = true, compare } = options || {};
  const { key } = blockCtx;
  const { react } = apiCtx;
  const forwardRef = react.forwardRef || noop;
  const Comp = factory();

  // allow pass ref to block component
  let RefComp = forwardRef(Comp);
  // to let hot reload works well at debug mode, we give a key to comp,
  // so that user can change block cb data binding logic whatever they want at dev mode
  if (isDebug()) {
    Comp.displayName = 'HeluxKeyedBlockForHMR';
    RefComp = forwardRef((props: any, ref: any) => {
      // cannot pass ref to props, so we store ref to blockCtx
      // and then we can get ref from the closure blockCtx at dev mode
      if (ref && has(ref, 'current')) {
        // 热加载模式下，调整代码后，会触发 ref 为 {}，这里做一次额外的检查
        blockCtx.ref = ref;
      }
      return react.createElement(Comp, { ...props, key });
    });
  }

  const Block = memo ? react.memo(RefComp, compare) : RefComp;
  Block.displayName = 'HeluxBlock';
  // @ts-ignore
  Block[IS_BLOCK] = true;
  return Block;
}
