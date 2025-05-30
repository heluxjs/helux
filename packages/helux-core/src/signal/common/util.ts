import type { ForwardedRef } from '@helux/types';
import { has, isDebug, isFn, isPlainObj, noop, noopArr } from '@helux/utils';
import { getApiCtx } from '../../common/transfer';
import { HELUX_BLOCK_PARAMS, IS_BLOCK } from '../../consts';
import { getAtom, isDerivedAtom } from '../../factory/common/atom';
import { markBlockFnEnd, markBlockFnStart } from '../../helpers/blockCtx';
import type { CoreApiCtx } from '../../types/api-ctx';
import type { Dict, Fn, IBlockCtx, IBlockOptionsWithRead, IBlockParams, RenderCbType } from '../../types/base';
import { wrapDerivedAtomSignalComp } from './wrap';

interface IMarkBlockAndRunCbOptions {
  isDynamic: boolean;
  cb: Fn;
  props: Dict;
  ref: ForwardedRef<any>;
  /** 来自 BlockView 透传的其他属性 */
  viewProps: any;
  /** 外部透传的读函数，用户辅助锁定依赖 */
  read?: Fn;
  /** 是否需要用 createElement 来渲染 */
  cbType?: RenderCbType;
}

function ensureReadResult(read: any) {
  if (!isFn(read)) {
    return null;
  }
  const result = read();
  if (!isPlainObj(result)) {
    return null;
  }

  return result;
}

export const noopVal = (val: any) => val;

export function markBlockAndRunCb(blockCtx: IBlockCtx, options: IMarkBlockAndRunCbOptions) {
  const { isDynamic, cb, ref, read, viewProps, cbType = 'normal' } = options;
  const { collected, status } = blockCtx;
  // start to collect dep
  if (!collected) {
    markBlockFnStart(blockCtx, isDynamic);
  }
  // 透传了 read 时，props 即是 read 返回结果，执行完 read 即锁定外部设定的依赖也获得 props
  const props = ensureReadResult(read) || options.props || {};
  // 渲染函数内部存在判断逻辑时，可使用 read 提前锁定住相关依赖
  const blockParams: IBlockParams = { props, status, read: noopArr as any, isFake: false };
  // block 相关参数会注入到 HELUX_BLOCK_PARAMS 属性上，可通过 getBlockParams 获取
  const propsToComp = { ...viewProps, ...props, [HELUX_BLOCK_PARAMS]: blockParams };
  // cb 执行时，用户可通过调用 blockParams.read 继续锁定更多依赖
  let result;
  if (cbType === 'forwardRef') {
    result = getApiCtx().react.createElement(cb, { ...propsToComp, ref }) || null;
  } else if (cbType === 'memo') {
    // 避免如下警告
    // Function components cannot be given refs.
    // Attempts to access this ref will fail. Did you mean to use React.forwardRef()
    result = getApiCtx().react.createElement(cb, propsToComp) || null;
  } else {
    result = cb(propsToComp, ref) || null;
  }
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
    const Comp = wrapDerivedAtomSignalComp(apiCtx, { result });
    return apiCtx.react.createElement(Comp, { status: { loading: false, err: null, ok: true } });
  }
  // 内部自动尝试拆箱 atom
  return getAtom(result as any);
}

export function makeBlockComp<P = object>(apiCtx: CoreApiCtx, blockCtx: IBlockCtx, factory: Fn, options: IBlockOptionsWithRead<P>) {
  const { memo = true, compare, isFormatAsComp } = options;
  const { key } = blockCtx;
  const { react } = apiCtx;
  const forwardRef = react.forwardRef || noop;
  const Comp = factory();

  // 来自 BlockView 或 SignalView 调用透传了组件时，
  // 无需再做 ref 转发处理，因顶层 api 已包裹了 forwardRef
  if (isFormatAsComp) {
    return Comp;
  }

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
  Block.displayName = memo ? 'HeluxBlock(memo)' : 'HeluxBlock';
  // @ts-ignore
  Block[IS_BLOCK] = true;
  return Block;
}

export function getSignalViewOptions(props: any, ref: any, forV2?: boolean) {
  if (forV2) {
    const { input, format: mayFormat, enableStatus, useStatusList, viewProps } = props;
    return { input, mayFormat, enableStatus, useStatusList, ref, viewProps };
  }
  const { input, format: mayFormat, enableStatus, useStatusList, ...viewProps } = props;
  return { input, mayFormat, enableStatus, useStatusList, ref, viewProps };
}

export function getBlockViewOptions(props: any, ref: any, forV2?: boolean) {
  const getMayFormat = (comp: any, input: any) => {
    // 类型上标识了 comp 必传，但实际运行如未传递 comp 则尝试使用 input 作为渲染函数
    // 此时 input 既是数据输入源，也是渲染函数
    const mayFormat = comp || input;
    return mayFormat;
  };

  if (forV2) {
    const { data: input, comp, enableStatus, useStatusList, viewProps } = props;
    const mayFormat = getMayFormat(comp, input);
    return { input, mayFormat, enableStatus, useStatusList, ref, viewProps, forView: true };
  }

  const { data: input, comp, enableStatus, useStatusList, ...viewProps } = props;
  const mayFormat = getMayFormat(comp, input);
  return { input, mayFormat, enableStatus, useStatusList, ref, viewProps, forView: true };
}
