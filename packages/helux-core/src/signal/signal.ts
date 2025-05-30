import { ReactNode } from '@helux/types';
import { isFn, prefixValKey } from '@helux/utils';
import { original } from 'limu';
import { IS_BLOCK } from '../consts';
import { isAtom, isDerivedAtom } from '../factory/common/atom';
import { disableReuseLatest, enableReuseLatest, getLastest } from '../factory/common/blockScope';
import { getSharedKey } from '../helpers/state';
import type { CoreApiCtx } from '../types/api-ctx';
import type { IBlockOptionsWithRead, LoadingStatus, RenderCbType, SingalVal } from '../types/base';
import { dynamicBlockWithRead } from './block';
import { noopVal } from './common/util';
import { alwaysEqual, wrapDerivedAtomSignalComp, wrapDerivedSignalComp, wrapSignalComp, type IWrapSignalCompOpt } from './common/wrap';

interface ISignalLogicOptions {
  input: SingalVal | (() => SingalVal);
  mayFormat?: (val: any) => any;
  enableStatus?: boolean;
  ref?: any;
  viewProps?: any;
  useStatusList?: () => LoadingStatus[];
  forView?: boolean;
  blockCtx?: any;
}

const str2CompType: Record<string, string> = {
  'Symbol(react.forward_ref)': 'forwardRef',
  'Symbol(react.memo)': 'memo',
};
const compTypeMap: Record<string, number> = {
  forwardRef: 1,
  memo: 1,
};

function getCbType(result: any) {
  if (!result) {
    return 'normal';
  }
  // React.forwardRef 包裹的对象形如
  // $$typeof Symbol(react.forward_ref)
  // render (props, b) => {…}
  // displayName: undefined or 'xxx'

  // React.meno 包裹的对象形如
  // $$typeof : Symbol(react.memo)
  // compare : null
  // type : (props, b) => {…}
  // displayName : undefined or 'xxx'

  const reactTypeOf = result['$$typeof'] || '';
  const str: string = reactTypeOf.toString();
  return (str2CompType[str] || 'normal') as RenderCbType;
}

export function signalLogic(apiCtx: CoreApiCtx, options: ISignalLogicOptions): ReactNode {
  const { input, mayFormat, enableStatus, ref, viewProps, useStatusList, forView } = options;
  const { react } = apiCtx;

  // for $(BlcokComp)
  if (input && (input as any)[IS_BLOCK]) {
    return react.createElement(input as any);
  }

  const compare = alwaysEqual;
  const isInputFn = isFn(input);
  const isFormatFn = isFn(mayFormat);
  const isFormatBool = typeof mayFormat === 'boolean';
  const cbType = getCbType(mayFormat);
  const isFormatAsComp = !!compTypeMap[cbType] || forView;

  // 此时 format 作为渲染函数，input 作为锁定依赖的函数，返回结果同时也会透传给渲染函数
  // const getProps = ()=>({ name: state.info.name, age: state.info.age });
  // const Info = (props)=><div>name:{props.name}-age{props.age}</div>;
  // for $(getProps, Info),
  // for <SignalView input={getProps} format={Info} />
  // for <SignalView input={getProps} format={Info} />
  // for $(()=><div>{stage.name}{state.age}</div>)
  // for $(()=><div>{stage.name}{state.age}</div>, true)
  if (isInputFn && (mayFormat === undefined || isFormatAsComp)) {
    const estatus = isFormatBool ? mayFormat : enableStatus;
    const read: any = input;
    const renderFn: any = isFormatAsComp ? mayFormat : input;
    const { blockCtx } = options;
    const blkOpt: IBlockOptionsWithRead = {
      compare,
      read,
      enableStatus: estatus,
      ref,
      viewProps,
      isFormatAsComp,
      cbType,
      useStatusList,
      blockCtx,
    };
    const Comp = dynamicBlockWithRead(apiCtx, renderFn, blkOpt);
    return react.createElement(Comp);
  }

  let isInputJustRead = false;
  const format = isFormatFn ? mayFormat : noopVal;
  let result = input;
  if (isInputFn) {
    enableReuseLatest();
    result = input();
    // 提前结束读取数据收集过程
    if (!isFormatFn) {
      disableReuseLatest();
    }
    isInputJustRead = true;
  }

  // for $(derivdedAtom) , $(()=>derivdedAtom)
  if (isDerivedAtom(result)) {
    const Comp = wrapDerivedAtomSignalComp(apiCtx, { result, compare, format });
    return react.createElement(Comp);
  }

  // for $(atom), $(()=>atom)
  if (isAtom(result)) {
    const sharedKey = getSharedKey(result);
    const depKey = prefixValKey('val', sharedKey);
    const keyPath = ['val'];
    const options = { sharedKey, sharedState: result, depKey, keyPath, keyPaths: [keyPath], compare, format };
    const Comp = wrapSignalComp(apiCtx, options);
    return react.createElement(Comp);
  }

  // for $(val, (val)=>{/** 展开val多个子节点渲染，或渲染val本身 */})
  // for <SignalView input={()=>val} format={(val)=>...} />
  const readedInfo = getLastest();
  // 传入的 mayFormat 是函数时则执行，这期间会触发收集依赖
  if (isFormatFn) {
    enableReuseLatest();
    result = mayFormat(result);
    disableReuseLatest();
    isInputJustRead = true;
  }

  const { sharedKey, val, stateOrResult, depKey, keyPath, keyPaths, isDerivedResult } = readedInfo;
  if (isInputJustRead || result === val || original(result) === val) {
    // for $(atomDerived.val), user unbox atomDerived manually
    if (readedInfo.isDerivedAtom) {
      const Comp = wrapDerivedAtomSignalComp(apiCtx, { result: stateOrResult, compare, format });
      return react.createElement(Comp);
    }

    // for $(derived.xxx)
    if (isDerivedResult) {
      // @ts-ignore
      const Comp = wrapDerivedSignalComp(apiCtx, { result: stateOrResult, keyPath, compare, format });
      return react.createElement(Comp);
    }

    // for $(atom.val.xxx.yy), $(shared.xxx.yy), $(val, val=>...), <SignalView input={()=>val} format={(val)=>...} />
    if (stateOrResult) {
      const options: IWrapSignalCompOpt = {
        sharedKey,
        sharedState: stateOrResult,
        depKey,
        keyPath,
        keyPaths,
        compare,
        format,
        result,
        shouldUseResult: true,
      };
      if (isInputFn) {
        options.input = input;
      }
      const Comp = wrapSignalComp(apiCtx, options);
      return react.createElement(Comp);
    }
  }

  return result;
}

export function signal(
  apiCtx: CoreApiCtx,
  input: SingalVal | (() => SingalVal),
  mayFormat?: (val: any) => any,
  enableStatus?: boolean,
): ReactNode {
  return signalLogic(apiCtx, { input, mayFormat, enableStatus });
}
