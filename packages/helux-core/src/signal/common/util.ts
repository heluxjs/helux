import { IS_BLOCK } from '../../consts';
import { getAtom, isDerivedAtom } from '../../factory/common/atom';
import { markBlockFnEnd, markBlockFnStart } from '../../helpers/blockCtx';
import { react } from '../../react';
import type { Dict, Fn, IBlockCtx, IBlockOptions, LoadingStatus } from '../../types';
import type { ForwardedRef } from '../../types-react';
import { wrapComp, wrapDerivedAtomSignalComp } from './wrap';
import { noopArgs } from '../../utils';

interface IMarkBlockAndRunCbOptions {
  isDynamic: boolean;
  cb: Fn;
  props: Dict;
  ref: ForwardedRef<any>;
  status: LoadingStatus;
}

interface ICallBlockCbOptions extends IMarkBlockAndRunCbOptions {
  isFirstRender: boolean;
  isHeadCall: boolean;
  result?: any;
}

export function markBlockAndRunCb(blockCtx: IBlockCtx, options: IMarkBlockAndRunCbOptions) {
  const { isDynamic, cb, props, ref, status } = options;
  // start to collect dep
  if (!blockCtx.collected) {
    markBlockFnStart(blockCtx, isDynamic);
  }
  // 渲染函数内部存在判断逻辑时，可使用 read 提前锁定住相关依赖
  const result = cb({ ...props, status, read: noopArgs }, ref) || '';
  if (!blockCtx.collected) {
    markBlockFnEnd(blockCtx);
  }
  return result;
}

export function callBlockCb(blockCtx: IBlockCtx, options: ICallBlockCbOptions) {
  const { cb, props, ref, isFirstRender, isHeadCall, status } = options;
  if (isFirstRender) {
    if (!isHeadCall) {
      return options.result; // call at function buttom, return head call's result
    }
    const result = markBlockAndRunCb(blockCtx, options);
    return renderResult(blockCtx, result);
  }

  if (!isHeadCall) {
    const blockProps = { ...props, status, read: noopArgs };
    const result = cb(blockProps, ref) || '';
    return renderResult(blockCtx, result);
  }

  return '';
}

export function renderResult(blockCtx: IBlockCtx, result: any) {
  const isDerivedAtomResult = isDerivedAtom(result);

  if (blockCtx.renderAtomOnce && !isDerivedAtomResult) {
    // 防止结果变异，导致 hook 顺序被混乱
    throw new Error('block cb once returned derived atom but not keep to return it in new render period!');
  }

  if (isDerivedAtomResult) {
    blockCtx.renderAtomOnce = true;
    const Comp = wrapDerivedAtomSignalComp(result);
    // TODO CHECK
    return react.createElement(Comp, { status: { loading: false, err: null, ok: true } });
  }
  // 内部自动尝试拆箱 atom
  return getAtom(result as any);
}

export function makeBlockComp<P = object>(blockCtx: IBlockCtx, defComp: Fn, options?: IBlockOptions<P>) {
  const { memo = true, compare } = options || {};
  const CompRender = defComp(blockCtx);
  const Block = wrapComp(CompRender, 'HeluxBlock', memo, compare);
  // @ts-ignore
  Block[IS_BLOCK] = true;
  return Block;
}
